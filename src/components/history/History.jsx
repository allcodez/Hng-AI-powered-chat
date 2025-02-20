import { useContext } from "react";
import "./history.css";
import { SidebarContext } from "../../context/SidebarContext";

const History = () => {
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext); // Use the context

    return (
        <div className={`history-container ${isSidebarOpen ? "" : "closed"}`}>
            <div className="history-header">
                <b>History</b>
                <p>View your recent activities here.</p>
                {/* <button onClick={toggleSidebar}>Close</button> Add a close button */}
            </div>
        </div>
    );
};

export default History;