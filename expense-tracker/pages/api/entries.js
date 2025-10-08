import { pool } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { id, month } = req.query;

    if (method === 'GET') {
      let query = 'SELECT * FROM entries';
      const params = [];
      if (month) {
        query += ' WHERE DATE_FORMAT(date, "%Y-%m") = ?';
        params.push(month);
      }
      query += ' ORDER BY date DESC';
      const [rows] = await pool.query(query, params);
      return res.status(200).json(rows);

    } else if (method === 'POST') {
      const { type, title, amount, date } = req.body;
      const [result] = await pool.query(
        'INSERT INTO entries (type, title, amount, date) VALUES (?, ?, ?, ?)',
        [type, title, amount, date]
      );
      return res.status(201).json({ id: result.insertId });

    } else if (method === 'PUT') {
      const { type, title, amount, date } = req.body;
      await pool.query(
        'UPDATE entries SET type=?, title=?, amount=?, date=? WHERE id=?',
        [type, title, amount, date, id]
      );
      return res.status(200).json({ updated: true });

    } else if (method === 'DELETE') {
      await pool.query('DELETE FROM entries WHERE id=?', [id]);
      return res.status(200).json({ deleted: true });

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
