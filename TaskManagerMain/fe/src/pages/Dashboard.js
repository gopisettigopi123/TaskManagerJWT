import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const hLogout = () => {
  logout(); // Clear localStorage and auth state
  toast.success('Logged out successfully!');
  navigate('/'); // ✅ Redirect to home page
};

  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
  });

  const [editTask, setEditTask] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState({ id: '', name: '' });

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks', { params: filters });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  fetchTasks();
  fetchCategories();
}, [filters]);



  const fetchTasks = async () => {
    const res = await API.get('/tasks', { params: filters });
    setTasks(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get('/categories');
    setCategories(res.data);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    await API.post('/tasks', taskForm);
    setTaskForm({ title: '', description: '', dueDate: '', category: '' });
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleToggleStatus = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      ...task,
      status: task.status === 'pending' ? 'completed' : 'pending',
    });
    fetchTasks();
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await API.post('/categories', { name: newCategory });
    setNewCategory('');
    fetchCategories();
  };

  const handleEditCategory = async () => {
    await API.put(`/categories/${editCategory.id}`, { name: editCategory.name });
    setEditCategory({ id: '', name: '' });
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (

      //  headersection //
    <div className="container mt-4 ">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, {user.name}</h3>
        <button className="btn btn-danger" onClick={hLogout}>Logout</button>
      </div>

      {/*  search sectionFilters */}
       <h4 className="mt-4">Serach Tasks </h4>
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search title..."
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <select className="form-control" onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-control" onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Add Categories */}
       <h4 className="mt-4">Add Categories</h4>
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" onClick={handleAddCategory}>Add</button>
        </div>
      </div>
      <h4 className="mt-4">Manage Categories</h4>
      <table className="table table-bordered table-sm w-50">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>
                {editCategory.id === cat._id ? (
                  <input
                    type="text"
                    value={editCategory.name}
                    className="form-control"
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                  />
                ) : cat.name}
              </td>
              <td>
                {editCategory.id === cat._id ? (
                  <button className="btn btn-sm btn-primary me-1" onClick={handleEditCategory}>Save</button>
                ) : (
                  <button className="btn btn-sm btn-warning me-1" onClick={() => setEditCategory({ id: cat._id, name: cat.name })}>Edit</button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCategory(cat._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Task */}
       <h4 className="mt-4">Add Tasks</h4>
      <form className="row g-2 mb-4" onSubmit={handleAddTask}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Task Title"
            required
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-control"
            value={taskForm.category}
            required
            onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
          >
            <option value="">Choose Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Add Task</button>
        </div>
      </form>

      {/* Task Table */}
       <h4 className="mt-4">All Tasks</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? tasks.map((task) => (
              <tr
                key={task._id}
                className={task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending'
                  ? 'table-danger'
                  : ''}
              >
                <td>{task.title}</td>
                <td>{task.category?.name}</td>
                <td>
                  <span
                    className={`badge ${task.status === 'completed' ? 'bg-success' : 'bg-warning'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleStatus(task)}
                  >
                    {task.status}
                  </span>
                </td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-1" onClick={() => setEditTask(task)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5">No tasks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Management */}
       

      {/* Task Edit Modal */}
      {editTask && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await API.put(`/tasks/${editTask._id}`, editTask);
                  setEditTask(null);
                  fetchTasks();
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Edit Task</h5>
                  <button type="button" className="btn-close" onClick={() => setEditTask(null)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control my-2"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-control my-2"
                    value={editTask.description}
                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  />
                  <input
                    type="date"
                    className="form-control my-2"
                    value={editTask.dueDate?.slice(0, 10)}
                    onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                  />
                  <select
                    className="form-control my-2"
                    value={editTask.category}
                    onChange={(e) => setEditTask({ ...editTask, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    className="form-control my-2"
                    value={editTask.status}
                    onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary">Update</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditTask(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
