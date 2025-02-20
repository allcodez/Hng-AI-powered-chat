import { useContext, useState, useEffect } from "react";
import "./ai.css";
import Transition from "../../components/transition/Transition";
import UserDetails from "../../components/userDetails/UserDetails";
import History from "../../components/history/History";
import Session from "../../components/session/Session";
import { SidebarContext } from "../../context/SidebarContext.jsx";

const Ai = () => {
    const [name, setName] = useState(localStorage.getItem("username") || "");
    const { toggleSidebar } = useContext(SidebarContext);
    const [isChrome, setIsChrome] = useState(true);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        setIsChrome(userAgent.includes("chrome") && !userAgent.includes("edge") && !userAgent.includes("opr"));
    }, []);

    if (!isChrome) {
        return <div className="unsupported-browser">
            <b>Your browser is not supported. Please use Chrome or a Chromium-based browser for the best experience.</b>
            <br />
            {/* You might want to provide links to download Chrome or Edge here */}
            <b>Consider using <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">Google Chrome</a></b>
        </div>;
    }

    return (
        <>
            {!name ? (
                <UserDetails onNameSet={setName} />
            ) : (
                <div className="ai-container">
                    <Session name={name} />
                </div>
            )}
        </>
    );
};

export default Transition(Ai);
