import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { propertyService } from "@/services/api/propertyService";
import { hostService } from "@/services/api/hostService";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import AvailabilityCalendar from "@/components/molecules/AvailabilityCalendar";
import RatingDisplay, { CategoryRatingDisplay } from "@/components/molecules/RatingDisplay";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import BookingWidget from "@/components/organisms/BookingWidget";
const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [property, setProperty] = useState(null);
  const [host, setHost] = useState(null);
  const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
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
      
      // Calculate average rating from reviews
      if (reviewsData.length > 0) {
        const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setProperty(prev => ({ ...prev, rating: Number(avgRating.toFixed(1)), reviewCount: reviewsData.length }));
      }
      
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ApperIcon name="Star" className="w-6 h-6 text-yellow-400 fill-current" />
                <h3 className="text-xl font-display font-semibold text-gray-900">
                  {property.rating || 0} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Write a Review
              </button>
            </div>

            {/* Overall Rating Breakdown */}
            {reviews.length > 0 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
                <CategoryRatingBreakdown reviews={reviews} />
</div>
            )}

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.Id} className="space-y-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.guestPhoto}
                        alt={review.guestName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{review.guestName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })} • {review.stayDuration}
                        </div>
                      </div>
                    </div>
                    <RatingDisplay 
                      rating={review.rating} 
                      showText={true} 
                      size="sm"
                      reviewCount={0}
                    />
                  </div>
                  
                  {/* Category ratings for this review */}
                  {review.ratings && (
                    <div className="border-t pt-4">
                      <CategoryRatingDisplay ratings={review.ratings} size="xs" />
                    </div>
                  )}
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {reviews.length > 6 && (
              <div className="text-center mt-8">
                <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  Show all {reviews.length} reviews
                </button>
              </div>
            )}

            {/* Review Form Modal */}
            <ReviewFormModal 
              isOpen={showReviewForm}
              onClose={() => setShowReviewForm(false)}
              propertyId={parseInt(id)}
              onReviewSubmitted={() => {
                // Refresh reviews after submission
                window.location.reload();
              }}
            />
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
// Component for displaying overall rating breakdown by category
const CategoryRatingBreakdown = ({ reviews }) => {
  const categories = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'checkin', label: 'Check-in' },
    { key: 'communication', label: 'Communication' },
    { key: 'location', label: 'Location' },
    { key: 'value', label: 'Value' }
  ];

  const calculateCategoryAverage = (categoryKey) => {
    const validRatings = reviews
      .map(review => review.ratings?.[categoryKey])
      .filter(rating => rating !== undefined);
    
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    return (sum / validRatings.length).toFixed(1);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(({ key, label }) => {
        const average = calculateCategoryAverage(key);
        return (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">{label}</span>
            <div className="flex items-center gap-2">
              <RatingDisplay 
                rating={parseFloat(average)} 
                showText={false} 
                size="sm"
                showStars={true}
              />
              <span className="text-sm font-semibold text-gray-900 min-w-[2rem]">
                {average}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Review Form Modal Component
const ReviewFormModal = ({ isOpen, onClose, propertyId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    ratings: {
      cleanliness: 0,
      accuracy: 0,
      checkin: 0,
      communication: 0,
      location: 0,
      value: 0
    },
    comment: '',
    guestName: '',
    guestPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryRatingChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: rating
      }
    }));
    
    // Calculate overall rating as average of category ratings
    const newRatings = { ...formData.ratings, [category]: rating };
    const validRatings = Object.values(newRatings).filter(r => r > 0);
    if (validRatings.length > 0) {
      const avgRating = validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
      setFormData(prev => ({ ...prev, rating: Math.round(avgRating) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guestName.trim() || !formData.comment.trim() || formData.rating === 0) {
      toast.error('Please fill in all required fields and provide a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.create({
        propertyId,
        guestName: formData.guestName,
        guestPhoto: formData.guestPhoto,
        rating: formData.rating,
        ratings: formData.ratings,
        comment: formData.comment,
        stayDuration: "Recent stay"
      });
      
      toast.success('Review submitted successfully!');
      onReviewSubmitted();
      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'checkin', label: 'Check-in' },
    { key: 'communication', label: 'Communication' },
    { key: 'location', label: 'Location' },
    { key: 'value', label: 'Value' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-semibold text-gray-900">Write a Review</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Guest Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Overall Rating Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating: {formData.rating}/5
            </label>
            <RatingDisplay 
              rating={formData.rating} 
              showText={false} 
              size="lg"
            />
          </div>

          {/* Category Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Rate by Category *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">{label}</span>
                  <StarRatingInput
                    rating={formData.ratings[key]}
                    onChange={(rating) => handleCategoryRatingChange(key, rating)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Share your experience..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Interactive Star Rating Input Component
const StarRatingInput = ({ rating, onChange, size = "sm" }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7"
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-colors hover:scale-110 transform"
        >
          <ApperIcon
            name="Star"
            className={`${iconSizes[size]} transition-colors ${
              star <= (hoveredRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default PropertyDetails;