import { useState, useEffect, useRef } from "react";
import "./session.css";
import SessionContent from "./SessionContent.jsx";
import UserContent from "../userContent/UserContent";
import ISO6391 from 'iso-639-1';

const Session = ({ name }) => {
    const [userInput, setUserInput] = useState("");
    const [tasks, setTasks] = useState([]);
    const sessionRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [loading, setLoading] = useState(false); // Global loading state
    const textAreaRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "40px"; // Reset height
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"; // Set new height
        }
    }, [userInput]);

    // Load history from localStorage when component mounts
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("taskHistory")) || [];
        setTasks(savedHistory);

        savedHistory.forEach(task => {
            if (task.actionType === "Summarize" && task.output === null) {
                retrySummarization(task);
            }
        });
    }, []);

    // Scroll to the latest task when a new one is added
    useEffect(() => {
        if (sessionRef.current) {
            sessionRef.current.scrollTop = sessionRef.current.scrollHeight;
        }
    }, [tasks]);

    // Detect if the user is at the top, show scroll button
    useEffect(() => {
        const handleScroll = () => {
            if (sessionRef.current) {
                const scrollTop = sessionRef.current.scrollTop;
                const scrollHeight = sessionRef.current.scrollHeight;
                const clientHeight = sessionRef.current.clientHeight;

                const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 10;
                const isScrolledUp = scrollTop > 100; // Show button if scrolled up 100px

                setShowScrollButton(isScrolledUp && !isAtBottom);
            }
        };

        if (sessionRef.current) {
            sessionRef.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (sessionRef.current) {
                sessionRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const retrySummarization = async (task) => {
        try {
            setLoading(true); // Start loading
            setError(null); // Clear any previous errors
            if ('ai' in self && 'summarizer' in self.ai) {
                const summarizer = await self.ai.summarizer.create({
                    type: "key-points",
                    format: "plain-text",
                    length: "medium",
                });

                const summary = await summarizer.summarize(task.input);

                // Update task with the output
                updateTaskOutput(task.id, summary);
            }
        } catch (error) {
            console.error("Summarization retry error:", error);
            setError("Error during summarization. Please try again later.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (sessionRef.current) {
            sessionRef.current.scrollTo({
                top: sessionRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    // Function to save task
    const addTask = (actionType, input, sourceLang = null, targetLang = null) => {
        const newTask = {
            actionType,
            input,
            output: null, // Output starts as null
            id: Date.now(),
            sourceLang, // Store detected source language at time of translation
            targetLang, // Store selected target language at time of translation
            detectedLanguage: null, // Store detected language for the task
        };

        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks, newTask];
            localStorage.setItem("taskHistory", JSON.stringify(updatedTasks));
            return updatedTasks;
        });

        return newTask; // Return reference to update later
    };

    // Function to update task output
    const updateTaskOutput = (taskId, output) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task =>
                task.id === taskId ? { ...task, output } : task
            );
            localStorage.setItem("taskHistory", JSON.stringify(updatedTasks));
            return updatedTasks;
        });
    };

    // Function to detect language
    const detectLanguage = async (text, taskId) => {
        setError(null);
        if (!text) return;

        try {
            setLoading(true); // Start loading
            if ('ai' in self && 'languageDetector' in self.ai) {
                const detector = await self.ai.languageDetector.create();
                const detected = await detector.detect(text);
                if (detected.length > 0) {
                    const languageCode = detected[0].detectedLanguage;

                    // Update the task with the detected language
                    setTasks(prevTasks => {
                        const updatedTasks = prevTasks.map(task =>
                            task.id === taskId ? { ...task, detectedLanguage: languageCode } : task
                        );
                        localStorage.setItem("taskHistory", JSON.stringify(updatedTasks));
                        return updatedTasks;
                    });
                }
            }
        } catch (error) {
            console.error("Language detection error:", error);
            setError("Error detecting language. Please try again later.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // const getFullLanguageName = (code) => {
    //     const languages = {
    //         en: "English",
    //         es: "Spanish",
    //         fr: "French",
    //         pt: "Portuguese",
    //         ru: "Russian",
    //         tr: "Turkish",
    //         de: "German",
    //         it: "Italian",
    //         zh: "Chinese",
    //         ja: "Japanese",
    //         ko: "Korean",
    //         ar: "Arabic",
    //         hi: "Hindi",
    //         // Add more languages as needed
    //     };
    //     return languages[code] || "Unknown";
    // };

    const getFullLanguageName = (code) => {
        return ISO6391.getName(code) || "Unknown";
    };


    // Function to translate text
    const translateText = async (inputText, taskId, targetLang) => {
        setError(null);
        const task = tasks.find(task => task.id === taskId);
        if (!task || !task.detectedLanguage) {
            setError("Please detect the language before translating.");
            return;
        }

        try {
            setLoading(true); // Start loading
            const translator = await self.ai.translator.create({
                sourceLanguage: task.detectedLanguage,
                targetLanguage: targetLang,
            });

            const translatedText = await translator.translate(inputText);

            // Update task with output and ensure actionType is 'Translate'
            setTasks(prevTasks => {
                const updatedTasks = prevTasks.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            output: translatedText,
                            sourceLang: task.detectedLanguage,
                            targetLang,
                            actionType: "Translate" // Ensure this is set
                        }
                        : task
                );
                localStorage.setItem("taskHistory", JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        } catch (error) {
            console.error("Translation error:", error);
            setError("An error occurred during translation. \n Please try another language.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Function to summarize text
    const summarizeText = async (inputText, taskId) => {
        setError(null);
        try {
            setLoading(true); // Start loading
            if ('ai' in self && 'summarizer' in self.ai) {
                const summarizer = await self.ai.summarizer.create({
                    type: "key-points",
                    format: "plain-text",
                    length: "medium",
                });

                const summary = await summarizer.summarize(inputText);

                // Update task with the output
                updateTaskOutput(taskId, summary); // Store raw summary without formatting
            }
        } catch (error) {
            console.error("Summarization error:", error);
            setError("An error occurred during summarization. Please try again later.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "pt", name: "Portuguese" },
        { code: "ru", name: "Russian" },
        { code: "tr", name: "Turkish" },
    ];

    const handleSend = () => {
        if (!userInput) return;

        // Add new task
        const newTask = addTask("User Input", userInput);

        // Detect language for the new task
        detectLanguage(userInput, newTask.id);

        setUserInput(""); // Clear input field
    };

    // Handle Language Selection
    const handleLanguageSelect = (taskId, langCode) => {
        setSelectedLanguage((prev) => ({
            ...prev,
            [taskId]: langCode,
        }));
        setDropdownOpen((prev) => ({
            ...prev,
            [taskId]: false, // Close dropdown after selection
        }));
    };

    return (
        <div className="session-container">
            {/* Show Loader when loading */}

            {/* Hide session header when there are tasks */}
            {tasks.length === 0 && (
                <div className="session-header">
                    <h1>👋🏽 Hi, {name}!</h1>
                    <p>I'm here to assist you with AI-powered features, including Language <br /> Translation, Text Summarization, and Language Detection.</p>
                </div>
            )}

            <div className="new-session" ref={sessionRef}>
                {tasks.map(task => (
                    <div key={task.id} className="task-container">
                        {/* User's input content */}
                        <UserContent
                            userInput={task.input}
                            detectedLanguage={getFullLanguageName(task.detectedLanguage)}
                        />

                        {/* Translation UI - Show only if task has no output yet */}
                        {task.actionType === "User Input" && !task.output && (
                            <div className="translate-container">
                                <div className="select">
                                    <div
                                        className="selected task-button"
                                        onClick={() =>
                                            setDropdownOpen((prev) => ({
                                                ...prev,
                                                [task.id]: !prev[task.id],
                                            }))
                                        }
                                    >
                                        {languages.find((lang) => lang.code === selectedLanguage[task.id])?.name || "Select Language"}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="1em"
                                            viewBox="0 0 512 512"
                                            className={`arrow ${dropdownOpen[task.id] ? "open" : ""}`}
                                        >
                                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                                        </svg>
                                    </div>

                                    {dropdownOpen[task.id] && (
                                        <div className="options">
                                            {languages
                                                .filter((lang) => lang.code !== task.detectedLanguage) // Exclude detected language
                                                .map((lang) => (
                                                    <div
                                                        key={lang.code}
                                                        title={lang.name}
                                                        onClick={() => handleLanguageSelect(task.id, lang.code)}
                                                    >
                                                        <input
                                                            id={lang.code}
                                                            name={`option-${task.id}`}
                                                            type="radio"
                                                            checked={selectedLanguage[task.id] === lang.code}
                                                            readOnly
                                                        />
                                                        <label className="option" htmlFor={lang.code} data-txt={lang.name}>
                                                            {lang.name}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                className="task-button"
                                    onClick={() =>
                                        selectedLanguage[task.id] &&
                                        translateText(task.input, task.id, selectedLanguage[task.id])
                                    }
                                    disabled={!selectedLanguage[task.id]}
                                >
                                    Translate
                                </button>
                            </div>
                        )}

                        {/* Summarize button - Only show if there's no output yet */}
                        {task.actionType === "User Input" &&
                            task.input.length >= 150 &&
                            task.detectedLanguage === "en" &&
                            !task.output && (
                                <div className="summarize-container">
                                    <button className="task-button" onClick={() => summarizeText(task.input, task.id)}>
                                        Summarize
                                    </button>
                                </div>
                            )}

                        {/* Output - Show result after summarization or translation */}
                        {task.output && (
                            <SessionContent
                                outputText={task.output}
                                actionType={task.actionType}
                                sourceLang={task.sourceLang || "Unknown"}
                                targetLang={task.targetLang || "Unknown"}
                            />
                        )}
                    </div>
                ))}

            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <i className='scroll-to-bottom bx bx-down-arrow-alt' onClick={scrollToBottom}></i>
            )}

            {/* {loading && <p className="loading-text">⏳ Processing...</p>} */}
            {loading && <p className="loading-text">⏳ Processing...</p>}
            {error && <p className="error-message">{error}</p>}


            <div className="session-body">
                <div className="session-body-container">
                    <textarea
                        ref={textAreaRef}
                        placeholder="✨ Write your text here"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onPaste={(e) => {
                            e.preventDefault();
                            const pastedText = e.clipboardData.getData("text");
                            setUserInput((prev) => prev + pastedText);
                        }}
                        rows="1"
                        style={{
                            width: "100%",
                            minHeight: "40px",
                            maxHeight: "200px",
                            overflowY: "auto",
                            resize: "none"
                        }}
                    />
                    <div className="session-button">
                        <div style={{ fontSize: "14px", color: "#888", marginTop: "5px" }}>
                            {userInput.length} characters
                        </div>
                        <button onClick={handleSend}>
                            <p>Send</p>
                            <i className='bx bxs-send'></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Session;