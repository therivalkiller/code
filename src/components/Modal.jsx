import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>How to Use the Chatbot</h2>
        <p>
          1. Type your request in the chatbot to generate HTML, CSS, or JavaScript code.
        </p>
        <p>
          2. The chatbot will respond with code snippets, which will be
          automatically inserted into the respective editor.
        </p>
        <p>
          3. Modify the code as needed, and see the live preview in the output
          section.
        </p>
        <button className="close-button" onClick={onClose}>
          Got It!
        </button>
      </div>
    </div>
  );
};

export default Modal;
