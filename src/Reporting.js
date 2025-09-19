import React, { useState, useEffect } from 'react';
import './Reporting.css';

const Reporting = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reportType, setReportType] = useState('inventory');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    setProducts(storedProducts);
    setSales(storedSales);
    setCustomers(storedCustomers);
    generateReport();
  }, [reportType, startDate, endDate]);

  const generateReport = () => {
    let data = [];
    
    switch(reportType) {
      case 'inventory':
        data = products.map(product => ({
          name: product.name,
          category: product.category,
          quantity: product.quantity,
          price: product.price,
          status: product.quantity < 10 ? 'Low Stock' : 'In Stock'
        }));
        break;
        
      case 'sales':
        let filteredSales = sales;
        
        if (startDate && endDate) {
          filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
          });
        }
        
        data = filteredSales.map(sale => ({
          date: new Date(sale.date).toLocaleDateString(),
          product: sale.productName,
          customer: sale.customerName,
          quantity: sale.quantity,
          total: sale.totalPrice
        }));
        break;
        
      case 'customers':
        data = customers.map(customer => ({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address
        }));
        break;
        
      default:
        break;
    }
    
    setReportData(data);
  };

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headers = Object.keys(reportData[0]).join(',');
    const rows = reportData.map(item => 
      Object.values(item).map(value => `"R{value}"`).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get report title with icon
  const getReportTitle = () => {
    switch(reportType) {
      case 'inventory':
        return <><span className="report-icon">📦</span> Inventory Report</>;
      case 'sales':
        return <><span className="report-icon">💰</span> Sales Report</>;
      case 'customers':
        return <><span className="report-icon">👥</span> Customer Report</>;
      default:
        return 'Report';
    }
  };

  // Get summary statistics
  const getSummaryStats = () => {
    switch(reportType) {
      case 'inventory':
        const lowStockCount = products.filter(p => p.quantity < 10).length;
        const totalInventoryValue = products.reduce((total, product) => 
          total + (product.price * product.quantity), 0
        );
        
        return (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Products</h3>
                <p>{products.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>Low Stock Items</h3>
                <p>{lowStockCount}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Inventory Value</h3>
                <p>${totalInventoryValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
        
      case 'sales':
        const filteredSales = startDate && endDate 
          ? sales.filter(sale => {
              const saleDate = new Date(sale.date);
              return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
            })
          : sales;
          
        const totalSalesValue = filteredSales.reduce((total, sale) => 
          total + parseFloat(sale.totalPrice || 0), 0
        );
        const totalItemsSold = filteredSales.reduce((total, sale) => 
          total + parseInt(sale.quantity || 0), 0
        );
        
        return (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Total Transactions</h3>
                <p>{filteredSales.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-content">
                <h3>Items Sold</h3>
                <p>{totalItemsSold}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p>${totalSalesValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
        
      case 'customers':
        return (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Customers</h3>
                <p>{customers.length}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="reporting">
      <h1 className="module-title">
        <span className="title-icon">📊</span> Reporting Dashboard
      </h1>
      
      <div className="report-controls">
        <div className="form-group">
          <label htmlFor="reportType">
            <span className="input-icon">📋</span> Report Type
          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="inventory">📦 Inventory Report</option>
            <option value="sales">💰 Sales Report</option>
            <option value="customers">👥 Customer Report</option>
          </select>
        </div>
        
        {(reportType === 'sales') && (
          <>
            <div className="form-group">
              <label htmlFor="startDate">
                <span className="input-icon">📅</span> Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">
                <span className="input-icon">📅</span> End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        )}
        
        <button onClick={exportToCSV} className="export-btn">
          <span className="btn-icon">📥</span> Send 
        </button>
      </div>
      
      <div className="report-summary">
        <h2>{getReportTitle()}</h2>
        {getSummaryStats()}
      </div>
      
      <div className="table-container">
        {reportData.length === 0 ? (
          <div className="no-data">
            <span className="no-data-icon">📭</span>
            <p>No data available for the selected report.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {Object.keys(reportData[0]).map(key => (
                  <th key={key}>
                    {key === 'name' && '👤 '}
                    {key === 'email' && '📧 '}
                    {key === 'phone' && '📞 '}
                    {key === 'address' && '🏠 '}
                    {key === 'category' && '📁 '}
                    {key === 'quantity' && '🔢 '}
                    {key === 'price' && '💰 '}
                    {key === 'status' && '📊 '}
                    {key === 'date' && '📅 '}
                    {key === 'product' && '📦 '}
                    {key === 'customer' && '👤 '}
                    {key === 'total' && '💵 '}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, i) => (
                    <td key={i}>
                      {typeof value === 'string' && value.includes('$') && '💵 '}
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reporting;