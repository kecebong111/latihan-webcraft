import React, { useState } from 'react';
import Child from './Child';

const Parent: React.FC = () => {
  const [message, setMessage] = useState('Hello from Parent');
  const [childData, setChildData] = useState('');

  const handleChildData = (data: string) => {
    setChildData(data);
  };

  return (
    <div>
      <h3>Parent Component</h3>
      <p>Message to child: {message}</p>
      <p>Data from child: {childData}</p>
      
      <Child 
        message={message}
        onSendData={handleChildData}
      />
    </div>
  );
};

export default Parent;