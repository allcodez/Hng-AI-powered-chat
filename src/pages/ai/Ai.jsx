import { useContext, useState } from "react";
import "./ai.css";
import Transition from "../../components/transition/Transition";
import UserDetails from "../../components/userDetails/UserDetails";
import History from "../../components/history/History";
import Session from "../../components/session/Session";
import { SidebarContext } from "../../context/SidebarContext.jsx";

const Ai = () => {
    const [name, setName] = useState(localStorage.getItem("username") || "");
    const { toggleSidebar } = useContext(SidebarContext); // Use the context

    return (
        <>
            {!name ? (
                <UserDetails onNameSet={setName} />
            ) : (
                <div className="ai-container">
                    {/* <History /> */}
                    <Session name={name} />

                </div>
            )}
            {/* <div className="sidebar-close" onClick={toggleSidebar}>
                <p><i className='bx bx-dock-left'></i></p>
            </div> */}
        </>
    );
};

export default Transition(Ai);
