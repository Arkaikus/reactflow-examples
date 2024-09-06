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

import "@xyflow/react/dist/base.css";

import CustomNode from "./Custom";
import { useDragDrop } from "../context/drag-drop";

const nodeTypes = {
    custom: CustomNode
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
    })
        .then(response => response.json())

}


export const FlowExample = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDragDrop();

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            // check if the dropped element is valid
            if (!type) {
                return;
            }

            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getNodeId(),
                type,
                position,
                data: { name: "", job: "", emoji: "" },
                width: 150,
                height: 50,
            };
            createNode(newNode).then(data => {
                newNode.id = data.id
                setNodes((nds) => nds.concat(newNode));
            });
        },
        [screenToFlowPosition, type],
    );

    const onConnect = useCallback(
        (params) => {
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
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setEdges((eds) => addEdge(params, eds))
                });

        },
        []
    );

    const [state, setState] = useState({ name: "", job: "", emoji: "" });
    const lock = useRef(false);

    const addNode = useCallback(
        () => {
            const id = getNodeId();
            const newNode = {
                id: id,
                type: "custom",
                data: state,
                position: {
                    x: 0,
                    y: 0 + (nodes.length + 1) * 20
                },
                width: 150,
                height: 50,
            };
            createNode(newNode).then(data => {
                console.log(data);
                newNode.id = data.id;
                setNodes((nds) => nds.concat(newNode));
            });
        }
    );

    const onNodesDelete = useCallback(
        (deleted) => {
            deleted.forEach((node) => {
                fetch(`${VITE_API_PATH}/nodes/` + node.id, { method: "DELETE" })
                    .then(response => response.json())
                    .then(console.log);
            });
            setEdges(
                deleted.reduce((acc, node) => {
                    const incomers = getIncomers(node, nodes, edges);
                    const outgoers = getOutgoers(node, nodes, edges);
                    const connectedEdges = getConnectedEdges([node], edges);

                    const remainingEdges = acc.filter(
                        (edge) => !connectedEdges.includes(edge),
                    );

                    const createdEdges = incomers.flatMap(({ id: source }) =>
                        outgoers.map(({ id: target }) => ({
                            id: `${source}->${target}`,
                            source,
                            target,
                        })),
                    );

                    return [...remainingEdges, ...createdEdges];
                }, edges),
            );
        },
        [nodes, edges],
    );

    const onEdgesDelete = useCallback(
        (deleted) => {
            deleted.forEach((edge) => {
                fetch(`${VITE_API_PATH}/edges/` + edge.id, { method: "DELETE" })
                    .then(response => response.json())
                    .then(console.log);
            });
            setEdges((eds) => eds.filter((e) => !deleted.includes(e)));
        },
        [edges],
    );

    const onNodeDragStop = useCallback(
        (event, node) => {
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
                    height: node.height
                }),
            })
                .then(response => response.json())
                .then(console.log);
        },
    );

    // Fetch nodes from the server
    useEffect(() => {
        if (lock.current) return;
        lock.current = true;
        console.log("running effect")
        fetch(`${VITE_API_PATH}/nodes/`)
            .then(response => response.json())
            .then(data => {
                data.forEach((newNode) => {
                    setNodes((nds) => nds.concat(newNode))
                })
            });
        fetch(`${VITE_API_PATH}/edges/`)
            .then(response => response.json())
            .then(data => {
                data.forEach((newEdge) => {
                    setEdges((eds) => addEdge(newEdge, eds))
                })
            });
    }, [])

    return (
        <div className="flex flex-col w-full h-full">
            <div className="p-4">
                <input className="p-2 m-2 text-indigo-400 bg-white"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => {
                        setState((prev) => ({ ...prev, name: e.target.value }));
                    }}
                />
                <input className="p-2 m-2 text-indigo-400 bg-white"
                    type="text"
                    placeholder="Job"
                    onChange={(e) => {
                        setState((prev) => ({ ...prev, job: e.target.value }));
                    }}
                />
                <input className="p-2 m-2 text-indigo-400 bg-white"
                    type="text"
                    placeholder="Emoji"
                    onChange={(e) => {
                        setState((prev) => ({ ...prev, emoji: e.target.value }));
                    }}
                />
                <button onClick={addNode}>add node</button>
            </div>
            <div className="w-full h-full">
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
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                    <Background color="#ccc" variant={BackgroundVariant.Dots} />
                </ReactFlow>
            </div>
        </div>
    );
};