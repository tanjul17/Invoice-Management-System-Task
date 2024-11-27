import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, PlusCircle } from 'lucide-react';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [customerFilter, setCustomerFilter] = useState('');

  // Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    customer_name: '',
    date: '',
    details: [{ description: '', quantity: 1, unit_price: 0 }]
  });

  // Fetch Invoices
  const fetchInvoices = async () => {
    try {
      const response = await axios.get('https://invoice-management-system-5kup.vercel.app/api/invoices/', {
        params: { 
          page: currentPage,
          customer_name: customerFilter
        }
      });
      
      setInvoices(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      console.error('Error fetching invoices', error);
    }
  };

  // Add/Edit Invoice
  const saveInvoice = async (e) => {
    e.preventDefault();
    try {
      if (selectedInvoice) {
        // Update existing invoice
        await axios.put(`https://invoice-management-system-5kup.vercel.app/api/invoices/${selectedInvoice.id}/`, invoiceForm);
      } else {
        // Create new invoice
        await axios.post('https://invoice-management-system-5kup.vercel.app/api/invoices/', invoiceForm);
      }
      fetchInvoices();
      resetForm();
    } catch (error) {
      console.error('Error saving invoice', error);
    }
  };

  // Delete Invoice
  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`https://invoice-management-system-5kup.vercel.app/api/invoices/${id}/`);
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice', error);
    }
  };

  // Form Helpers
  const resetForm = () => {
    setSelectedInvoice(null);
    setInvoiceForm({
      invoice_number: '',
      customer_name: '',
      date: '',
      details: [{ description: '', quantity: 1, unit_price: 0 }]
    });
  };

  const addLineItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      details: [...prev.details, { description: '', quantity: 1, unit_price: 0 }]
    }));
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, customerFilter]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invoice List */}
        <div className="bg-white shadow-md rounded">
          <div className="p-4 border-b">
            <input 
              type="text" 
              placeholder="Filter by Customer Name"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Invoice Number</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Total</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id} className="border-b">
                  <td className="p-2">{invoice.invoice_number}</td>
                  <td className="p-2">{invoice.customer_name}</td>
                  <td className="p-2">${invoice.total_amount}</td>
                  <td className="p-2 flex space-x-2">
                    <button 
                      onClick={() => setSelectedInvoice(invoice)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => deleteInvoice(invoice.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-between p-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="bg-white shadow-md rounded p-4">
          <form onSubmit={saveInvoice}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Invoice Number" 
                value={invoiceForm.invoice_number}
                onChange={(e) => setInvoiceForm(prev => ({
                  ...prev, 
                  invoice_number: e.target.value
                }))}
                className="p-2 border rounded"
                required 
              />
              <input 
                type="text" 
                placeholder="Customer Name"
                value={invoiceForm.customer_name}
                onChange={(e) => setInvoiceForm(prev => ({
                  ...prev, 
                  customer_name: e.target.value
                }))}
                className="p-2 border rounded"
                required 
              />
              <input 
                type="date" 
                value={invoiceForm.date}
                onChange={(e) => setInvoiceForm(prev => ({
                  ...prev, 
                  date: e.target.value
                }))}
                className="p-2 border rounded"
                required 
              />
            </div>

            {/* Line Items */}
            <div className="space-y-2 mb-4">
              {invoiceForm.details.map((detail, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    placeholder="Description"
                    value={detail.description}
                    onChange={(e) => {
                      const newDetails = [...invoiceForm.details];
                      newDetails[index].description = e.target.value;
                      setInvoiceForm(prev => ({ ...prev, details: newDetails }));
                    }}
                    className="p-2 border rounded" 
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Quantity"
                    value={detail.quantity}
                    onChange={(e) => {
                      const newDetails = [...invoiceForm.details];
                      newDetails[index].quantity = parseInt(e.target.value);
                      setInvoiceForm(prev => ({ ...prev, details: newDetails }));
                    }}
                    min="1"
                    className="p-2 border rounded" 
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Unit Price"
                    value={detail.unit_price}
                    onChange={(e) => {
                      const newDetails = [...invoiceForm.details];
                      newDetails[index].unit_price = parseFloat(e.target.value);
                      setInvoiceForm(prev => ({ ...prev, details: newDetails }));
                    }}
                    step="0.01"
                    min="0"
                    className="p-2 border rounded" 
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button 
                type="button"
                onClick={addLineItem}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded"
              >
                <PlusCircle className="mr-2" /> Add Line Item
              </button>
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;