import "./userContent.css";

const UserContent = ({ userInput, detectedLanguage }) => {
    return (
        <div className="user-container">
            <div className="user-content">
                <p>{userInput || "Enter text above to see it here..."}</p>
                {detectedLanguage && (
                    <p className="detected-language">
                        {detectedLanguage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserContent;
