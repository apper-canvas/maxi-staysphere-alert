import properties from "@/services/mockData/properties.json";

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