import React, { useState, useEffect } from 'react';
import { Employee, EmployeeFormData, LocationData } from '../types';
import { MapPin, Save, X, Loader2 } from 'lucide-react';

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void;
  onCancelEdit: () => void;
  editingEmployee?: Employee | null;
}

const INITIAL_STATE: EmployeeFormData = {
  fullName: '',
  email: '',
  phone: '',
  age: 18,
  gender: 'Male',
  department: '',
  address: '',
  location: undefined,
};

const DEPARTMENTS = ['Engineering', 'Human Resources', 'Sales', 'Marketing', 'Finance', 'Operations'];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSubmit, onCancelEdit, editingEmployee }) => {
  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        fullName: editingEmployee.fullName,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        age: editingEmployee.age,
        gender: editingEmployee.gender,
        department: editingEmployee.department,
        address: editingEmployee.address,
        location: editingEmployee.location,
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrors({});
  }, [editingEmployee]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!formData.age || formData.age < 18 || formData.age > 60) {
      newErrors.age = 'Age must be between 18 and 60.';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      if (!editingEmployee) {
        setFormData(INITIAL_STATE); // Reset only if not editing (or parent handles it)
      }
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setFormData((prev) => ({ ...prev, location: loc }));
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoadingLocation(false);

        let msg = 'Unable to retrieve location.';
        
        // Use numeric codes for broader compatibility and safety
        // 1: PERMISSION_DENIED, 2: POSITION_UNAVAILABLE, 3: TIMEOUT
        if (error.code === 1) {
          msg = 'Location permission denied. Please allow location access in your browser settings.';
        } else if (error.code === 2) {
          msg = 'Location information is unavailable. Please check your signal.';
        } else if (error.code === 3) {
          msg = 'The request to get user location timed out. Please try again.';
        } else if (typeof error.message === 'string' && error.message.trim() !== '') {
          msg = error.message;
        }

        alert(msg);
      },
      options
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || '' : value,
    }));
    // Clear error for this field
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        {editingEmployee ? 'Edit Employee' : 'Register New Employee'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="1234567890"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Age & Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age (18-60) *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min={18}
              max={60}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="flex gap-4">
            {['Male', 'Female', 'Other'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Enter full address"
          />
        </div>

        {/* Geolocation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
          <div className="flex items-center gap-3">
             <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingLocation}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition border border-indigo-200"
            >
              {loadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {loadingLocation ? 'Detecting...' : 'Get Current Location'}
            </button>
            {formData.location && (
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded border border-green-200">
                Lat: {formData.location.latitude.toFixed(4)}, Lng: {formData.location.longitude.toFixed(4)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            {editingEmployee ? 'Update Employee' : 'Save Employee'}
          </button>
          
          {editingEmployee && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;