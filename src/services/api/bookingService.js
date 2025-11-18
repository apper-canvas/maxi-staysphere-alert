import bookings from "@/services/mockData/bookings.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingService = {
  async getAll() {
    await delay(300);
    return [...bookings];
  },

  async getById(id) {
    await delay(200);
    return bookings.find(booking => booking.Id === id) || null;
  },

  async getByHostId(hostId) {
    await delay(300);
    return [...bookings.filter(booking => booking.hostId === hostId)];
  },

  async updateStatus(id, status, hostId) {
    await delay(300);
    const index = bookings.findIndex(booking => booking.Id === id);
    if (index === -1) return null;
    
    // Verify host owns this booking
    if (bookings[index].hostId !== hostId) {
      throw new Error('Unauthorized to update this booking');
    }
    
    const oldStatus = bookings[index].status;
    bookings[index] = { 
      ...bookings[index], 
      status, 
      updatedAt: new Date().toISOString() 
    };
    
    // Return booking with old status for notification purposes
    return { ...bookings[index], oldStatus };
  },

  async getGuestInfo(guestId) {
    await delay(200);
    // Mock guest data - in real app would fetch from user service
    const mockGuests = {
      1: { Id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '+1-555-0123', joinedDate: '2023-01-15' },
      2: { Id: 2, name: 'Michael Chen', email: 'michael.chen@email.com', phone: '+1-555-0456', joinedDate: '2023-03-20' },
      3: { Id: 3, name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+1-555-0789', joinedDate: '2023-05-10' },
      4: { Id: 4, name: 'David Wilson', email: 'david.wilson@email.com', phone: '+1-555-0101', joinedDate: '2023-02-28' }
    };
    return mockGuests[guestId] || null;
  },

  async create(bookingData) {
    await delay(500);
    const newBooking = {
      ...bookingData,
      Id: Math.max(...bookings.map(b => b.Id)) + 1,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    return newBooking;
  },

  async update(id, data) {
    await delay(300);
    const index = bookings.findIndex(booking => booking.Id === id);
    if (index === -1) return null;
    
    bookings[index] = { ...bookings[index], ...data };
    return bookings[index];
  },

  async delete(id) {
    await delay(200);
    const index = bookings.findIndex(booking => booking.Id === id);
    if (index === -1) return false;
    
    bookings.splice(index, 1);
    return true;
  }
};