import Product from '../models/Product.js';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError, NotFoundError } from '../errors/index.js';
import path from 'path';

export const createProduct = async (req, res) => {
  try {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId }).populate('reviews');

    if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
    }

    await product.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.files) {
      throw new BadRequestError('No File Uploaded');
    }
    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) {
      throw new BadRequestError('Please Upload Image');
    }

    const maxSize = 1024 * 1024;

    if (productImage.size > maxSize) {
      throw new BadRequestError('Please upload image smaller than 1MB');
    }

    const imagePath = path.join(__dirname, '../public/uploads/', productImage.name);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
