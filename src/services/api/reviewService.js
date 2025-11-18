import reviews from "@/services/mockData/reviews.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getAll() {
    await delay(300);
    return [...reviews];
  },

  async getById(id) {
    await delay(200);
    return reviews.find(review => review.Id === id) || null;
  },

  async getByPropertyId(propertyId) {
    await delay(250);
    return reviews.filter(review => review.propertyId === propertyId);
  },

  async create(reviewData) {
    await delay(400);
    const newReview = {
      ...reviewData,
      Id: Math.max(...reviews.map(r => r.Id)) + 1,
      date: new Date().toISOString()
    };
    reviews.push(newReview);
    return newReview;
  },

  async update(id, data) {
    await delay(300);
    const index = reviews.findIndex(review => review.Id === id);
    if (index === -1) return null;
    
    reviews[index] = { ...reviews[index], ...data };
    return reviews[index];
  },

  async delete(id) {
    await delay(200);
    const index = reviews.findIndex(review => review.Id === id);
    if (index === -1) return false;
    
    reviews.splice(index, 1);
    return true;
  }
};