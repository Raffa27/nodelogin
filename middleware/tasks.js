// tasks.js
const db = require('../lib/db.js');

module.exports = {
  getTasks: (req, res) => {
    const userId = req.userData.userId;
    db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching tasks', error: err });
      }
      res.json(result);
    });
  },

  addTask: (req, res) => {
    const { task } = req.body;
    const userId = req.userData.userId;
    db.query('INSERT INTO tasks (user_id, task_description) VALUES (?, ?)', [userId, task], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding task', error: err });
      }
      res.json({ id: result.insertId, message: 'Task added successfully' });
    });
  },

  updateTask: (req, res) => {
    const { id } = req.params;
    const { is_completed } = req.body;
    const userId = req.userData.userId;
    db.query('UPDATE tasks SET is_completed = ? WHERE id = ? AND user_id = ?', [is_completed, id, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating task', error: err });
      }
      res.json({ message: 'Task updated successfully' });
    });
  },

  deleteTask: (req, res) => {
    const { id } = req.params;
    const userId = req.userData.userId;
    db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting task', error: err });
      }
      res.json({ message: 'Task deleted successfully' });
    });
  }
};