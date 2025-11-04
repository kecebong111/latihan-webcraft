import React, { useState } from 'react';

interface ChildProps {
  message: string;
  onSendData: (data: string) => void;
}

const Child: React.FC<ChildProps> = ({ message, onSendData }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    onSendData(input);
    setInput('');
  };

  return (
    <div style={{ border: '1px solid gray', padding: '10px' }}>
      <h4>Child Component</h4>
      <p>Received: {message}</p>
      
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Send to parent"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Child;