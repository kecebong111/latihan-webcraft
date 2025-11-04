import React from 'react';

// Interface untuk props
interface WelcomeProps {
  name: string;
  age?: number;
}

const Welcome: React.FC<WelcomeProps> = ({ name, age }) => {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      {age && <p>Age: {age}</p>}
    </div>
  );
};

export default Welcome;