import React, { useState } from "react";
import axios from "axios"; // For making API requests to the AI service

const StudentReviewerChatbot = () => {
    const [inputText, setInputText] = useState(""); // User's input text
    const [messages, setMessages] = useState([]); // List of chat messages

    // Handle sending the message
    const handleSendMessage = async () => {
        if (!inputText.trim()) return; // Prevent sending empty messages

        // Update chat with user's message
        setMessages([...messages, { sender: "user", text: inputText }]);
        setInputText(""); // Clear input field

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo", // Use the latest GPT model
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant.",
                        },
                        { role: "user", content: inputText },
                    ],
                    max_tokens: 150,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.API_KEY}`, // Using the API key from environment variables
                    },
                }
            );

            console.log(response.data); // Log the response to check the structure
            const summary = response.data.choices[0].message.content;

            // Update the chat with AI's summary
            setMessages([
                ...messages,
                { sender: "user", text: inputText },
                { sender: "ai", text: summary },
            ]);
        } catch (error) {
            console.error(
                "Error summarizing content:",
                error.response ? error.response.data : error.message
            );
            setMessages([
                ...messages,
                { sender: "user", text: inputText },
                { sender: "ai", text: "Error generating summary." },
            ]);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Student Reviewer Chatbot</h2>

            {/* Chat window */}
            <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "20px",
                    minHeight: "300px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    backgroundColor: "#f9f9f9",
                    marginBottom: "20px",
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            textAlign:
                                message.sender === "user" ? "right" : "left",
                            marginBottom: "10px",
                        }}
                    >
                        <p
                            style={{
                                display: "inline-block",
                                padding: "10px",
                                backgroundColor:
                                    message.sender === "user"
                                        ? "#a0e0ff"
                                        : "#e0e0e0",
                                borderRadius: "10px",
                            }}
                        >
                            {message.text}
                        </p>
                    </div>
                ))}
            </div>

            {/* User input */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type something to summarize..."
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        marginRight: "10px",
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default StudentReviewerChatbot;
