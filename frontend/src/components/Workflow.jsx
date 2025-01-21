import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Background,
    BackgroundVariant,
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    getIncomers,
    getOutgoers,
    getConnectedEdges,
    useReactFlow,
} from "@xyflow/react";
import { MdClose } from "react-icons/md";

import "@xyflow/react/dist/base.css";

import ExampleNode from "./ExampleNode";
import { useDragDrop } from "../context/drag-drop";

const nodeTypes = {
    custom: ExampleNode,
};

const getNodeId = () => `${String(+new Date()).slice(6)}`;

const initialNodes = [];
const initialEdges = [];
const VITE_API_PATH = import.meta.env.VITE_API_PATH;

function createNode(node) {
    return fetch(`${VITE_API_PATH}/nodes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(node),
    }).then((response) => response.json());
}
function updateNode(node) {
    return fetch(`${VITE_API_PATH}/nodes/${node.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(node),
    }).then((response) => response.json());
}

function toggleBackdrop() {
    const editNodeModal = document.getElementById("editNodeModal");
    const backdrop = document.getElementById("backdrop");
    editNodeModal.classList.toggle("translate-y-full");
    backdrop.classList.toggle("hidden");
}

export const Workflow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [data, _] = useDragDrop();

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            /* CREATES NEW NODE ON DROP */
            event.preventDefault();

            // check if the dropped element is valid
            if (data) {
                // project was renamed to screenToFlowPosition
                // and you don't need to subtract the reactFlowBounds.left/top anymore
                // details: https://reactflow.dev/whats-new/2023-11-10
                const position = screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });
                const newNode = {
                    id: getNodeId(),
                    type: "custom",
                    position,
                    data: data,
                    width: 150,
                    height: 100,
                };
                createNode(newNode).then((data) => {
                    newNode.id = data.id;
                    setNodes((nds) => nds.concat(newNode));
                });
            }
        },
        [screenToFlowPosition, data]
    );

    const onConnect = useCallback((params) => {
        fetch(`${VITE_API_PATH}/edges`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "default",
                ...params,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEdges((eds) => addEdge(params, eds));
            });
    }, []);

    const [currentNode, setCurrentNode] = useState(null);
    const [nodeData, setNodeData] = useState({ name: "", job: "", emoji: "" });
    const lock = useRef(false);

    const saveNode = useCallback(() => {
        currentNode.data = nodeData;
        updateNode(currentNode).then((data) => {
            console.log(data);
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === currentNode.id) {
                        return currentNode;
                    }
                    return node; // Return unchanged nodes
                })
            );
            toggleBackdrop();
        });
    });

    const onNodesDelete = useCallback(
        (deleted) => {
            deleted.forEach((node) => {
                fetch(`${VITE_API_PATH}/nodes/` + node.id, { method: "DELETE" })
                    .then((response) => response.json())
                    .then(console.log);
            });
            setEdges(
                deleted.reduce((acc, node) => {
                    const incomers = getIncomers(node, nodes, edges);
                    const outgoers = getOutgoers(node, nodes, edges);
                    const connectedEdges = getConnectedEdges([node], edges);

                    const remainingEdges = acc.filter(
                        (edge) => !connectedEdges.includes(edge)
                    );

                    const createdEdges = incomers.flatMap(({ id: source }) =>
                        outgoers.map(({ id: target }) => ({
                            id: `${source}->${target}`,
                            source,
                            target,
                        }))
                    );

                    return [...remainingEdges, ...createdEdges];
                }, edges)
            );
        },
        [nodes, edges]
    );

    const onEdgesDelete = useCallback(
        (deleted) => {
            deleted.forEach((edge) => {
                fetch(`${VITE_API_PATH}/edges/` + edge.id, { method: "DELETE" })
                    .then((response) => response.json())
                    .then(console.log);
            });
            setEdges((eds) => eds.filter((e) => !deleted.includes(e)));
        },
        [edges]
    );

    const onNodeDragStop = useCallback((event, node) => {
        fetch(`${VITE_API_PATH}/nodes/` + node.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: node.id,
                type: node.type,
                data: node.data,
                position: node.position,
                width: node.width,
                height: node.height,
            }),
        })
            .then((response) => response.json())
            .then(console.log);
    });

    const onNodeClick = useCallback((event, node) => {
        setCurrentNode(node);
        setNodeData(node.data);
        toggleBackdrop();
    });

    // Fetch nodes from the server
    useEffect(() => {
        if (lock.current) return;
        lock.current = true;
        console.log("running effect");
        fetch(`${VITE_API_PATH}/nodes/`)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((newNode) => {
                    setNodes((nds) => nds.concat(newNode));
                });
            });
        fetch(`${VITE_API_PATH}/edges/`)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((newEdge) => {
                    setEdges((eds) => addEdge(newEdge, eds));
                });
            });
    }, []);

    return (
        <div className="flex flex-col w-full">
            <div className="relative flex flex-col w-full min-h-full">
                <div className="flex-grow">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodesDelete={onNodesDelete}
                        onNodeDragStop={onNodeDragStop}
                        onEdgesDelete={onEdgesDelete}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <MiniMap />
                        <Controls />
                        <Background
                            color="#ccc"
                            variant={BackgroundVariant.Dots}
                        />
                    </ReactFlow>
                </div>
                <div
                    id="backdrop"
                    className="fixed inset-0 hidden bg-black/50 backdrop-blur-md"
                ></div>
                <div
                    id="editNodeModal"
                    className="fixed bottom-0 left-0 right-0 z-40 p-4 transition-transform transform translate-y-full bg-white border-2 rounded-md shadow-md border-stone-400"
                >
                    <div className="flex justify-between">
                        <div className="text-right">Edit Node</div>
                        <button onClick={toggleBackdrop}>
                            <MdClose />
                        </button>
                    </div>
                    <div className="flex">
                        <input
                            className="p-2 m-2 bg-white"
                            type="text"
                            placeholder="Emoji"
                            value={nodeData.emoji}
                            onChange={(e) => {
                                setNodeData((prev) => ({
                                    ...prev,
                                    emoji: e.target.value,
                                }));
                            }}
                        />
                        <input
                            className="p-2 m-2 bg-white"
                            type="text"
                            placeholder="Name"
                            value={nodeData.name}
                            onChange={(e) => {
                                setNodeData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }));
                            }}
                        />
                        <input
                            className="p-2 m-2 bg-white"
                            type="text"
                            placeholder="Job"
                            value={nodeData.job}
                            onChange={(e) => {
                                setNodeData((prev) => ({
                                    ...prev,
                                    job: e.target.value,
                                }));
                            }}
                        />
                        <button className="text-white bg-indigo-500" onClick={saveNode}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
