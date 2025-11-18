import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import RatingDisplay from "@/components/molecules/RatingDisplay";
import BookingWidget from "@/components/organisms/BookingWidget";
import AvailabilityCalendar from "@/components/molecules/AvailabilityCalendar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { propertyService } from "@/services/api/propertyService";
import { hostService } from "@/services/api/hostService";
import { reviewService } from "@/services/api/reviewService";
const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [property, setProperty] = useState(null);
  const [host, setHost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      const propertyData = await propertyService.getById(parseInt(id));
      if (!propertyData) {
        throw new Error("Property not found");
      }
      
      setProperty(propertyData);
      
      // Load host data
      const hostData = await hostService.getById(propertyData.hostId);
      setHost(hostData);
      
      // Load reviews
      const reviewsData = await reviewService.getByPropertyId(parseInt(id));
      setReviews(reviewsData);
      
    } catch (err) {
      setError(err.message || "Failed to load property details");
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPropertyDetails();
  }, [id]);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setShowGallery(true);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const amenityIcons = {
    wifi: "Wifi",
    kitchen: "ChefHat",
    washer: "Shirt",
    dryer: "Wind",
    airConditioning: "Snowflake",
    heating: "Thermometer",
    tv: "Tv",
    parking: "Car",
    gym: "Dumbbell",
    pool: "Waves",
    hotTub: "Bath",
    fireplace: "Flame"
  };

  if (loading) {
    return <Loading type="details" />;
  }

  if (error) {
    return (
      <ErrorView
        title="Property not found"
        message={error}
        onRetry={loadPropertyDetails}
      />
    );
  }

  if (!property) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        Back
      </motion.button>

      {/* Title */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          {property.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <RatingDisplay rating={property.rating} reviewCount={property.reviewCount} />
          <span>•</span>
<span>
                {[property.location?.address, property.location?.city, property.location?.country]
                  .filter(Boolean)
                  .join(', ') || 'Address not available'}
              </span>
        </div>
      </motion.div>

      {/* Image Gallery */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Main Image */}
        <div className="relative">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-80 lg:h-96 object-cover cursor-pointer hover:brightness-95 transition-all"
            onClick={() => handleImageClick(0)}
          />
          {property.images.length > 1 && (
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors"
            >
              Show all photos
            </button>
          )}
        </div>

        {/* Thumbnail Grid */}
        {property.images.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {property.images.slice(1, 5).map((image, index) => (
              <img
                key={index + 1}
                src={image}
                alt={`${property.title} ${index + 2}`}
                className="w-full h-36 lg:h-[11.5rem] object-cover cursor-pointer hover:brightness-95 transition-all rounded-lg"
                onClick={() => handleImageClick(index + 1)}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Host Info */}
          <motion.div
            className="border-b border-gray-200 pb-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  {property.propertyType} hosted by {host?.name}
                </h2>
                <p className="text-gray-600">
                  {property.maxGuests} guest{property.maxGuests !== 1 ? 's' : ''} • {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''} • {property.beds} bed{property.beds !== 1 ? 's' : ''} • {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                </p>
              </div>
              {host && (
                <button
                  onClick={() => navigate(`/host/${host.Id}`)}
                  className="flex-shrink-0"
                >
                  <img
                    src={host.photo}
                    alt={host.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </button>
              )}
            </div>
            
            {host && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{host.rating} rating</span>
                </div>
                <span>•</span>
                <span>{host.reviewCount} reviews</span>
                <span>•</span>
                <span>Joined {new Date(host.joinedDate).getFullYear()}</span>
                {host.superhost && (
                  <>
                    <span>•</span>
                    <span className="text-primary font-medium">Superhost</span>
                  </>
                )}
              </div>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            className="border-b border-gray-200 pb-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </motion.div>

          {/* Amenities */}
          <motion.div
            className="border-b border-gray-200 pb-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
              What this place offers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <ApperIcon 
                    name={amenityIcons[amenity] || "Check"} 
                    className="w-5 h-5 text-gray-600" 
                  />
                  <span className="capitalize text-gray-700">
                    {amenity.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <ApperIcon name="Star" className="w-6 h-6 text-yellow-400 fill-current" />
              <h3 className="text-xl font-display font-semibold text-gray-900">
                {property.rating} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.Id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.guestPhoto}
                      alt={review.guestName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{review.guestName}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
</motion.div>
        </div>

        {/* Right Column - Booking Widget and Availability */}
        <div className="lg:col-span-1 space-y-6">
          <AvailabilityCalendar 
            propertyId={property.Id} 
            className="lg:sticky lg:top-6" 
          />
          <BookingWidget property={property} />
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            className="fixed inset-0 bg-black z-50 gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative h-full flex items-center justify-center">
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>

              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
              >
                <ApperIcon name="ChevronLeft" className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
              >
                <ApperIcon name="ChevronRight" className="w-6 h-6" />
              </button>

              <img
                src={property.images[selectedImage]}
                alt={`${property.title} ${selectedImage + 1}`}
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {selectedImage + 1} / {property.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetails;