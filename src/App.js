import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';


function App() {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to scroll chat to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Effect to scroll to bottom whenever messages change
  useEffect(scrollToBottom, [messages]);

  // Function to handle sending a text message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    setIsLoading(true);

    // Create a new user message object and update messages state
    const newMessage = { content: input, role: 'user', type: 'text' };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      // Send message to backend and receive response
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/query`, { messages: updatedMessages });

      const botMessage = { content: response.data.text, role: 'assistant', type: 'text' };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      setIsLoading(false);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // Function to handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ['application/pdf', 'text/plain'];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile); // Set file state if valid type
    }
  }

  // Function to upload selected file
  const uploadFile = async (e) => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file); // Append selected file to form data

    try {
      // Upload file to backend and receive response
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Create a new assistant message object from upload response
      const botMessage = { content: response.data.message, role: 'assistant', type: 'text' };
      setMessages(prevMessages => [...prevMessages, botMessage]);

       // Clear file state after upload
      setFile(null);
      document.getElementById('file-upload-input').value = '';

      setIsLoading(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>TL;DR Chatbot</h1>
        <span>Upload PDF or TXT files and chat with the AI about them.</span>
      </header>
      <div className="chat-container">
        {/* Render chat messages */}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll to bottom ref */}
      </div>
      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      <div className="upload-section">
        {/* File upload section */}
        <input
          id="file-upload-input"
          type="file"
          onChange={handleFileChange}
        />
        <button onClick={uploadFile}>Upload Document</button>
      </div>
      {isLoading && <img className="loading-gif" src="loading-dots.gif" alt="Loading..." />}
    </div>
  );
}

export default App;
