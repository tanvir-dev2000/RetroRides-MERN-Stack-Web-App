import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const initialCarDetails = {
  make: '', model: '', year: '', price: '', mileage: '',
  engine: {
    cylinders: '',
    arrangement: '',
    displacement: '',
    fuelType: '',
    horsepower: '',
    torque: ''
  },
  description: '', images: [], status: 'Available',
};

const statusOptions = [
  "Available", "Sold", "Pending Sale", "Coming Soon", "Consignment", "Reserved", "Draft"
];
const arrangementOptions = [
  "V", "I", "H", "F", "W", "R", "Inline", "Flat", "Boxer", "Other"
];
const fuelTypeOptions = [
  "Gasoline", "Diesel", "Electric", "Hybrid", "Petrol", "Other"
];

const ManageCarsPage = () => {
  const navigate = useNavigate();
  const [carDetails, setCarDetails] = useState(initialCarDetails);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formMessage, setFormMessage] = useState('');
  const [carsList, setCarsList] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carsListError, setCarsListError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminCars = async () => {
    setLoadingCars(true);
    setCarsListError('');
    try {
      const config = { withCredentials: true };
      const { data } = await axios.get('http://localhost:5500/api/cars/admin/all', config);
      setCarsList(data || []);
    } catch (error) {
      setCarsList([]);
      setCarsListError(error.response?.data?.message || "Failed to fetch car list. Please check console.");
    } finally {
      setLoadingCars(false);
    }
  };

  useEffect(() => { fetchAdminCars(); }, []);

  // Support nested engine fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('engine.')) {
      const key = name.split('.')[1];
      setCarDetails(prev => ({
        ...prev,
        engine: {
          ...prev.engine,
          [key]: value
        }
      }));
    } else {
      setCarDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      setImageFiles([]);
      setImagePreviews([]);
      return;
    }
    const currentFileCount = imageFiles.length;
    const remainingSlots = 10 - currentFileCount;
    let filesToAdd = files;
    if (files.length > remainingSlots && remainingSlots > 0) {
      setFormMessage(`You can select ${remainingSlots} more image(s). ${files.length} selected, taking first ${remainingSlots}.`);
      filesToAdd = files.slice(0, remainingSlots);
    } else if (remainingSlots <= 0) {
      setFormMessage(`Maximum of 10 images already selected or would exceed limit.`);
      return;
    }
    setImageFiles(prevFiles => [...prevFiles, ...filesToAdd].slice(0,10));
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews].slice(0,10));
    setFormMessage(`${filesToAdd.length} image(s) added to selection. Total: ${[...imageFiles, ...filesToAdd].slice(0,10).length}.`);
  };

  const removeSelectedPreview = (indexToRemove) => {
    const newImageFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    if (imagePreviews[indexToRemove] && imagePreviews[indexToRemove].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[indexToRemove]);
    }
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
    setFormMessage(`Image removed from selection. Remaining: ${newImageFiles.length}`);
  };

  // Upload images to Cloudinary and return array of {url, public_id}
  const uploadImagesToCloudinary = async (files) => {
    if (!files.length) return [];
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
    const { data } = await axios.post('http://localhost:5500/api/upload', formData, config);
    return data.images || [];
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMessage('');
    try {
      // 1. Upload images first
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        uploadedImages = await uploadImagesToCloudinary(imageFiles);
      }
      // 2. Submit car details with images
      const payload = { ...carDetails, images: uploadedImages };
      if (!payload.status) payload.status = 'Available';
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const { data: newCar } = await axios.post('http://localhost:5500/api/cars', payload, config);
      setFormMessage(`Car "${newCar.make} ${newCar.model}" created successfully!`);
      setCarDetails(initialCarDetails);
      setImageFiles([]);
      setImagePreviews([]);
      fetchAdminCars();
    } catch (error) {
      setFormMessage(`Car submission failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCar = (carId) => navigate(`/admin/edit-car/${carId}`);

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setFormMessage('');
      try {
        const config = { withCredentials: true };
        await axios.delete(`http://localhost:5500/api/cars/${carId}`, config);
        setFormMessage(`Car ID ${carId} deleted successfully.`);
        fetchAdminCars();
      } catch (error) {
        setFormMessage(`Failed to delete car ID ${carId}: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(previewUrl => URL.revokeObjectURL(previewUrl));
    };
  }, [imagePreviews]);

  return (
    <div className={styles.adminPageContainer}>
      {/* Section 1: Add New Car Form */}
      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Add New Car</h2>
        <form onSubmit={handleCarSubmit} className={styles.carForm}>
          <div className={styles.formGrid}>
            {/* ...other fields... */}
            <div className={styles.formGroup}><label htmlFor="make">Manufacturer:</label><input type="text" name="make" id="make" value={carDetails.make} onChange={handleInputChange} required className={styles.inputField} /></div>
            <div className={styles.formGroup}><label htmlFor="model">Model:</label><input type="text" name="model" id="model" value={carDetails.model} onChange={handleInputChange} required className={styles.inputField} /></div>
            <div className={styles.formGroup}><label htmlFor="year">Year:</label><input type="number" name="year" id="year" value={carDetails.year} onChange={handleInputChange} required className={styles.inputField} /></div>
            <div className={styles.formGroup}><label htmlFor="price">Price ($):</label><input type="number" name="price" id="price" step="0.01" value={carDetails.price} onChange={handleInputChange} required className={styles.inputField} /></div>
            <div className={styles.formGroup}><label htmlFor="mileage">Mileage:</label><input type="number" name="mileage" id="mileage" value={carDetails.mileage} onChange={handleInputChange} className={styles.inputField} /></div>
            {/* ENGINE FIELDS */}
            <div className={styles.formGroup}><label htmlFor="engine.cylinders">Engine Cylinders:</label><input type="number" name="engine.cylinders" id="engine.cylinders" value={carDetails.engine.cylinders} onChange={handleInputChange} className={styles.inputField} /></div>
            <div className={styles.formGroup}><label htmlFor="engine.arrangement">Engine Arrangement:</label>
              <select name="engine.arrangement" id="engine.arrangement" value={carDetails.engine.arrangement} onChange={handleInputChange} className={styles.inputField}>
                <option value="">Select</option>
                {arrangementOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}><label htmlFor="engine.displacement">Engine Displacement:</label><input type="text" name="engine.displacement" id="engine.displacement" value={carDetails.engine.displacement} onChange={handleInputChange} className={styles.inputField} /></div>
            <div className={styles.formGroup}><label htmlFor="engine.fuelType">Engine Fuel Type:</label>
              <select name="engine.fuelType" id="engine.fuelType" value={carDetails.engine.fuelType} onChange={handleInputChange} className={styles.inputField}>
                <option value="">Select</option>
                {fuelTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}><label htmlFor="engine.horsepower">Engine Horsepower:</label><input type="number" name="engine.horsepower" id="engine.horsepower" value={carDetails.engine.horsepower} onChange={handleInputChange} className={styles.inputField} /></div>
            <div className={styles.formGroup}><label htmlFor="engine.torque">Engine Torque:</label><input type="number" name="engine.torque" id="engine.torque" value={carDetails.engine.torque} onChange={handleInputChange} className={styles.inputField} /></div>
            {/* END ENGINE FIELDS */}
            <div className={styles.formGroup}>
              <label htmlFor="status">Status:</label>
              <select name="status" id="status" value={carDetails.status} onChange={handleInputChange} className={styles.inputField}>
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}><label htmlFor="description">Description:</label><textarea name="description" id="description" value={carDetails.description} onChange={handleInputChange} className={styles.textareaField} /></div>
          <div className={styles.formGroup}><label htmlFor="images">Car Images (select multiple, up to 10):</label><input type="file" id="images" name="images" accept="image/*" multiple onChange={handleFileChange} className={styles.fileInput} /></div>
          {imagePreviews.length > 0 && (
            <div className={styles.imagePreviewsContainer}>
              <p>Selected Images to Upload ({imagePreviews.length}/10):</p>
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className={styles.imagePreviewItem}>
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className={styles.imagePreviewThumb}/>
                  <button type="button" onClick={() => removeSelectedPreview(index)} className={styles.removePreviewButton}>×</button>
                </div>
              ))}
            </div>
          )}
          {formMessage && <p className={`${styles.message} ${formMessage.includes('failed') || formMessage.includes('Error') ? styles.errorMessage : styles.successMessage}`} style={{marginTop: '15px'}}>{formMessage}</p>}
          <div className={styles.formActions} style={{marginTop:'20px'}}>
            <button type="submit" disabled={submitting} className={`${styles.button} ${styles.submitButton}`}>Add Car to Listings</button>
          </div>
        </form>
      </div>
      {/* Section 2: Manage Car Listings */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}><h2 className={styles.listTitle}>Manage Car Listings</h2></div>
        {carsListError && <p className={`${styles.message} ${styles.errorMessage}`}>{carsListError}</p>}
        {loadingCars ? <p className={styles.loadingMessage}>Loading car list...</p> : carsList.length === 0 && !carsListError ? <p className={styles.emptyMessage}>No cars found in the inventory. Add one above!</p> : (
          <div className={styles.tableResponsive}>
            <table className={styles.carTable}>
              <thead>
                <tr>
                  <th>Main Image</th>
                  <th>Manufacturer</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {carsList.map(car => (
                  <tr key={car._id}>
                    <td>{car.images && car.images.length > 0 ? <img src={car.images[0].url} alt={`${car.make} ${car.model}`} className={styles.carTableImage} /> : <div className={styles.noImagePlaceholder}>No Image</div>}</td>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td>${car.price ? Number(car.price).toLocaleString() : 'N/A'}</td>
                    <td><span className={`${styles.statusBadge} ${styles['status' + (car.status ? car.status.charAt(0).toUpperCase() + car.status.slice(1) : 'Unknown')]}`}>{car.status || 'N/A'}</span></td>
                    <td className={styles.actionsCell}>
                      <button onClick={() => handleEditCar(car._id)} className={`${styles.button} ${styles.editButton}`}>Edit</button>
                      <button onClick={() => handleDeleteCar(car._id)} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCarsPage;
