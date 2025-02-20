import { useState } from "react";
import "./userDetails.css";

const UserDetails = ({ onNameSet }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() === "") {
            setError("Name cannot be empty!");
        } else {
            localStorage.setItem("username", name);
            onNameSet(name);
        }
    };

    return (
        <div className="user-details-modal">
            <div className="user-details-content">
                <h2>Enter your name</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="user-details-input"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError(""); // Clear error when typing
                        }}
                        placeholder="Enter your name"
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default UserDetails;
