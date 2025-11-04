import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', textAlign: 'left' }}>
      <h2>Todo App</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add new todo..."
          style={{ width: '70%', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px', marginLeft: '5px' }}>
          Add
        </button>
      </form>

      <div>
        {todos.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map(todo => (
              <li key={todo.id} style={{ marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span 
                  style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    marginLeft: '8px',
                    marginRight: '8px'
                  }}
                >
                  {todo.text}
                </span>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  style={{ 
                    backgroundColor: 'red', 
                    color: 'white', 
                    border: 'none',
                    padding: '2px 6px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        Total: {todos.length} | 
        Completed: {todos.filter(t => t.completed).length} | 
        Pending: {todos.filter(t => !t.completed).length}
      </div>
    </div>
  );
};

export default TodoApp;