const { StatusCodes } = require("http-status-codes");
const { Product } = require("../models/index");
const { Op } = require("sequelize");

const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;

    if (!name || !price || quantity == undefined || !category) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Name, price, quantity, and category are required" });
    }

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
    });

    res.status(StatusCodes.CREATED).json(newProduct);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  try {
    const products = await Product.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    const totalProducts = await Product.count();

    res.status(StatusCodes.OK).json({ totalProducts, products });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product found with id ${id}` });
    }

    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, category } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product found with id ${id}` });
    }

    product.name = name || product.name;
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.quantity =
      quantity !== undefined ? parseInt(quantity) : product.quantity;
    product.category = category || product.category;

    await product.save();

    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product found with id ${id}` });
    }

    await product.destroy();
    res.status(StatusCodes.OK).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
