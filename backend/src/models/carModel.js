// backend/src/models/carModel.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String } 
});

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, trim: true, index: true },
  model: { type: String, required: true, trim: true, index: true },
  year: { type: Number, required: true, index: true },
  price: { type: Number, required: true, index: true },
  mileage: { type: Number, default: 0, index: true },
  description: { type: String, required: true },
  images: [imageSchema],
  
  engine: {
    cylinders: { type: Number },
    arrangement: { type: String, enum: ['V', 'I', 'H', 'F', 'W', 'R', 'Inline', 'Flat', 'Boxer', 'Other'] },
    displacement: { type: String }, 
    fuelType: { type: String, enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Petrol', 'Other'], index: true },
    horsepower: { type: Number },
    torque: { type: Number }, 
  },

  transmission: { type: String, enum: ['Automatic', 'Manual', 'Semi-Automatic', 'CVT'], index: true },
  drivetrain: { type: String, enum: ['FWD', 'RWD', 'AWD', '4WD'] },
  exteriorColor: { type: String, trim: true },
  interiorColor: { type: String, trim: true },
  vin: { type: String, unique: true, sparse: true, trim: true },
  bodyStyle: { type: String, trim: true, index: true },
  
  status: { 
    type: String, 
    enum: ['Available', 'Sold', 'Pending Sale', 'Coming Soon', 'Consignment', 'Reserved', 'Draft'], // Added Draft from your original
    default: 'Available',
    index: true 
  },

  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  featured: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }], 
  location: { type: String, trim: true },
  doors: { type: Number },

}, { timestamps: true });

carSchema.index({ 
  make: 'text', model: 'text', description: 'text', bodyStyle: 'text', 
  exteriorColor: 'text', 'engine.fuelType': 'text', location: 'text', tags: 'text' 
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
