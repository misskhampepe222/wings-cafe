import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ activeModule, setActiveModule }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'products', name: 'Product Management', icon: '📦' },
    { id: 'inventory', name: 'Stock Management', icon: '📋' },
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'reporting', name: 'Reporting', icon: '📈' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">☕</span>
        <span className="logo-text">Wings Cafe</span>
      </div>

      <ul className="navbar-menu">
        {modules.map(module => (
          <li
            key={module.id}
            className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
            onClick={() => setActiveModule(module.id)}
            title={module.name}
          >
            <span className="nav-icon">{module.icon}</span>
            <span className="nav-text">{module.name}</span>
          </li>
        ))}
      </ul>

      <div className="navbar-user">
        <div className="user-avatar">A</div>
        <div className="user-details">
          <div className="user-name">Admin User</div>
          <div className="user-role">Administrator</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
