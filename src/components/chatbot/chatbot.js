import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt, faCompressAlt, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'; // Added ArrowsAlt icon for fullscreen
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the library
import "./chatbot.css";

// Initialize the Google Generative AI model with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY); // Using the API key from .env
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Chatbot = ({ onCodeGenerate }) => {
  const [isChatOpen, setIsChatOpen] = useState(true); // State for collapse/expand
  const [userInput, setUserInput] = useState(""); // State for user input
  const [messages, setMessages] = useState([]); // Chat messages
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen toggle

  // Load chat history from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages)); // Parse and set chat history
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages)); // Save to localStorage
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send the user input to Gemini API to get a response
      const prompt = userInput;
      const result = await model.generateContent(prompt);

      // Get the AI response
      const botResponse = { sender: "bot", text: result.response.text() };
      setMessages((prev) => [...prev, botResponse]);

      // Extract HTML, CSS, and JavaScript from the response text
      const responseText = result.response.text();

      // Parse the response for HTML, CSS, and JavaScript content
      const htmlMatch = responseText.match(/```html([\s\S]*?)```/);
      const cssMatch = responseText.match(/```css([\s\S]*?)```/);
      const jsMatch = responseText.match(/```javascript([\s\S]*?)```/);

      // Send extracted content to the parent component
      if (htmlMatch) {
        onCodeGenerate('html', htmlMatch[1].trim());
      }
      if (cssMatch) {
        onCodeGenerate('css', cssMatch[1].trim());
      }
      if (jsMatch) {
        onCodeGenerate('js', jsMatch[1].trim());
      }

    } catch (error) {
      console.error("Error with the Gemini API:", error);
      const errorResponse = { sender: "bot", text: "Sorry, there was an error processing your request." };
      setMessages((prev) => [...prev, errorResponse]);
    }

    setUserInput(""); // Clear input
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className={`chatbot ${isChatOpen ? "expanded" : "collapsed"} ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="chatbot-navbar">
        <span>Ask Here</span>
        <div>
          <button
            className="collapse-btn"
            onClick={() => setIsChatOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={isChatOpen ? faCompressAlt : faExpandAlt} />
          </button>
          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
          >
            <FontAwesomeIcon icon={faArrowsAlt} />
          </button>
        </div>
      </div>
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
