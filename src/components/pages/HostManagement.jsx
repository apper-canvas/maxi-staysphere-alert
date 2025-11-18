import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import AvailabilityCalendar from '@/components/molecules/AvailabilityCalendar';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { propertyService } from '@/services/api/propertyService';
import { toast } from 'react-toastify';

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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Management</h3>
              <p className="text-gray-600">Bookings management interface will be implemented here.</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HostManagement;