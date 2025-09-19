import React, { useState, useEffect } from 'react';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    setCustomers(storedCustomers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCustomer = {
      id: editingCustomer ? editingCustomer.id : Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    };

    let updatedCustomers;
    if (editingCustomer) {
      updatedCustomers = customers.map(c => c.id === editingCustomer.id ? newCustomer : c);
    } else {
      updatedCustomers = [...customers, newCustomer];
    }

    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingCustomer(null);
    setIsFormOpen(false);
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (customerId) => {
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  return (
    <div className="customers-container">
      <h1 className="module-title">Customer Management</h1>

      <div className="customers-content">
        {/* Table on the left */}
        <div className="table-side">
          <div className="table-header">
            <h2>Clients</h2>
            <button className="btn-open-form" onClick={() => setIsFormOpen(true)}>
              Add Customer
            </button>
          </div>
          {customers.length === 0 ? (
            <p>No customers found. Add some to get started.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(customer)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(customer.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Side Form as pop-up */}
        {isFormOpen && (
          <div className="form-side">
            <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Customer Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <button type="submit" className="btn-submit">{editingCustomer ? 'Update Customer' : 'Add Customer'}</button>
              <button type="button" className="btn-cancel" onClick={() => { setIsFormOpen(false); setEditingCustomer(null); setFormData({ name:'', email:'', phone:'', address:'' }); }}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
