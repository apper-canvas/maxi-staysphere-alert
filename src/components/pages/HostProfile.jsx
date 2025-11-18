import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { hostService } from "@/services/api/hostService";
import { propertyService } from "@/services/api/propertyService";
import { reviewService } from "@/services/api/reviewService";
import ApperIcon from "@/components/ApperIcon";
import PropertyCard from "@/components/molecules/PropertyCard";
import RatingDisplay from "@/components/molecules/RatingDisplay";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const HostProfile = () => {
const { id } = useParams();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadHostData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const hostData = await hostService.getById(parseInt(id));
      if (!hostData) {
        throw new Error("Host not found");
      }
      
      setHost(hostData);
      
      // Load host's properties
      const allProperties = await propertyService.getAll();
      const hostProperties = allProperties.filter(property => property.hostId === hostData.Id);
      setProperties(hostProperties);
      
      // Load host reviews (reviews from all their properties)
      const allReviews = await reviewService.getAll();
      const hostReviews = allReviews.filter(review => 
        hostProperties.some(property => property.Id === review.propertyId)
      );
      setReviews(hostReviews.slice(0, 6)); // Show latest 6 reviews
      
    } catch (err) {
      setError(err.message || "Failed to load host information");
      console.error("Error loading host:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Host not found"
        message={error}
        onRetry={loadHostData}
      />
    );
  }

  if (!host) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        Back
      </motion.button>

      {/* Host Header */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={host.photo}
            alt={host.name}
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <h1 className="text-3xl font-display font-bold text-gray-900">
                {host.name}
              </h1>
              {host.superhost && (
                <Badge variant="primary" size="lg">
                  <ApperIcon name="Award" className="w-4 h-4 mr-1" />
                  Superhost
                </Badge>
              )}
              {host.verified && (
                <Badge variant="success" size="lg">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-center">
              <div>
                <div className="text-2xl font-display font-bold text-gray-900">
                  {host.rating}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-gray-900">
                  {host.reviewCount}
                </div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-gray-900">
                  {properties.length}
                </div>
                <div className="text-sm text-gray-600">Listings</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-gray-900">
                  {new Date().getFullYear() - new Date(host.joinedDate).getFullYear()}
                </div>
                <div className="text-sm text-gray-600">Years hosting</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-6 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>Responds within {host.responseTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="MessageCircle" className="w-4 h-4" />
                <span>{host.responseRate}% response rate</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>Joined {new Date(host.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            {host.bio && (
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto md:mx-0">
                {host.bio}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Host Properties */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {host.name}'s listings ({properties.length})
          </h2>
          <Button 
            onClick={() => navigate('/add-property')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Property
          </Button>
        </div>
        
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.Id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            This host doesn't have any active listings at the moment.
          </div>
        )}
      </motion.div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Star" className="w-6 h-6 text-yellow-400 fill-current" />
            <h3 className="text-2xl font-display font-bold text-gray-900">
              {host.rating} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.Id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.guestPhoto}
                    alt={review.guestName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{review.guestName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <RatingDisplay rating={review.rating} showText={false} size="sm" />
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HostProfile;