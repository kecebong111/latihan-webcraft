import React, { useState } from 'react';

const UserStatus: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | 'guest'>('guest');

  return (
    <div>
      <h3>User Status</h3>
      
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
      
      <select 
        value={userRole} 
        onChange={(e) => setUserRole(e.target.value as any)}
      >
        <option value="guest">Guest</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      {/* Conditional rendering */}
      {isLoggedIn ? (
        <div>
          <h4>Welcome back!</h4>
          {userRole === 'admin' && <p>You have admin access</p>}
          {userRole === 'user' && <p>You have user access</p>}
          {userRole === 'guest' && <p>You have limited access</p>}
        </div>
      ) : (
        <p>Please login to continue</p>
      )}
    </div>
  );
};

export default UserStatus;