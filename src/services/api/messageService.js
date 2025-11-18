import messagesData from '@/services/mockData/messages.json';

// Simple delay simulation
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let messages = [...messagesData];

export const messageService = {
  // Get all messages
  async getAll() {
    await delay(300);
    return [...messages];
  },

  // Get messages by booking ID
  async getByBookingId(bookingId) {
    await delay(300);
    const bookingMessages = messages.filter(msg => msg.bookingId === parseInt(bookingId));
    return [...bookingMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  // Create new message
  async create(messageData) {
    await delay(300);
    
    const newMessage = {
      Id: messages.length > 0 ? Math.max(...messages.map(m => m.Id)) + 1 : 1,
      bookingId: messageData.bookingId,
      senderId: messageData.senderId,
      senderType: messageData.senderType, // 'guest' or 'host'
      content: messageData.content,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    messages.push(newMessage);
    return { ...newMessage };
  },

  // Mark messages as read
  async markAsRead(bookingId, userId) {
    await delay(200);
    
    messages = messages.map(message => {
      if (message.bookingId === bookingId && message.senderId !== userId) {
        return { ...message, isRead: true };
      }
      return message;
    });
    
    return true;
  },

  // Get conversations (grouped by booking)
  async getConversations(userId, userType = 'guest') {
    await delay(400);
    
    // Group messages by booking
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const bookingId = message.bookingId;
      if (!conversationMap.has(bookingId)) {
        conversationMap.set(bookingId, []);
      }
      conversationMap.get(bookingId).push(message);
    });

    // Convert to conversation objects
    const conversations = Array.from(conversationMap.entries()).map(([bookingId, msgs]) => {
      const sortedMessages = msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const lastMessage = sortedMessages[0];
      const unreadCount = msgs.filter(msg => !msg.isRead && msg.senderId !== userId).length;
      
      return {
        bookingId: parseInt(bookingId),
        lastMessage,
        unreadCount,
        messageCount: msgs.length,
        updatedAt: lastMessage.createdAt
      };
    });

    // Sort by most recent activity
    return conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
};