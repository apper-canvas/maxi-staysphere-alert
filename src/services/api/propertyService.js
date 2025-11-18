import properties from "@/services/mockData/properties.json";
import hosts from "@/services/mockData/hosts.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    return properties.find(property => property.Id === id) || null;
  },

  async search(filters = {}) {
    await delay(400);
    let filteredProperties = [...properties];

    // Property type filter
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(
        property => property.propertyType === filters.propertyType
      );
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filteredProperties = filteredProperties.filter(property =>
        filters.amenities.every(amenity => 
          property.amenities && property.amenities.includes(amenity)
        )
      );
    }

    // Instant book filter
    if (filters.instantBook) {
      filteredProperties = filteredProperties.filter(
        property => property.instantBook === true
      );
    }

    // Superhost filter
    if (filters.superhost) {
      const superhostIds = hosts
        .filter(host => host.superhost)
        .map(host => host.Id);
      
      filteredProperties = filteredProperties.filter(
        property => superhostIds.includes(property.hostId)
      );
    }

    // Price range filter
    if (filters.priceMin !== undefined) {
      filteredProperties = filteredProperties.filter(
        property => property.pricePerNight >= filters.priceMin
      );
    }

    if (filters.priceMax !== undefined) {
      filteredProperties = filteredProperties.filter(
        property => property.pricePerNight <= filters.priceMax
      );
    }

    // Location filter (existing)
    if (filters.location) {
      filteredProperties = filteredProperties.filter(property =>
        property.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.location.country.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Guests filter (existing)
    if (filters.guests && filters.guests > 0) {
      filteredProperties = filteredProperties.filter(
        property => property.maxGuests >= filters.guests
      );
    }

    return filteredProperties;
  },

  async getPriceRanges() {
    await delay(200);
    const prices = properties.map(p => p.pricePerNight).sort((a, b) => a - b);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const rangeSize = Math.ceil((max - min) / 6);

    const ranges = [];
    for (let i = 0; i < 6; i++) {
      const rangeMin = min + (i * rangeSize);
      const rangeMax = i === 5 ? max : min + ((i + 1) * rangeSize) - 1;
      const count = properties.filter(p => 
        p.pricePerNight >= rangeMin && p.pricePerNight <= rangeMax
      ).length;

      if (count > 0) {
        ranges.push({ min: rangeMin, max: rangeMax, count });
      }
    }

    return ranges;
  },

  async create(propertyData) {
    await delay(400);
    const newProperty = {
      ...propertyData,
      Id: Math.max(...properties.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    properties.push(newProperty);
    return newProperty;
  },

  async update(id, data) {
    await delay(300);
    const index = properties.findIndex(property => property.Id === id);
    if (index === -1) return null;
    
    properties[index] = { ...properties[index], ...data };
    return properties[index];
  },

  async delete(id) {
    await delay(200);
    const index = properties.findIndex(property => property.Id === id);
    if (index === -1) return false;
    
    properties.splice(index, 1);
    return true;
  }
};

export default propertyService;