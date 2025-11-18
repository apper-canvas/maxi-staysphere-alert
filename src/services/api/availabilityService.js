import availabilityData from "@/services/mockData/availability.json";

// Simple delay for demo purposes
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const availabilityService = {
  // Get availability for a specific property
  async getByPropertyId(propertyId) {
    await delay(200);
    return availabilityData.filter(item => item.propertyId === propertyId);
  },

  // Get availability for a specific property and date range
  async getByPropertyIdAndDateRange(propertyId, startDate, endDate) {
    await delay(200);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return availabilityData.filter(item => {
      if (item.propertyId !== propertyId) return false;
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  },

  // Update availability for specific dates
  async updateAvailability(propertyId, updates) {
    await delay(300);
    
    updates.forEach(update => {
      const existingIndex = availabilityData.findIndex(
        item => item.propertyId === propertyId && item.date === update.date
      );
      
      if (existingIndex >= 0) {
        availabilityData[existingIndex] = {
          ...availabilityData[existingIndex],
          ...update
        };
      } else {
        availabilityData.push({
          Id: Math.max(...availabilityData.map(item => item.Id), 0) + 1,
          propertyId,
          ...update
        });
      }
    });
    
    return updates;
  },

  // Set multiple dates to same status
  async setDateRangeStatus(propertyId, startDate, endDate, status) {
    await delay(300);
    const updates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      updates.push({
        date: dateString,
        status,
        propertyId
      });
    }
    
    return await this.updateAvailability(propertyId, updates);
  },

  // Check if date range is available
  async isDateRangeAvailable(propertyId, startDate, endDate) {
    await delay(200);
    const availability = await this.getByPropertyIdAndDateRange(propertyId, startDate, endDate);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const dayAvailability = availability.find(item => item.date === dateString);
      
      if (!dayAvailability || dayAvailability.status !== 'available') {
        return false;
      }
    }
    
    return true;
  }
};

export { availabilityService };