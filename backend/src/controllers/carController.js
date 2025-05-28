// backend/src/controllers/carController.js
const asyncHandler = require('express-async-handler');
const Car = require('../models/carModel');
const { cloudinary } = require('../config/cloudinary'); // Assuming this path is correct

// --- createCar (from your file) ---
const createCar = asyncHandler(async (req, res) => {
  const { make, model, year, price, images, mileage, engine, description, status } = req.body;
  if (!make || !model || !year || !price || !images || images.length === 0) {
    res.status(400);
    throw new Error('Please provide all required fields: make, model, year, price, and at least one image.');
  } 
  // NOTE: Consider adding an 'else' or 'return' in the if block above if car creation
  // should only happen if validation passes.
  const car = await Car.create({ 
    make, model, year, price, mileage, engine, images, description,
    status: status || 'available', 
  });
  res.status(201).json(car);
});


// --- REVISED and CORRECTED getCars for PUBLIC LISTING ---
const getCars = asyncHandler(async (req, res) => {
  const {
    search, make, minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
    status = 'Available', 
    'engine.cylinders': engineCylinders,
    'engine.arrangement': engineArrangement,
    'engine.fuelType': engineFuelType,
    bodyStyle, transmission,
    sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 12
  } = req.query;

  const query = {};

  if (status && status.toLowerCase() !== 'all') {
    query.status = status;
  } else if (status.toLowerCase() !== 'all') { 
    query.status = { $nin: ['Draft', 'Sold', 'Pending Sale', 'Reserved'] };
  } // <-- MISSING BRACE WAS HERE in your provided file

  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    query.$or = [
      { make: searchRegex }, { model: searchRegex }, { description: searchRegex },
      { bodyStyle: searchRegex }, { tags: searchRegex }, { location: searchRegex }
    ];
    if (!isNaN(parseInt(search))) {
      query.$or.push({ year: parseInt(search) });
    } // <-- MISSING BRACE WAS HERE
  }

  if (make) {
    const makesArray = make.split(',').map(m => m.trim()).filter(Boolean);
    if (makesArray.length > 0) query.make = { $in: makesArray };
  } // <-- MISSING BRACE WAS HERE
  
  if (bodyStyle) {
    const bodyStylesArray = bodyStyle.split(',').map(bs => bs.trim()).filter(Boolean);
    if (bodyStylesArray.length > 0) query.bodyStyle = { $in: bodyStylesArray };
  } // <-- MISSING BRACE WAS HERE
  
  if (transmission) {
    const transmissionsArray = transmission.split(',').map(t => t.trim()).filter(Boolean);
    if (transmissionsArray.length > 0) query.transmission = { $in: transmissionsArray };
  } // <-- MISSING BRACE WAS HERE

  if (engineCylinders && !isNaN(parseInt(engineCylinders))) query['engine.cylinders'] = parseInt(engineCylinders);
  if (engineArrangement) query['engine.arrangement'] = engineArrangement;
  if (engineFuelType) query['engine.fuelType'] = engineFuelType;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice && !isNaN(parseFloat(minPrice))) query.price.$gte = parseFloat(minPrice);
    if (maxPrice && !isNaN(parseFloat(maxPrice))) query.price.$lte = parseFloat(maxPrice);
    if (Object.keys(query.price).length === 0) delete query.price; // Clean up if empty
  } // <-- MISSING BRACE WAS HERE

  if (minYear || maxYear) {
    query.year = {};
    if (minYear && !isNaN(parseInt(minYear))) query.year.$gte = parseInt(minYear);
    if (maxYear && !isNaN(parseInt(maxYear))) query.year.$lte = parseInt(maxYear);
    if (Object.keys(query.year).length === 0) delete query.year;
  } // <-- MISSING BRACE WAS HERE

  if (minMileage || maxMileage) {
    query.mileage = {};
    if (minMileage && !isNaN(parseInt(minMileage))) query.mileage.$gte = parseInt(minMileage);
    if (maxMileage && !isNaN(parseInt(maxMileage))) query.mileage.$lte = parseInt(maxMileage);
    if (Object.keys(query.mileage).length === 0) delete query.mileage;
  } // <-- MISSING BRACE WAS HERE

  let sortOptions = {};
  if (sortBy === 'arrivals') sortOptions['createdAt'] = sortOrder === 'asc' ? 1 : -1;
  else if (sortBy === 'price') sortOptions['price'] = sortOrder === 'asc' ? 1 : -1;
  else if (sortBy === 'alphabetically') {
    sortOptions['make'] = sortOrder === 'asc' ? 1 : -1;
    sortOptions['model'] = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'year') sortOptions['year'] = sortOrder === 'asc' ? 1 : -1;
  else sortOptions['createdAt'] = -1;
  // <-- MISSING BRACE WAS HERE

  const pageNumber = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const skip = (pageNumber - 1) * itemsPerPage;

  const cars = await Car.find(query).sort(sortOptions).skip(skip).limit(itemsPerPage);
  const totalCars = await Car.countDocuments(query);

  res.status(200).json({
    cars,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCars / itemsPerPage),
    totalCars,
  });
});

