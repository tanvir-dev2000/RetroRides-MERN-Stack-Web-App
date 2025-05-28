const Cart = require('../models/cartModel');
const Car = require('../models/carModel');

// Add to cart
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { carId } = req.body;

  const car = await Car.findById(carId);
  if (!car) return res.status(404).json({ error: 'Car not found' });

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  if (!cart.items.find(item => item.car.equals(carId))) {
    cart.items.push({ car: carId });
    await cart.save();
  }

  res.json(cart);
};

// Get cart
exports.getCart = async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId }).populate('items.car');
  // Calculate subtotal dynamically from car prices
  const subTotal = cart
    ? cart.items.reduce((sum, item) => sum + (item.car?.price || 0), 0)
    : 0;
  res.json(cart ? { ...cart.toObject(), subTotal } : { items: [], subTotal: 0 });
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { carId } = req.body;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  cart.items = cart.items.filter(item => !item.car.equals(carId));
  await cart.save();
  res.json(cart);
};

// Clear cart
exports.clearCart = async (req, res) => {
  const userId = req.user.id;
  let cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ success: true });
};

