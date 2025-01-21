import React from "react";
import { useDragDrop } from "../context/drag-drop";
import { ExampleNodeContent } from "./ExampleNode";

function Sidebar() {
    const [_, setData] = useDragDrop();
    let data = { emoji: "🆕", name: "custom", job: "node" };
    const onDragStart = (event, data) => {
        setData(data);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside>
            <div className="mb-4 text-xl description">
                Workflow Builder
            </div>
            <div className="mb-4 description">
                You can drag these nodes to the pane on the right.
            </div>
            <div
                className="dndnode input"
                onDragStart={(event) => onDragStart(event, data)}
                draggable
            >
                <ExampleNodeContent data={data} />
            </div>
            {/* add more node types here */}
            {/* <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Default Node
            </div> */}
        </aside>
    );
}

export default Sidebar;
