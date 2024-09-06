import React, { useState } from "react";
// import Sidebar from "./Sidebar"
import { FlowExample } from "./Workflow";
import DragDropContext from "../context/drag-drop";

const Dashboard = () => {
    const [type, setType] = useState(null);

    return (
        <DragDropContext.Provider value={[type, setType]}>
            <div className="flex w-full h-full m-0">
                {/* <Sidebar className="w-2/12" /> */}
                <FlowExample className="w-full" />

            </div>
        </DragDropContext.Provider>
    );
};

export default Dashboard;
