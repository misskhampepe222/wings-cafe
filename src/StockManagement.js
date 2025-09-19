import React, { useState, useEffect } from 'react';
import './StockManagement.css';

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [transactionType, setTransactionType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState(false);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setProducts(storedProducts);
    setTransactions(storedTransactions);

    // Show popup if any product is low in stock
    if (storedProducts.some(p => p.quantity < 10)) {
      setLowStockAlert(true);
      setTimeout(() => setLowStockAlert(false), 4000); // hide after 4s
    }
  }, []);

  const handleStockUpdate = (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      alert('Please select a product and enter a valid quantity');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const quantityNum = parseInt(quantity);
    let newQuantity = product.quantity;

    if (transactionType === 'add') {
      newQuantity += quantityNum;
    } else {
      if (quantityNum > product.quantity) {
        alert('Cannot deduct more than available stock');
        return;
      }
      newQuantity -= quantityNum;
    }

    const updatedProducts = products.map(p =>
      p.id === selectedProduct ? { ...p, quantity: newQuantity } : p
    );

    const newTransaction = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      type: transactionType,
      quantity: quantityNum,
      date: new Date().toISOString()
    };

    const updatedTransactions = [newTransaction, ...transactions];

    setProducts(updatedProducts);
    setTransactions(updatedTransactions);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    setSelectedProduct('');
    setQuantity('');

    // Trigger popup if low stock exists
    if (updatedProducts.some(p => p.quantity < 10)) {
      setLowStockAlert(true);
      setTimeout(() => setLowStockAlert(false), 4000);
    }
  };

  return (
    <div className="stock-management">
      <h1 className="module-title">Stock Management</h1>

      {/* Low Stock Popup */}
      {lowStockAlert && (
        <div className="low-stock-popup">
          <p>⚠️ Some products are running low on stock!</p>
        </div>
      )}

      <div className="table-container">
        <h2>Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.productName}</td>
                  <td>
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type === 'add' ? 'Addition' : 'Deduction'}
                    </span>
                  </td>
                  <td>{transaction.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="form-container">
        <h2>Update Stock</h2>
        <form onSubmit={handleStockUpdate}>
          <div className="form-group">
            <label htmlFor="product">Select Product</label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (Current: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transactionType">Transaction Type</label>
            <select
              id="transactionType"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
            >
              <option value="add">Add Stock</option>
              <option value="deduct">Remove Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <button type="submit">Update Stock</button>
        </form>
      </div>
    </div>
  );
};

export default StockManagement;
