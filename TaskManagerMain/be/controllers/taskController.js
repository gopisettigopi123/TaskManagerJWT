const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const { status, category, search } = req.query;
  let query = { user: req.user._id };

  if (status) query.status = status;
  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };

  const tasks = await Task.find(query).populate('category');
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, dueDate, status, category } = req.body;
  const task = await Task.create({
    title,
    description,
    dueDate,
    status,
    category,
    user: req.user._id
  });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Task deleted' });
};
