import React, { useState, useEffect } from 'react';
import './Sales.css';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    setProducts(storedProducts);
    setCustomers(storedCustomers);
    setSales(storedSales);
  }, []);

  const handleSale = (e) => {
    e.preventDefault();

    if (!selectedProduct || !selectedCustomer || saleQuantity <= 0) {
      alert('Please select a product, customer, and enter a valid quantity');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    const customer = customers.find(c => c.id === selectedCustomer);

    if (!product || !customer) return;

    if (saleQuantity > product.quantity) {
      alert('Not enough stock available for this sale');
      return;
    }

    const updatedProducts = products.map(p =>
      p.id === selectedProduct ? { ...p, quantity: p.quantity - saleQuantity } : p
    );

    const newSale = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      customerId: selectedCustomer,
      customerName: customer.name,
      quantity: saleQuantity,
      totalPrice: (product.price * saleQuantity).toFixed(2),
      date: new Date().toISOString()
    };

    const updatedSales = [newSale, ...sales];

    setProducts(updatedProducts);
    setSales(updatedSales);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    localStorage.setItem('sales', JSON.stringify(updatedSales));

    setSelectedProduct('');
    setSelectedCustomer('');
    setSaleQuantity(1);
    setShowDrawer(false); // ✅ Close drawer after saving
  };

  return (
    <div className="sales">
      <h1 className="module-title">Sales Management</h1>

      {/* Button to open drawer */}
      <button className="open-drawer-btn" onClick={() => setShowDrawer(true)}>
        ➕ Record New Sale
      </button>

      {/* Recent Sales Table */}
      <div className="table-container">
        <h2>Recent Sales</h2>
        {sales.length === 0 ? (
          <p>Awaiting initial Sales.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 10).map(sale => (
                <tr key={sale.id}>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>{sale.customerName}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>M{sale.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer (Slide-in Form) */}
      <div className={`drawer ${showDrawer ? 'open' : ''}`}>
        <div className="drawer-content">
          <button className="close-btn" onClick={() => setShowDrawer(false)}>✖</button>
          <h2>Record New Sale</h2>
          <form onSubmit={handleSale}>
            <div className="form-group">
              <label htmlFor="customer">Select Customer</label>
              <select
                id="customer"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

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
                    {product.name} (Price: M{product.price.toFixed(2)}, Stock: {product.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={saleQuantity}
                onChange={(e) => setSaleQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            {selectedProduct && (
              <div className="price-calculation">
                <p>
                  Total: M{(
                    products.find(p => p.id === selectedProduct)?.price * saleQuantity || 0
                  ).toFixed(2)}
                </p>
              </div>
            )}

            <button type="submit">Record Sale</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sales;
