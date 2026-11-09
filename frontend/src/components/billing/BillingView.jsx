import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  CheckCircle,
  Clock,
  DollarSign,
  X,
  CreditCard,
  Trash2,
  FileText,
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function BillingView() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected Bill for Modal Receipt
  const [selectedBill, setSelectedBill] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Invoice Form
  const [formData, setFormData] = useState({
    patientId: '',
    taxRate: 5.0,
    discount: 0,
    paymentMethod: 'CASH',
    notes: '',
    items: [
      { description: 'OPD Specialist Consultation Fee', category: 'CONSULTATION', quantity: 1, unitPrice: 800 },
    ],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [billsData, patientsData] = await Promise.all([
        api.getBills({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          q: search || undefined,
        }),
        api.getPatients(),
      ]);
      setBills(billsData);
      setPatients(patientsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, search]);

  const handleAddItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', category: 'OTHER', quantity: 1, unitPrice: 500 },
      ],
    }));
  };

  const handleRemoveItemRow = (idx) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleItemChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[idx][field] = value;
      return { ...prev, items: updated };
    });
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await api.createBill(formData);
      setIsCreateOpen(false);
      setFormData({
        patientId: '',
        taxRate: 5.0,
        discount: 0,
        paymentMethod: 'CASH',
        notes: '',
        items: [
          { description: 'OPD Specialist Consultation Fee', category: 'CONSULTATION', quantity: 1, unitPrice: 800 },
        ],
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewBill = async (id) => {
    try {
      const full = await api.getBillById(id);
      setSelectedBill(full);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRecordPayment = async (billId, paymentMethod = 'UPI') => {
    try {
      const updated = await api.payBill(billId, { paymentMethod });
      setSelectedBill(updated);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-teal-600" />
            Billing & Invoicing Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate itemized hospital receipts, collect payments, and manage inpatient/outpatient settlements.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Create New Invoice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice number (INV-...), patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Date Issued</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Receipt / Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading invoices...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No invoices recorded.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr
                    key={bill.id}
                    onClick={() => handleViewBill(bill.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">{bill.invoiceNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{bill.patient?.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{bill.patient?.patientCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(bill.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      ₹{bill.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          bill.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bill.status === 'PARTIAL'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium text-[11px]">{bill.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewBill(bill.id)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-bold text-xs flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Receipt
                        </button>
                        {bill.status !== 'PAID' && (
                          <button
                            onClick={() => handleRecordPayment(bill.id, 'UPI')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto print:shadow-none print:border-none">
            {/* Modal Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital Tax Invoice</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Layout */}
            <div className="pt-4 space-y-4 text-xs">
              {/* Hospital Header */}
              <div className="text-center pb-4 border-b border-slate-200">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">CAREPULSE SUPER SPECIALITY HOSPITAL</h2>
                <p className="text-slate-500 text-[11px] mt-0.5">Plot 45, Healthcare Boulevard, Institutional Area</p>
                <p className="text-slate-400 text-[10px]">Ph: +91 11 2345 6789 • GSTIN: 07AAACG1234F1Z8</p>
              </div>

              {/* Invoice & Patient Meta */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-400">Billed To:</div>
                  <div className="font-extrabold text-slate-900 text-sm">{selectedBill.patient?.name}</div>
                  <div className="font-mono text-slate-500 text-[11px]">{selectedBill.patient?.patientCode}</div>
                  <div className="text-slate-500 text-[11px]">{selectedBill.patient?.phone}</div>
                </div>

                <div className="text-right">
                  <div className="text-slate-400">Invoice Details:</div>
                  <div className="font-mono font-bold text-teal-700 text-sm">{selectedBill.invoiceNumber}</div>
                  <div className="text-slate-600 text-[11px]">
                    Date:{' '}
                    {new Date(selectedBill.issueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedBill.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedBill.status} ({selectedBill.paymentMethod})
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedBill.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{it.description}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{it.category}</td>
                        <td className="py-2.5 px-3 text-center font-medium">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">₹{it.unitPrice}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">₹{it.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{selectedBill.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({selectedBill.taxRate}%):</span>
                    <span className="font-semibold">₹{selectedBill.taxAmount}</span>
                  </div>
                  {selectedBill.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-semibold">-₹{selectedBill.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                    <span>Total Payable:</span>
                    <span>₹{selectedBill.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Amount Paid:</span>
                    <span>₹{selectedBill.paidAmount}</span>
                  </div>
                  {selectedBill.totalAmount - selectedBill.paidAmount > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Balance Due:</span>
                      <span>₹{selectedBill.totalAmount - selectedBill.paidAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Settlement Action */}
              {selectedBill.status !== 'PAID' && (
                <div className="pt-4 border-t border-slate-200 print:hidden flex items-center justify-between bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div>
                    <div className="font-bold text-emerald-900 text-xs">Settle Invoice Payment</div>
                    <div className="text-[11px] text-emerald-700">Record counter receipt via Cash or UPI</div>
                  </div>
                  <button
                    onClick={() => handleRecordPayment(selectedBill.id, 'UPI')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
                  >
                    Mark as Paid (Full ₹{selectedBill.totalAmount - selectedBill.paidAmount})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                Generate New Hospital Bill
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientCode} • {p.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                    Invoice Line Items *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center gap-2"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Description (e.g. ECG Test)"
                        value={it.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs flex-1 min-w-[140px]"
                      />

                      <select
                        value={it.category}
                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-32"
                      >
                        <option value="CONSULTATION">Consultation</option>
                        <option value="PHARMACY">Pharmacy</option>
                        <option value="BED_CHARGE">Bed Charge</option>
                        <option value="LAB_TEST">Lab Test</option>
                        <option value="SURGERY">Surgery</option>
                        <option value="OTHER">Other</option>
                      </select>

                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={it.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-16"
                      />

                      <input
                        type="number"
                        placeholder="Rate ₹"
                        value={it.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-24"
                      />

                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI / QR</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="INSURANCE">TPA Insurance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Paid at OPD counter 1"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

