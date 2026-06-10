const Product = require('../models/productModel');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createProduct = async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;
  try {
    const product = await Product.create({ 
      name, 
      price, 
      description: description || '', 
      image: image || '', 
      category: category || '', 
      countInStock: countInStock || 0 
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    await product.deleteOne();
    res.json({ message: 'Product removed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getProducts, getProductById, createProduct, deleteProduct };