const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/productModel");

// @desc   fetch all products
// @route   GET   /api/products
// @access   public
const getProducts = asyncHandler(async (req, res) => {

  // const pageSize = 2;
  // const page = Number(req.query.pageNumber) || 1;
  // const count = await Product.countDocuments();
  // .limit(pageSize).skip(pageSize * (page - 1));
  const products = await Product.find({})
  res.json(products)
  // res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc fetch a product by id
// @route  GET   /api/products/:id
// @access public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) return res.json(product);
  res.status(404);
  throw new Error("Resource not found");
});

// @desc   create a products
// @route   GET   /api/products
// @access   public
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: 'sample name',
    price: 0,
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'sample description',
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct)
});

// @desc   update a product
// @route   PUT   /api/products/:id
// @access   public
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, description, countInStock } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name,
      product.price = price,
      product.image = image,
      product.brand = brand,
      product.category = category,
      product.description = description,
      product.countInStock = countInStock

    const updatedProduct = await product.save()

    res.json(updatedProduct)
  } else {
    res.status(404);
    throw new Error('Product not Found')
  }

});

// @desc   delete a product
// @route   DELETE   /api/products/:id
// @access   public
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({
      message: 'Product deleted'
    })
  } else {
    res.status(404);
    throw new Error('Product not Found')
  }
});

// @desc   create a product review
// @route   POST   /api/products/:id/reviews
// @access   public
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id)

  if (product) {
    const reviewedAlready = await product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (reviewedAlready) {
      res.status(400);
      throw new Error('Product already reviewed')
    }

    console.log(req.user)

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save();
    res.status(201).json({ message: 'Review Added successfully' })

  } else {
    res.status(404);
    throw new Error('Product not Found')
  }
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
