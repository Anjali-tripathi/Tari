const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

// ══════════════════════════════════════════
// USER MODEL
// ══════════════════════════════════════════
const AddressSchema = new Schema({
  label:   { type: String, required: true, default: 'Home' },
  line1:   { type: String, required: true },
  city:    { type: String, required: true },
  pincode: { type: String, required: true },
  lat:     Number,
  lng:     Number
});

const UserSchema = new Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:     { type: String, required: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['user', 'admin', 'delivery'], default: 'user' },
  addresses: [AddressSchema],
  isActive:  { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// ══════════════════════════════════════════
// PRODUCT MODEL
// ══════════════════════════════════════════
const ProductSchema = new Schema({
  name:            { type: String, required: true, trim: true },
  description:     { type: String, default: '' },
  price:           { type: Number, required: true, min: 0 },
  image:           { type: String, required: true },
  category:        { type: String, required: true },
  availability:    { type: Boolean, default: true },
  rating:          { type: Number, default: 0, min: 0, max: 5 },
  ratingCount:     { type: Number, default: 0 },
  tags:            [String],
  preparationTime: { type: Number, default: 20 }  // minutes
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

// ══════════════════════════════════════════
// ORDER MODEL
// ══════════════════════════════════════════
const OrderItemSchema = new Schema({
  productId: { type: ObjectId, ref: 'Product' },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  image:     String
}, { _id: false });

const OrderSchema = new Schema({
  userId:              { type: ObjectId, ref: 'User', required: true },
  items:               [OrderItemSchema],
  totalAmount:         { type: Number, required: true },
  paymentMethod:       { type: String, enum: ['cod', 'upi', 'card'], default: 'cod' },
  paymentStatus:       { type: String, enum: ['pending', 'paid'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['confirmed', 'preparing', 'picked_up', 'on_the_way', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  deliveryAddress:     { type: AddressSchema, required: true },
  deliveryPartnerId:   { type: ObjectId, ref: 'DeliveryPartner' },
  specialInstructions: { type: String, default: '' },
  paymentRef:          String
}, { timestamps: true });

// ══════════════════════════════════════════
// DELIVERY PARTNER MODEL
// ══════════════════════════════════════════
const DeliveryPartnerSchema = new Schema({
  userId:        { type: ObjectId, ref: 'User', required: true, unique: true },
  name:          { type: String, required: true },
  phone:         { type: String, required: true },
  vehicleNumber: { type: String, default: '' },
  currentLocation: {
    lat:       Number,
    lng:       Number,
    updatedAt: Date
  },
  activeOrderId:     { type: ObjectId, ref: 'Order', default: null },
  isAvailable:       { type: Boolean, default: true },
  totalDeliveries:   { type: Number, default: 0 },
  rating:            { type: Number, default: 5, min: 0, max: 5 }
}, { timestamps: true });

module.exports = {
  User:            model('User', UserSchema),
  Product:         model('Product', ProductSchema),
  Order:           model('Order', OrderSchema),
  DeliveryPartner: model('DeliveryPartner', DeliveryPartnerSchema)
};
