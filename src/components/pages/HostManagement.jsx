import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { propertyService } from "@/services/api/propertyService";
import { bookingService } from "@/services/api/bookingService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import AvailabilityCalendar from "@/components/molecules/AvailabilityCalendar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
const HostManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('availability');

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      
      const propertyData = await propertyService.getById(parseInt(id));
      if (!propertyData) {
        throw new Error("Property not found");
      }
      
      setProperty(propertyData);
    } catch (err) {
      console.error("Failed to load property:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date, status) => {
    toast.success(`Date ${date.toLocaleDateString()} marked as ${status}`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} />;
  if (!property) return <ErrorView message="Property not found" />;

  const tabs = [
    { id: 'availability', label: 'Availability Calendar', icon: 'Calendar' },
    { id: 'details', label: 'Property Details', icon: 'Home' },
    { id: 'bookings', label: 'Bookings', icon: 'BookOpen' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Manage Property</h1>
              <p className="text-gray-600 mt-2">{property.title}</p>
            </div>
            <Button
              onClick={() => navigate(`/property/${property.Id}`)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Eye" size={16} />
              <span>View Listing</span>
            </Button>
          </div>
        </div>

        {/* Property Summary Card */}
        <Card className="mb-8 p-6">
          <div className="flex items-start space-x-4">
            <img
              src={property.images?.[0] || '/api/placeholder/120/80'}
              alt={property.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{property.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{property.address}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{property.bedrooms} bed</span>
                <span>{property.bathrooms} bath</span>
                <span>Max {property.maxGuests} guests</span>
                <span className="font-semibold text-primary">${property.pricePerNight}/night</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'availability' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Management</h3>
                <p className="text-gray-600 mb-6">
                  Manage your property's availability calendar. Click on dates to mark them as available or unavailable for bookings.
                </p>
                <AvailabilityCalendar
                  propertyId={property.Id}
                  isEditable={true}
                  onDateSelect={handleDateSelect}
                />
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => {
                      // Quick action to mark next 30 days as available
                      toast.info('This feature will be implemented with bulk date selection');
                    }}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Calendar" size={16} />
                    <span>Mark Next 30 Days Available</span>
                  </Button>
                  <Button
                    onClick={() => {
                      toast.info('This feature will be implemented with date range selection');
                    }}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="CalendarX" size={16} />
                    <span>Block Date Range</span>
                  </Button>
                  <Button
                    onClick={() => {
                      toast.info('This feature will be implemented with availability templates');
                    }}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Copy" size={16} />
                    <span>Copy From Template</span>
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'details' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <p className="text-gray-600">Property details management will be implemented here.</p>
            </Card>
)}

          {activeTab === 'bookings' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Management</h3>
              <p className="text-gray-600">Booking management will be implemented here.</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Booking Requests Management Section
function BookingRequestsSection({ hostId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestInfo, setGuestInfo] = useState({});
  const [processingBookings, setProcessingBookings] = useState(new Set());

  useEffect(() => {
    loadBookings();
  }, [hostId]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const hostBookings = await bookingService.getByHostId(hostId);
      setBookings(hostBookings);
      
      // Load guest information for all bookings
      const guestIds = [...new Set(hostBookings.map(b => b.guestId))];
      const guestData = {};
      
      for (const guestId of guestIds) {
        try {
          const guest = await bookingService.getGuestInfo(guestId);
          if (guest) {
            guestData[guestId] = guest;
          }
        } catch (err) {
          console.warn(`Failed to load guest info for ID ${guestId}`);
        }
      }
      
      setGuestInfo(guestData);
    } catch (err) {
      setError('Failed to load booking requests. Please try again.');
      toast.error('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const booking = bookings.find(b => b.Id === bookingId);
    if (!booking) return;

    const guest = guestInfo[booking.guestId];
    const statusText = newStatus === 'confirmed' ? 'approve' : 'decline';
    
    if (!confirm(`Are you sure you want to ${statusText} this booking request?`)) {
      return;
    }

    setProcessingBookings(prev => new Set([...prev, bookingId]));

    try {
      // Update booking status
      const updatedBooking = await bookingService.updateStatus(bookingId, newStatus, hostId);
      
      // Update local state
      setBookings(prev => prev.map(b => 
        b.Id === bookingId ? { ...b, status: newStatus } : b
      ));

      // Send notification
      try {
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        await apperClient.functions.invoke(import.meta.env.VITE_BOOKING_NOTIFICATION, {
          body: JSON.stringify({
            bookingId,
            guestEmail: guest?.email || 'guest@example.com',
            guestName: guest?.name || 'Guest',
            status: newStatus,
            propertyName: booking.propertyName || 'Property',
            hostName: 'Host'
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (notificationError) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_BOOKING_NOTIFICATION}. The error is: ${notificationError.message}`);
        // Don't fail the whole operation if notification fails
      }

      const actionText = newStatus === 'confirmed' ? 'approved' : 'declined';
      toast.success(`Booking request ${actionText} successfully`);
      
    } catch (err) {
      toast.error(`Failed to ${statusText} booking request. Please try again.`);
      console.error('Booking status update failed:', err);
    } finally {
      setProcessingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView title="Loading Error" message={error} onRetry={loadBookings} />;

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const otherBookings = bookings.filter(b => b.status !== 'pending');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Booking Requests</h3>
            <p className="text-gray-600 mt-1">
              Manage your property booking requests and communicate with guests
            </p>
          </div>
          <Button
            onClick={loadBookings}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Refresh
          </Button>
        </div>

        {/* Pending Requests */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Clock" size={18} className="text-orange-500" />
              Pending Requests ({pendingBookings.length})
            </h4>
            <div className="grid gap-4">
              {pendingBookings.map((booking) => (
                <BookingRequestCard
                  key={booking.Id}
                  booking={booking}
                  guest={guestInfo[booking.guestId]}
                  onStatusUpdate={handleStatusUpdate}
                  isProcessing={processingBookings.has(booking.Id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Bookings */}
        {otherBookings.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="List" size={18} className="text-blue-500" />
              All Bookings ({otherBookings.length})
            </h4>
            <div className="grid gap-4">
              {otherBookings.map((booking) => (
                <BookingRequestCard
                  key={booking.Id}
                  booking={booking}
                  guest={guestInfo[booking.guestId]}
                  onStatusUpdate={handleStatusUpdate}
                  isProcessing={processingBookings.has(booking.Id)}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="BookOpen" size={48} className="text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Booking Requests</h4>
            <p className="text-gray-500">
              When guests make booking requests for your properties, they'll appear here.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

// Individual Booking Request Card Component
function BookingRequestCard({ booking, guest, onStatusUpdate, isProcessing, showActions = true }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-orange-100 text-orange-800', icon: 'Clock' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
      declined: { color: 'bg-red-100 text-red-800', icon: 'XCircle' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: 'Ban' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <ApperIcon name={config.icon} size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Booking Information */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-1">
                Booking #{booking.Id}
              </h5>
              <p className="text-gray-600">
                Property: {booking.propertyName || 'Property Name'}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Check-in</p>
              <p className="font-medium text-gray-900">
                {formatDate(booking.checkIn)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Check-out</p>
              <p className="font-medium text-gray-900">
                {formatDate(booking.checkOut)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Guests</p>
              <p className="font-medium text-gray-900">
                {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">
              ${booking.totalPrice?.toLocaleString() || booking.priceBreakdown?.total?.toLocaleString() || 'N/A'}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <p>Requested: {formatDate(booking.createdAt)}</p>
          </div>
        </div>

        {/* Guest Information */}
        <div className="lg:w-80">
          <h6 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <ApperIcon name="User" size={14} />
            Guest Information
          </h6>
          
          {guest ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {guest.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{guest.name}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(guest.joinedDate).getFullYear()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Mail" size={14} className="text-gray-400" />
                  <span className="text-gray-600">{guest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Phone" size={14} className="text-gray-400" />
                  <span className="text-gray-600">{guest.phone}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <ApperIcon name="UserX" size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Guest information unavailable</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && booking.status === 'pending' && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button
            onClick={() => onStatusUpdate(booking.Id, 'declined')}
            disabled={isProcessing}
            className="flex-1 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
          >
            {isProcessing ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <ApperIcon name="X" size={16} className="mr-2" />
                Decline
              </>
            )}
          </Button>
          <Button
            onClick={() => onStatusUpdate(booking.Id, 'confirmed')}
            disabled={isProcessing}
            className="flex-1 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
          >
            {isProcessing ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <ApperIcon name="Check" size={16} className="mr-2" />
                Approve
              </>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// Properties Section Component (existing - keeping for context)
function PropertiesSection({ hostId }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, [hostId]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAll();
      // Filter properties by host (in real app, this would be done on backend)
      const hostProperties = data.filter(property => property.hostId === hostId);
      setProperties(hostProperties);
    } catch (err) {
      setError('Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView title="Loading Error" message={error} onRetry={loadProperties} />;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Properties</h3>
          <p className="text-gray-600">Manage your listed properties</p>
        </div>
        <Button
          onClick={() => navigate('/add-property')}
          className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Property
        </Button>
      </div>

      {properties.length > 0 ? (
        <div className="grid gap-4">
          {properties.map((property) => (
            <div key={property.Id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={property.images?.[0] || '/placeholder-property.jpg'}
                alt={property.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{property.title}</h4>
                <p className="text-gray-600">{property.location}</p>
                <p className="text-primary font-semibold">${property.price}/night</p>
              </div>
              <Button
                onClick={() => navigate(`/property/${property.Id}`)}
                className="bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
              >
                View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ApperIcon name="Home" size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Properties Listed</h4>
          <p className="text-gray-500 mb-4">
            Start earning by listing your first property on StaySphere.
          </p>
          <Button
            onClick={() => navigate('/add-property')}
            className="bg-gradient-to-r from-primary to-accent text-white"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            List Your First Property
          </Button>
        </div>
      )}
    </Card>
  );
}

// Availability Section Component (existing - keeping for context)
function AvailabilitySection({ hostId }) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability Calendar</h3>
        <p className="text-gray-600">Manage your property availability and pricing</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <AvailabilityCalendar />
      </div>
      
      <div className="mt-6 flex gap-4">
        <Button className="bg-gradient-to-r from-primary to-accent text-white">
          <ApperIcon name="Calendar" size={16} className="mr-2" />
          Update Availability
        </Button>
        <Button className="bg-white border border-gray-200 text-gray-700 hover:border-gray-300">
          <ApperIcon name="DollarSign" size={16} className="mr-2" />
          Adjust Pricing
        </Button>
      </div>
    </Card>
  );
}

export default HostManagement;