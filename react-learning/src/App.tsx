import React from 'react';
import logo from './logo.svg';
import './App.css';
import Welcome from './components/Welcome';
import Counter from './components/Counter';
import UserForm from './components/UserForm';
import TodoList from './components/TodoList';
import UserProfile from './components/UserProfile';
import Parent from './components/Parent';
import UserStatus from './components/UserStatus';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <Welcome name="John" age={25} />
        <Welcome name="Jane" />

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <Counter />
        <UserForm />
        <TodoList />
        <UserProfile />
        <Parent />
        <UserStatus />

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
