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

  async create(bookingData) {
    await delay(500);
    const newBooking = {
      ...bookingData,
      Id: Math.max(...bookings.map(b => b.Id)) + 1,
      status: "confirmed",
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