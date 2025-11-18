import React, { useState, useRef } from 'react';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { toast } from 'react-toastify';

const PhotoUpload = ({ photos, onPhotosChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format. Please use JPG, PNG, or WebP.`);
        continue;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newPhotos = [];
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPhotos.push(e.target.result);
          if (newPhotos.length === validFiles.length) {
            onPhotosChange([...photos, ...newPhotos]);
            toast.success(`${validFiles.length} photo${validFiles.length > 1 ? 's' : ''} uploaded successfully`);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    toast.info('Photo removed');
  };

  const handlePhotoDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handlePhotoDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handlePhotoDragLeave = () => {
    setDragOverIndex(null);
  };

  const handlePhotoDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex) {
      const newPhotos = [...photos];
      const draggedPhoto = newPhotos[dragIndex];
      newPhotos.splice(dragIndex, 1);
      newPhotos.splice(dropIndex, 0, draggedPhoto);
      onPhotosChange(newPhotos);
      toast.info('Photo order updated');
    }
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Photos</h3>
        <p className="text-gray-600">Upload photos of your property. The first photo will be the main image.</p>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
            dragActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <ApperIcon name="Upload" size={24} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Drag and drop your photos here
            </p>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
            <Button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose Files
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Supported formats: JPG, PNG, WebP</p>
            <p>Maximum size: 5MB per file</p>
          </div>
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">
              Uploaded Photos ({photos.length})
            </h4>
            <p className="text-sm text-gray-500">
              Drag photos to reorder • First photo is your main image
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  dragOverIndex === index 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-transparent hover:shadow-md'
                } ${index === 0 ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                draggable
                onDragStart={(e) => handlePhotoDragStart(e, index)}
                onDragOver={(e) => handlePhotoDragOver(e, index)}
                onDragLeave={handlePhotoDragLeave}
                onDrop={(e) => handlePhotoDrop(e, index)}
              >
                <div className="aspect-square relative">
                  <img
                    src={photo}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Main photo indicator */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                      Main Photo
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ApperIcon name="X" size={16} />
                  </button>
                  
                  {/* Drag indicator */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg p-2">
                      <ApperIcon name="GripVertical" size={20} className="text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add More Photos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;