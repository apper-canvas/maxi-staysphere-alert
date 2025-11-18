import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { toast } from "react-toastify";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="property-card cursor-pointer overflow-hidden group">
        {/* Image Section */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="property-image w-full h-full object-cover"
            onClick={handleCardClick}
          />
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <ApperIcon 
              name="Heart" 
              className={`w-4 h-4 transition-colors ${isFavorite ? 'text-primary fill-current heart-bounce' : 'text-gray-600 hover:text-primary'}`}
            />
          </button>

          {/* Image Indicators */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Instant Book Badge */}
          {property.instantBook && (
            <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-semibold px-2 py-1 rounded-full">
              Instant Book
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4" onClick={handleCardClick}>
          {/* Location and Rating */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-display font-semibold text-gray-900 text-sm md:text-base mb-1 line-clamp-2">
                {property.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {property.location.city}, {property.location.country}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <ApperIcon name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{property.rating}</span>
              <span className="text-sm text-gray-500">({property.reviewCount})</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <span>{property.maxGuests} guests</span>
            <span>•</span>
            <span>{property.bedrooms} bedrooms</span>
            <span>•</span>
            <span>{property.bathrooms} baths</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">{property.propertyType}</div>
            <div className="text-right">
              <span className="font-display font-bold text-gray-900">
                ${property.pricePerNight}
              </span>
              <span className="text-sm text-gray-600 ml-1">night</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;