import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const initialCarDetails = {
  make: '', model: '', year: '', price: '', mileage: '',
  engine: {
    cylinders: '', arrangement: '', displacement: '', fuelType: '', horsepower: '', torque: ''
  },
  description: '', images: [], status: 'Available',
};

const arrangementOptions = [
  "V", "I", "H", "F", "W", "R", "Inline", "Flat", "Boxer", "Other"
];
const fuelTypeOptions = [
  "Gasoline", "Diesel", "Electric", "Hybrid", "Petrol", "Other"
];
const statusOptions = [
  "Available", "Sold", "Pending Sale", "Coming Soon", "Consignment", "Reserved", "Draft"
];

const EditCarPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [carDetails, setCarDetails] = useState(initialCarDetails);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCarData = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const config = { withCredentials: true };
        const { data } = await axios.get(`http://localhost:5500/api/cars/${carId}`, config);
        setCarDetails({
          ...initialCarDetails,
          ...data,
          engine: {
            ...initialCarDetails.engine,
            ...(typeof data.engine === "object" && data.engine ? data.engine : {})
          }
        });
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to fetch car details.");
        setCarDetails(initialCarDetails);
      } finally {
        setLoading(false);
      }
    };
    if (carId) {
      fetchCarData();
    } else {
      setLoading(false);
      setErrorMessage("No car ID provided for editing.");
    }
  }, [carId]);

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

  // Remove an existing image (mark for deletion)
  const handleRemoveExistingImage = (public_id) => {
    setImagesToDelete(prev => [...prev, public_id]);
    setCarDetails(prev => ({
      ...prev,
      images: prev.images.filter(img => img.public_id !== public_id)
    }));
  };

  // Add new images (for upload)
  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const currentCount = newImageFiles.length;
    const remainingSlots = 10 - (carDetails.images.length + currentCount);
    let filesToAdd = files;
    if (files.length > remainingSlots && remainingSlots > 0) {
      setFormMessage(`You can select ${remainingSlots} more image(s). ${files.length} selected, taking first ${remainingSlots}.`);
      filesToAdd = files.slice(0, remainingSlots);
    } else if (remainingSlots <= 0) {
      setFormMessage(`Maximum of 10 images already selected or would exceed limit.`);
      return;
    }
    setNewImageFiles(prev => [...prev, ...filesToAdd].slice(0, 10));
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...newPreviews].slice(0, 10));
    setFormMessage(`${filesToAdd.length} image(s) added for upload. Total: ${[...newImageFiles, ...filesToAdd].slice(0,10).length}.`);
  };

  const removeSelectedPreview = (indexToRemove) => {
    const newFiles = newImageFiles.filter((_, idx) => idx !== indexToRemove);
    const newPreviews = newImagePreviews.filter((_, idx) => idx !== indexToRemove);
    if (newImagePreviews[indexToRemove] && newImagePreviews[indexToRemove].startsWith('blob:')) {
      URL.revokeObjectURL(newImagePreviews[indexToRemove]);
    }
    setNewImageFiles(newFiles);
    setNewImagePreviews(newPreviews);
    setFormMessage(`Image removed from selection. Remaining: ${newFiles.length}`);
  };

  // Upload new images to Cloudinary and return array of {url, public_id}
  const uploadImagesToCloudinary = async (files) => {
    if (!files.length) return [];
    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
    const { data } = await axios.post('http://localhost:5500/api/upload', formData, config);
    setUploading(false);
    return data.images || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMessage('');
    setErrorMessage('');
    try {
      // 1. Upload new images if any
      let uploadedImages = [];
      if (newImageFiles.length > 0) {
        uploadedImages = await uploadImagesToCloudinary(newImageFiles);
      }
      // 2. Prepare payload
      const payload = {
        ...carDetails,
        images: [...carDetails.images, ...uploadedImages],
        publicIdsToDelete: imagesToDelete,
      };
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      await axios.put(`http://localhost:5500/api/cars/${carId}`, payload, config);
      setFormMessage('Car updated successfully!');
      setTimeout(() => {
        navigate('/admin/manage-cars');
      }, 1000);
    } catch (error) {
      setErrorMessage(`Car update failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
      setImagesToDelete([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
    }
  };

  useEffect(() => {
    return () => {
      newImagePreviews.forEach(previewUrl => URL.revokeObjectURL(previewUrl));
    };
  }, [newImagePreviews]);

  if (loading) return <div className={styles.adminPageContainer}><p className={styles.loadingMessage}>Loading car details...</p></div>;
  if (errorMessage && (!carDetails || !carDetails.make)) return <div className={styles.adminPageContainer}><p className={`${styles.message} ${styles.errorMessage}`}>{errorMessage}</p></div>;

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.formSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className={styles.formTitle}>Edit Car: {loading ? '...' : `${carDetails.make} ${carDetails.model}`}</h2>
          <button onClick={() => navigate('/admin/manage-cars')} className={`${styles.button} ${styles.cancelButton}`}>Back to Car List</button>
        </div>
        {formMessage && <p className={`${styles.message} ${formMessage.includes('failed') ? styles.errorMessage : styles.successMessage}`}>{formMessage}</p>}
        {errorMessage && <p className={`${styles.message} ${styles.errorMessage}`}>{errorMessage}</p>}
        <form onSubmit={handleSubmit} className={styles.carForm}>
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
          {/* Existing images with remove */}
          {carDetails.images && carDetails.images.length > 0 && (
            <div className={styles.imagePreviewsContainer}>
              <p>Current Images:</p>
              {carDetails.images.map((img, idx) => (
                <div key={img.public_id || idx} className={styles.imagePreviewItem}>
                  <img src={img.url} alt={`Car ${idx}`} className={styles.imagePreviewThumb} />
                  <button type="button" onClick={() => handleRemoveExistingImage(img.public_id)} className={styles.removePreviewButton}>×</button>
                </div>
              ))}
            </div>
          )}
          {/* Upload new images */}
          <div className={styles.formGroup}><label htmlFor="newImages">Add New Images:</label><input type="file" id="newImages" name="newImages" accept="image/*" multiple onChange={handleNewImagesChange} className={styles.fileInput} /></div>
          {newImagePreviews.length > 0 && (
            <div className={styles.imagePreviewsContainer}>
              <p>New Images to Upload ({newImagePreviews.length}/10):</p>
              {newImagePreviews.map((previewUrl, index) => (
                <div key={index} className={styles.imagePreviewItem}>
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className={styles.imagePreviewThumb}/>
                  <button type="button" onClick={() => removeSelectedPreview(index)} className={styles.removePreviewButton}>×</button>
                </div>
              ))}
            </div>
          )}
          <div className={styles.formActions} style={{marginTop:'20px'}}>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`} disabled={submitting || uploading}>
              {submitting ? 'Saving Changes...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCarPage;
