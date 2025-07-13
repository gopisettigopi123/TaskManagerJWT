const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, user: req.user._id });
  res.status(201).json(category);
};

exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { name },
    { new: true }
  );
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Category deleted' });
};
