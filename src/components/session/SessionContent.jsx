import "./sessionContent.css";
import React, { useRef } from 'react'; // Import useRef

const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    ru: "Russian",
    tr: "Turkish",
};

const getFullLanguageName = (code) => languageMap[code] || "Unknown";

const SessionContent = ({ outputText, actionType, sourceLang, targetLang }) => {
    const textRef = useRef(null); // Ref for the text content

    const handleCopy = () => {
        if (textRef.current) {
            navigator.clipboard.writeText(textRef.current.innerText)
                .then(() => {
                    // Optional: Provide visual feedback to the user
                    console.log('Text copied to clipboard');
                    alert("Text copied")
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert("Failed to copy")
                });
        }
    };


    const renderTitle = () => {
        if (actionType === "Translate") {
            return `Translation: ${getFullLanguageName(sourceLang)} → ${getFullLanguageName(targetLang)}`;
        } else if (actionType === "Summarize") {
            return "Summarized";
        } else {
            return "Summarized"; // Default title
        }
    };

    const renderOutput = () => {
        if (!outputText) {
            return <p>Your AI-generated output will appear here...</p>;
        }

        const listItems = outputText.split("\n").map((paragraph, index) => (
            <li key={index}>{paragraph.trim()}</li>
        ));

        return (
            <ul ref={textRef}>{listItems}</ul> // Added ref here
        );
    };

    return (
        <div className="session-content-container">
            <div className="session-content">
                <h6>{renderTitle()}</h6>
                <div className="session-output">
                    {renderOutput()}
                </div>
                <button className="copy-button" onClick={handleCopy}>
                    <p>Copy Text</p>
                    <i className='bx bxs-copy'></i> {/* Or your preferred icon */}
                </button>
            </div>
        </div>
    );
};

export default SessionContent;