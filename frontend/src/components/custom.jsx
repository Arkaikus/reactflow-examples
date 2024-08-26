import React, { memo, useState } from 'react';
import { Handle, Position, NodeToolbar, NodeResizer } from '@xyflow/react';

function CustomNode({ data }) {
    const [selected, setSelected] = useState(false)

    return (
        <div className="flex items-center justify-start h-full px-4 py-2 align-middle bg-white border-2 rounded-md shadow-md border-stone-400" onClick={() => setSelected(!selected)}>
            <NodeToolbar>
                <button>delete</button>
                <button>copy</button>
                <button>expand</button>

            </NodeToolbar>
            <div className="flex">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                    {data.emoji}
                </div>
                <div className="ml-2">
                    <div className="text-lg font-bold">{data.name}</div>
                    <div className="text-gray-500">{data.job}</div>
                </div>
            </div>
            {selected && <NodeResizer minWidth={100} minHeight={30} />}
            <Handle
                type="target"
                position={Position.Left}
                className="h-16 !bg-teal-500"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="h-16 !bg-teal-500"
            />
        </div>
    );
}

export default memo(CustomNode);
