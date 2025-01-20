import React, { memo, useState } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";

export function CustomNodeFrame({ data }) {
    return (
        <div className="flex items-center w-full h-full m-0 align-middle border-2 rounded-md shadow-md border-stone-400">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                {data.emoji}
            </div>
            <div className="ml-2">
                <div className="text-lg font-bold">{data.name}</div>
                <div className="text-gray-500">{data.job}</div>
            </div>
        </div>
    );
}

function CustomNode({ data, selected }) {
    return (
        <div className="flex items-center justify-start h-full align-middle bg-white">
            <CustomNodeFrame data={data} />
            <NodeResizer
                minWidth={200}
                minHeight={100}
                isVisible={!!selected}
            />
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