// --- getAllCarsForAdmin (from your file) ---
const getAllCarsForAdmin = asyncHandler(async (req, res) => {
  const cars = await Car.find({}).sort({ createdAt: -1 });
  res.json(cars); 
});

// --- getCarById (from your file) ---
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (car) {
    res.json(car);
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
});

// --- updateCar (from your file, ensure all parts are complete from your original) ---
const updateCar = asyncHandler(async (req, res) => {
  const carToUpdate = await Car.findById(req.params.id);
  if (!carToUpdate) {
    res.status(404);
    throw new Error('Car not found');
  }
  const {
    make, model, year, price, mileage, engine, description, status,
    images, publicIdsToDelete 
  } = req.body;

  carToUpdate.make = make !== undefined ? make : carToUpdate.make;
  carToUpdate.model = model !== undefined ? model : carToUpdate.model;
  carToUpdate.year = year !== undefined ? year : carToUpdate.year;
  carToUpdate.price = price !== undefined ? price : carToUpdate.price;
  carToUpdate.mileage = mileage !== undefined ? mileage : carToUpdate.mileage;
  carToUpdate.engine = engine !== undefined ? { ...carToUpdate.engine, ...engine } : carToUpdate.engine; 
  carToUpdate.description = description !== undefined ? description : carToUpdate.description;
  carToUpdate.status = status !== undefined ? status : carToUpdate.status;

  if (images !== undefined) {
    const idsToDeleteFromCloudinary = [];
    if (publicIdsToDelete && Array.isArray(publicIdsToDelete) && publicIdsToDelete.length > 0) {
        idsToDeleteFromCloudinary.push(...publicIdsToDelete);
    }
    const existingPublicIds = carToUpdate.images.map(img => img.public_id).filter(id => id);
    const newImagePublicIds = images.map(img => img.public_id).filter(id => id);
    existingPublicIds.forEach(oldId => {
        if (!newImagePublicIds.includes(oldId) && !idsToDeleteFromCloudinary.includes(oldId)) {
            idsToDeleteFromCloudinary.push(oldId);
        }
    });
    if (idsToDeleteFromCloudinary.length > 0) {
        for (const publicId of idsToDeleteFromCloudinary) {
            if (publicId) {
                try { await cloudinary.uploader.destroy(publicId); } 
                catch (cloudinaryError) { console.error(`Cloudinary Deletion Error for ${publicId}:`, cloudinaryError.message); }
            }
        }
    }
    carToUpdate.images = images;
  }
  const updatedCar = await carToUpdate.save();
  res.json(updatedCar);
});

// --- deleteCar (from your file) ---
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    res.status(404); throw new Error('Car not found');
  }
  if (car.images && car.images.length > 0) {
    for (const image of car.images) {
      if (image.public_id) {
        try { await cloudinary.uploader.destroy(image.public_id); } 
        catch (cloudinaryError) { console.error(`Cloudinary Deletion Error for ${image.public_id}:`, cloudinaryError.message); }
      }
    }
  }
  await car.deleteOne();
  res.json({ message: 'Car removed successfully', id: req.params.id });
});

// --- getCarFilterOptions (from your file) ---
const getCarFilterOptions = asyncHandler(async (req, res) => {
    const makes = await Car.distinct('make').then(values => values.filter(Boolean).sort());
    const bodyStyles = await Car.distinct('bodyStyle').then(values => values.filter(Boolean).sort());
    const statuses = await Car.distinct('status').then(values => values.filter(Boolean).sort());
    const engineArrangements = await Car.distinct('engine.arrangement').then(values => values.filter(Boolean).sort());
    const engineCylinderNumbers = await Car.distinct('engine.cylinders').then(values => values.filter(v => typeof v === 'number').sort((a,b) => a-b));
    const fuelTypes = await Car.distinct('engine.fuelType').then(values => values.filter(Boolean).sort());
    const transmissions = await Car.distinct('transmission').then(values => values.filter(Boolean).sort());
    
    const priceRange = await Car.aggregate([
        { $match: { status: { $nin: ['Draft', 'Sold', 'Pending Sale', 'Reserved'] } } },
        { $group: { _id: null, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } }
    ]);
    const yearRange = await Car.aggregate([
        { $match: { status: { $nin: ['Draft', 'Sold', 'Pending Sale', 'Reserved'] } } },
        { $group: { _id: null, minYear: { $min: "$year" }, maxYear: { $max: "$year" } } }
    ]);
    const mileageRange = await Car.aggregate([
        { $match: { status: { $nin: ['Draft', 'Sold', 'Pending Sale', 'Reserved'] } } },
        { $group: { _id: null, minMileage: { $min: "$mileage" }, maxMileage: { $max: "$mileage" } } }
    ]);

    res.json({
        makes, bodyStyles, statuses, engineArrangements, engineCylinderNumbers, fuelTypes, transmissions,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        yearRange: yearRange[0] || { minYear: 1900, maxYear: new Date().getFullYear() },
        mileageRange: mileageRange[0] || { minMileage: 0, maxMileage: 0 },
    });
});

module.exports = {
  createCar, getCars, getAllCarsForAdmin, getCarById, updateCar, deleteCar, getCarFilterOptions
};
