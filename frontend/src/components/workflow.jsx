import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Background,
    BackgroundVariant,
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls
} from "@xyflow/react";

import "@xyflow/react/dist/base.css";

import CustomNode from "./custom";

const nodeTypes = {
    custom: CustomNode
};

const getNodeId = () => `${String(+new Date()).slice(6)}`;

const initialNodes = [
    // {
    //     id: "1",
    //     type: "custom",
    //     data: { name: "John Doe", job: "CEO", emoji: "😎" },
    //     position: { x: 0, y: 50 },
    //     edges: {}
    // },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export const FlowExample = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        []
    );
    const [state, setState] = useState({ name: "", job: "", emoji: "" });
    const lock = useRef(false);

    const onAdd = () => {
        const id = getNodeId();
        const newNode = {
            id,
            type: "custom",
            data: state,
            position: {
                x: 0,
                y: 0 + (nodes.length + 1) * 20
            }
        };
        setNodes((nds) => nds.concat(newNode));
    };


    useEffect(() => {
        if (lock.current) return;
        lock.current = true;
        console.log("running effect")
        fetch("http://localhost:8000/nodes/")
            .then(response => response.json())
            .then(data => {
                data.forEach((newNode) => {
                    // console.log(item) 
                    setNodes((nds) => nds.concat(newNode))
                })
            });
    }, [])

    return (
        <div className="flex flex-col h-full">
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
                <button onClick={onAdd}>add node</button>
            </div>
            <div className="w-full h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
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