import { useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Button zum Öffnen/Schließen */}
      <button onClick={toggleChat} className="button-chat">
        {isOpen ? (
          <IoMdClose size={24} />
        ) : (
          <IoChatbubbleEllipsesOutline size={24} />
        )}
      </button>

      {/* Popup-Container */}
      {isOpen && (
        <div className="iframe-div">
          <iframe
            className="iframe-style"
            src="https://www.chatbase.co/chatbot-iframe/Nrq6mf-fdJLGJWCQ4SWli"
            frameBorder="0"
            title="Chatbot"
          />
        </div>
      )}

      <style jsx>{`
        .button-chat {
          position: fixed;
          bottom: 75px;
          right: 20px;
          padding: 12px 16px;
          border-radius: 30px;
          background-color: #4f46e5;
          color: white;
          border: none;
          cursor: pointer;
          z-index: 1000;
        }
        .iframe-div {
          position: fixed;
          bottom: 130px;
          right: 55px;
          width: 350px;
          height: 500px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          overflow: hidden;
          z-index: 1000;
          background-color: #fff;
        }
        .iframe-style {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default ChatbotPopup;
