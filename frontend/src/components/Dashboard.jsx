import React, { useState } from "react";
import Sidebar from "./Sidebar"
import { Workflow } from "./Workflow";
import DragDropContext from "../context/drag-drop";

const Dashboard = () => {
    const [data, setData] = useState(null);

    return (
        <DragDropContext.Provider value={[data, setData]}>
            <div className="flex w-full h-full m-0">
                <Sidebar className="w-2/12" />
                <Workflow className="w-full" />
            </div>
        </DragDropContext.Provider>
    );
};

export default Dashboard;
