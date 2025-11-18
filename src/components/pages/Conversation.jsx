import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { messageService } from '@/services/api/messageService';
import { bookingService } from '@/services/api/bookingService';
import { propertyService } from '@/services/api/propertyService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import { toast } from 'react-toastify';

function Conversation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [booking, setBooking] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Mock current user - in real app this would come from auth context
  const currentUser = { id: 'guest_001', type: 'guest' };

  useEffect(() => {
    loadConversation();
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadConversation() {
    try {
      setLoading(true);
      setError(null);

      const [messagesData, bookingData] = await Promise.all([
        messageService.getByBookingId(bookingId),
        bookingService.getById(parseInt(bookingId))
      ]);

      setMessages(messagesData);
      setBooking(bookingData);

      if (bookingData) {
        const propertyData = await propertyService.getById(bookingData.propertyId);
        setProperty(propertyData);
      }

      // Mark messages as read
      await messageService.markAsRead(parseInt(bookingId), currentUser.id);
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError('Failed to load conversation');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      
      const messageData = {
        bookingId: parseInt(bookingId),
        senderId: currentUser.id,
        senderType: currentUser.type,
        content: newMessage.trim()
      };

      const sentMessage = await messageService.create(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      toast.success('Message sent!');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      });
    } else {
      return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  }

  function isCurrentUser(senderId) {
    return senderId === currentUser.id;
  }

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadConversation} />;
  if (!booking) return <ErrorView message="Booking not found" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 p-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/messages')}
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            
            <div className="flex-1">
              <h1 className="font-semibold text-gray-800">
                {property?.title || `Booking #${bookingId}`}
              </h1>
              <p className="text-sm text-gray-500">
                {property?.location} • {booking.status === 'confirmed' ? (
                  <Badge variant="success" className="text-xs">Confirmed</Badge>
                ) : (
                  <Badge variant="warning" className="text-xs">Pending</Badge>
                )}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => {
              const isOwn = isCurrentUser(message.senderId);
              
              return (
                <motion.div
                  key={message.Id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-end space-x-2 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isOwn ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        <ApperIcon 
                          name={message.senderType === 'guest' ? 'User' : 'Home'} 
                          size={16} 
                          className="text-white" 
                        />
                      </div>
                      
                      <div className={`px-4 py-2 rounded-2xl ${
                        isOwn 
                          ? 'bg-primary text-white rounded-br-md' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwn ? 'text-pink-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-t border-gray-200 p-4"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="p-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                  className="resize-none"
                />
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                size="sm"
                className="flex-shrink-0"
              >
                {sending ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <ApperIcon name="Send" size={16} />
                )}
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

export default Conversation;