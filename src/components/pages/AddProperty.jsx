import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { propertyService } from "@/services/api/propertyService";

const PROPERTY_TYPES = [
  { value: 'entire_place', label: 'Entire place', description: 'Guests have the whole place to themselves' },
  { value: 'private_room', label: 'Private room', description: 'Guests have a private room in a home' },
  { value: 'shared_room', label: 'Shared room', description: 'Guests sleep in a room or common area' }
];

function AddProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    pricePerNight: ''
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Tell us about your property' },
    { number: 2, title: 'Property Details', description: 'Room and guest information' },
    { number: 3, title: 'Pricing', description: 'Set your nightly rate' },
    { number: 4, title: 'Review & Submit', description: 'Double-check everything' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Property name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }
    
    if (step === 2) {
      if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
      if (formData.bedrooms < 1) newErrors.bedrooms = 'At least 1 bedroom required';
      if (formData.bathrooms < 1) newErrors.bathrooms = 'At least 1 bathroom required';
      if (formData.maxGuests < 1) newErrors.maxGuests = 'At least 1 guest required';
    }
    
    if (step === 3) {
      if (!formData.pricePerNight || parseFloat(formData.pricePerNight) <= 0) {
        newErrors.pricePerNight = 'Valid price per night is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    try {
      const propertyData = {
        ...formData,
        hostId: 1, // For demo purposes - in real app, get from auth
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        maxGuests: parseInt(formData.maxGuests),
        pricePerNight: parseFloat(formData.pricePerNight),
        images: ['/api/placeholder/800/600'], // Default placeholder
        amenities: [],
        rating: 0,
        reviewCount: 0,
        location: {
          lat: 0,
          lng: 0
        }
      };
      
      await propertyService.create(propertyData);
      toast.success('Property listed successfully!');
      navigate('/host/1'); // Navigate back to host profile
    } catch (error) {
      toast.error('Failed to create property. Please try again.');
      console.error('Property creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Enter a catchy name for your property"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe what makes your property special"
                rows="4"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="Enter the full address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What kind of place are you offering?
              </label>
              <div className="space-y-3">
                {PROPERTY_TYPES.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => updateFormData('propertyType', type.value)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.propertyType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                ))}
              </div>
              {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.bedrooms}
                  onChange={(e) => updateFormData('bedrooms', e.target.value)}
                  className={errors.bedrooms ? 'border-red-500' : ''}
                />
                {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.bathrooms}
                  onChange={(e) => updateFormData('bathrooms', e.target.value)}
                  className={errors.bathrooms ? 'border-red-500' : ''}
                />
                {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.maxGuests}
                  onChange={(e) => updateFormData('maxGuests', e.target.value)}
                  className={errors.maxGuests ? 'border-red-500' : ''}
                />
                {errors.maxGuests && <p className="text-red-500 text-sm mt-1">{errors.maxGuests}</p>}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per night (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={(e) => updateFormData('pricePerNight', e.target.value)}
                  placeholder="0.00"
                  className={`pl-8 ${errors.pricePerNight ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.pricePerNight && <p className="text-red-500 text-sm mt-1">{errors.pricePerNight}</p>}
              <p className="text-sm text-gray-500 mt-2">
                This is your base price. You can adjust it later or offer discounts for longer stays.
              </p>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Listing</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{formData.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{formData.description}</p>
                <p className="text-gray-500 text-sm">{formData.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Property Details</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Type: {PROPERTY_TYPES.find(t => t.value === formData.propertyType)?.label}</li>
                    <li>Bedrooms: {formData.bedrooms}</li>
                    <li>Bathrooms: {formData.bathrooms}</li>
                    <li>Max Guests: {formData.maxGuests}</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Pricing</h5>
                  <p className="text-2xl font-bold text-primary">${formData.pricePerNight}</p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              List Your Property
            </h1>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px ${
                    currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Current Step Info */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-32"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                'Submit Listing'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProperty;