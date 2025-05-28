import React, { useState } from 'react';
import styles from './ChatBot.module.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { user: true, text: input }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { user: false, text: data.reply }]);
    } catch {
      setMessages(msgs => [...msgs, { user: false, text: "Sorry, I couldn't get a response." }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <>
      {/* Floating Chatbot Window (always rendered, animated via CSS) */}
      <div className={`${styles.floatingChatbot} ${open ? styles.open : styles.closed}`}>
        <div className={styles.chatbotHeader}>
          <span>Ask Gemini</span>
          <button
            onClick={() => setOpen(false)}
            className={styles.closeBtn}
            aria-label="Close Chatbot"
          >×</button>
        </div>
        <div className={styles.chatbotBody}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.messageRow} ${msg.user ? styles.messageUser : styles.messageBot}`}
            >
              <span className={`${styles.messageBubble} ${msg.user ? styles.userBubble : styles.botBubble}`}>
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <div>Bot is typing...</div>}
        </div>
        <form onSubmit={sendMessage} className={styles.inputRow}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className={styles.inputField}
          />
          <button
            disabled={loading}
            type="submit"
            className={styles.sendBtn}
          >
            Send
          </button>
        </form>
      </div>
      {/* Always rendered, animated minimized button */}
      <button
        onClick={() => setOpen(true)}
        className={`${styles.minimizedBtn} ${open ? styles.hideMinimized : ''}`}
        aria-label="Open Chatbot"
        tabIndex={open ? -1 : 0}
      >
        💬
      </button>
    </>
  );
};

export default ChatBot;
