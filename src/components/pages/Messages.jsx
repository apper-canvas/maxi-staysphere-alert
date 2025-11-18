import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { messageService } from '@/services/api/messageService';
import { bookingService } from '@/services/api/bookingService';
import { propertyService } from '@/services/api/propertyService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import { toast } from 'react-toastify';

function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock current user - in real app this would come from auth context
  const currentUser = { id: 'guest_001', type: 'guest' };

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      setLoading(true);
      setError(null);

      const [conversationsData, bookingsData, propertiesData] = await Promise.all([
        messageService.getConversations(currentUser.id, currentUser.type),
        bookingService.getAll(),
        propertyService.getAll()
      ]);

      setConversations(conversationsData);
      setBookings(bookingsData);
      setProperties(propertiesData);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  function getBookingInfo(bookingId) {
    return bookings.find(b => b.Id === bookingId);
  }

  function getPropertyInfo(propertyId) {
    return properties.find(p => p.Id === propertyId);
  }

  function formatLastMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  function truncateMessage(content, maxLength = 60) {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true;
    
    const booking = getBookingInfo(conversation.bookingId);
    const property = booking ? getPropertyInfo(booking.propertyId) : null;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      conversation.lastMessage?.content?.toLowerCase().includes(searchLower) ||
      property?.title?.toLowerCase().includes(searchLower) ||
      property?.location?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadConversations} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
            Messages
          </h1>
          <p className="text-gray-600">
            Stay connected with your hosts and guests
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <ApperIcon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <Empty
            title="No conversations found"
            message={searchTerm ? "Try adjusting your search terms" : "Start a conversation by booking a property"}
            icon="MessageCircle"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredConversations.map((conversation, index) => {
              const booking = getBookingInfo(conversation.bookingId);
              const property = booking ? getPropertyInfo(booking.propertyId) : null;

              return (
                <motion.div
                  key={conversation.bookingId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="p-0 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/messages/${conversation.bookingId}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="MessageCircle" size={20} className="text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 truncate">
                                {property?.title || `Booking #${conversation.bookingId}`}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {property?.location || 'Unknown location'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {conversation.unreadCount > 0 && (
                                <Badge variant="primary" className="text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-400">
                                {formatLastMessageTime(conversation.lastMessage.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            {truncateMessage(conversation.lastMessage.content)}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-400">
                              {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
                            </span>
                            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Messages;