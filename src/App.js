import React, { useState } from 'react';
import Header from './Footer';
import Navbar from './Navbar';  
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';

import Sales from './Sales';
import Customers from './Customers';
import Reporting from './Reporting';

import StockManagement from './StockManagement';
import './App.css';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  
  const renderModule = () => {
    switch(activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'inventory':
        return <StockManagement />;
      case 'sales':
        return <Sales />;
      case 'customers':
        return <Customers />;
      case 'reporting':
        return <Reporting />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Header />
      <Navbar activeModule={activeModule} setActiveModule={setActiveModule} /> {/* ✅ replaced Sidebar */}
      <main className="main-content">
        {renderModule()}
      </main>
    </div>
  );
}

export default App;
