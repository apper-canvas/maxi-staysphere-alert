import reviews from "@/services/mockData/reviews.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to calculate average rating from reviews
const calculateAverageRating = (propertyReviews) => {
  if (propertyReviews.length === 0) return 0;
  const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / propertyReviews.length).toFixed(1));
};

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

  // Calculate average rating for a property
  async getPropertyRating(propertyId) {
    await delay(100);
    const propertyReviews = reviews.filter(review => review.propertyId === propertyId);
    return {
      averageRating: calculateAverageRating(propertyReviews),
      reviewCount: propertyReviews.length
    };
  },

async create(reviewData) {
    await delay(400);
    const newReview = {
      ...reviewData,
      Id: Math.max(...reviews.map(r => r.Id)) + 1,
      date: new Date().toISOString(),
      // Ensure default values for missing fields
      ratings: reviewData.ratings || {
        cleanliness: reviewData.rating || 5,
        accuracy: reviewData.rating || 5,
        checkin: reviewData.rating || 5,
        communication: reviewData.rating || 5,
        location: reviewData.rating || 5,
        value: reviewData.rating || 5
      }
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