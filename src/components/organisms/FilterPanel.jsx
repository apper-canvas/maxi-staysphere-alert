import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FilterChip from "@/components/molecules/FilterChip";

const FilterPanel = ({ filters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handlePriceChange = (value, type) => {
    const newRange = [...(localFilters.priceRange || [0, 1000])];
    if (type === "min") newRange[0] = parseInt(value);
    if (type === "max") newRange[1] = parseInt(value);
    setLocalFilters({ ...localFilters, priceRange: newRange });
  };

  const handleGuestsChange = (guests) => {
    setLocalFilters({ ...localFilters, guests });
  };

  const handlePropertyTypeChange = (type) => {
    setLocalFilters({ ...localFilters, propertyType: type });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = localFilters.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    setLocalFilters({ ...localFilters, amenities: updatedAmenities });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const propertyTypes = [
    { id: "all", label: "Any type", icon: "Home" },
    { id: "house", label: "House", icon: "Home" },
    { id: "apartment", label: "Apartment", icon: "Building" },
    { id: "condo", label: "Condo", icon: "Building2" },
    { id: "villa", label: "Villa", icon: "Castle" },
  ];

  const amenities = [
    { id: "wifi", label: "Wifi", icon: "Wifi" },
    { id: "kitchen", label: "Kitchen", icon: "ChefHat" },
    { id: "washer", label: "Washer", icon: "Shirt" },
    { id: "dryer", label: "Dryer", icon: "Wind" },
    { id: "airConditioning", label: "Air conditioning", icon: "Snowflake" },
    { id: "heating", label: "Heating", icon: "Thermometer" },
    { id: "tv", label: "TV", icon: "Tv" },
    { id: "parking", label: "Free parking", icon: "Car" },
    { id: "gym", label: "Gym", icon: "Dumbbell" },
    { id: "pool", label: "Pool", icon: "Waves" },
    { id: "hotTub", label: "Hot tub", icon: "Bath" },
    { id: "fireplace", label: "Fireplace", icon: "Flame" },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[80vh] overflow-y-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-900">Filters</h2>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={localFilters.priceRange?.[0] || 0}
                    onChange={(e) => handlePriceChange(e.target.value, "min")}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={localFilters.priceRange?.[1] || 1000}
                    onChange={(e) => handlePriceChange(e.target.value, "max")}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guests</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((count) => (
              <FilterChip
                key={count}
                label={`${count}+ guest${count !== 1 ? 's' : ''}`}
                active={localFilters.guests === count}
                onClick={() => handleGuestsChange(count)}
              />
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property type</h3>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handlePropertyTypeChange(type.id)}
                className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${
                  localFilters.propertyType === type.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={type.icon} className="w-5 h-5" />
                <span className="font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-3">
            {amenities.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() => handleAmenityToggle(amenity.id)}
                className={`flex items-center gap-3 p-3 border rounded-lg transition-all text-left ${
                  localFilters.amenities?.includes(amenity.id)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={amenity.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{amenity.label}</span>
              </button>
            ))}
          </div>
        </div>

{/* Bedrooms */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">Bedrooms</h4>
          <div className="grid grid-cols-4 gap-2">
            {['Any', '1+', '2+', '3+', '4+', '5+'].map((option) => (
              <button
                key={option}
                onClick={() => setLocalFilters({ 
                  ...localFilters, 
                  bedrooms: option === 'Any' ? null : parseInt(option.replace('+', ''))
                })}
                className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                  (localFilters.bedrooms === null && option === 'Any') ||
                  (localFilters.bedrooms === parseInt(option.replace('+', '')))
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Instant Book */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.instantBook || false}
              onChange={(e) => setLocalFilters({ ...localFilters, instantBook: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <div>
              <div className="font-medium text-gray-900">Instant Book</div>
              <div className="text-sm text-gray-500">Listings you can book without waiting for approval</div>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Clear all
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Show properties
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;