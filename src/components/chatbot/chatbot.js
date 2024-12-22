import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpandAlt,
  faCompressAlt,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./chatbot.css";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Chatbot = ({ onCodeGenerate }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatHistory");
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await model.generateContent(userInput);
      const botResponse = { sender: "bot", text: result.response.text() };
      setMessages((prev) => [...prev, botResponse]);

      const responseText = result.response.text();
      const htmlMatch = responseText.match(/```html([\s\S]*?)```/);
      const cssMatch = responseText.match(/```css([\s\S]*?)```/);
      const jsMatch = responseText.match(/```javascript([\s\S]*?)```/);

      if (htmlMatch) onCodeGenerate("html", htmlMatch[1].trim());
      if (cssMatch) onCodeGenerate("css", cssMatch[1].trim());
      if (jsMatch) onCodeGenerate("js", jsMatch[1].trim());
    } catch (error) {
      console.error("Error:", error);
      const errorResponse = {
        sender: "bot",
        text: "Sorry, there was an error.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
    setUserInput("");
  };
  const toggleChatOpen = () => {
    setIsChatOpen((prev) => {
      if (prev) {
        setIsFullscreen(false); // Reset fullscreen when collapsing
      }
      return !prev;
    });
  };

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);
  const clearLocalStorage = () => {
    localStorage.removeItem("chatHistory");
    setMessages([]);
  };

  return (
    <div
      className={`chatbot ${isChatOpen ? "expanded" : "collapsed"} ${
        isFullscreen ? "fullscreen" : ""
      }`}
    >
      <div className="chatbot-navbar">
        <span>Ask Here</span>
        <div>
          <button className="collapse-btn" onClick={toggleChatOpen}>
            <FontAwesomeIcon icon={isChatOpen ? faCompressAlt : faExpandAlt} />
          </button>

          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            <FontAwesomeIcon icon={faArrowsAlt} />
          </button>
        </div>
      </div>

      <button className="clear-btn" onClick={clearLocalStorage}>
        Clear Chat History
      </button>

      {isChatOpen && (
        <div className="chatbot-body">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
