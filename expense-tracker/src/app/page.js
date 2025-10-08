'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

export default function Page() {
  const [month, setMonth] = useState('');
  const [form, setForm] = useState({ type: 'income', title: '', amount: '', date: '' });
  const [editId, setEditId] = useState(null);

  const swrKey = `/api/entries${month ? '?month=' + month : ''}`;
  const { data, error } = useSWR(swrKey, fetcher);

  if (error) return <div>Error loading entries</div>;
  if (!data) return <div>Loading...</div>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { ...form, id: editId } : form;

    await fetch('/api/entries' + (editId ? `?id=${editId}` : ''), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setForm({ type: 'income', title: '', amount: '', date: '' });
    setEditId(null);
    mutate(swrKey); // update table immediately
  };

  const handleDelete = async (id) => {
    await fetch(`/api/entries?id=${id}`, { method: 'DELETE' });
    mutate(swrKey);
  };

  const handleEdit = (entry) => {
    setEditId(entry.id);
    setForm({
      type: entry.type,
      title: entry.title,
      amount: entry.amount,
      date: entry.date.slice(0, 10),
    });
  };

  // Summary
  const totalIncome = data.filter(e => e.type === 'income').reduce((acc, e) => acc + parseFloat(e.amount), 0);
  const totalExpense = data.filter(e => e.type === 'expense').reduce((acc, e) => acc + parseFloat(e.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Expense Tracker</h1>

      {/* Filter */}
      <div>
        <label>Filter by month: </label>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="amount" placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required />
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ type:'income', title:'', amount:'', date:'' }); }}>Cancel</button>}
      </form>

      {/* Table */}
      <table border="1" cellPadding="5" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(entry => (
            <tr key={entry.id}>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
              <td>{entry.type}</td>
              <td>{entry.title}</td>
              <td>{entry.amount}</td>
              <td>
                <button onClick={() => handleEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ marginTop: '20px' }}>
        <h2>Monthly Summary</h2>
        <p>Total Income: {totalIncome}</p>
        <p>Total Expense: {totalExpense}</p>
        <p>Balance: {balance}</p>
      </div>
    </div>
  );
}
