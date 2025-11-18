import wishlistData from '@/services/mockData/wishlists.json';
import { toast } from 'react-toastify';

class WishlistService {
  constructor() {
    this.wishlists = [...wishlistData];
  }

  // Get all wishlists
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.wishlists];
  }

  // Get wishlist by id
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const wishlist = this.wishlists.find(w => w.Id === parseInt(id));
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }
    return { ...wishlist };
  }

  // Create new wishlist
  async create(wishlistData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.wishlists.map(w => w.Id), 0) + 1;
    const newWishlist = {
      Id: newId,
      name: wishlistData.name,
      description: wishlistData.description || '',
      propertyIds: [],
      isPrivate: wishlistData.isPrivate || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.wishlists.push(newWishlist);
    return { ...newWishlist };
  }

  // Update wishlist
  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.wishlists.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Wishlist not found');
    }
    
    this.wishlists[index] = {
      ...this.wishlists[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.wishlists[index] };
  }

  // Delete wishlist
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.wishlists.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Wishlist not found');
    }
    this.wishlists.splice(index, 1);
    return true;
  }

  // Add property to wishlist
  async addProperty(wishlistId, propertyId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const wishlist = this.wishlists.find(w => w.Id === parseInt(wishlistId));
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }
    
    if (!wishlist.propertyIds.includes(parseInt(propertyId))) {
      wishlist.propertyIds.push(parseInt(propertyId));
      wishlist.updatedAt = new Date().toISOString();
    }
    return { ...wishlist };
  }

  // Remove property from wishlist
  async removeProperty(wishlistId, propertyId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const wishlist = this.wishlists.find(w => w.Id === parseInt(wishlistId));
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }
    
    wishlist.propertyIds = wishlist.propertyIds.filter(id => id !== parseInt(propertyId));
    wishlist.updatedAt = new Date().toISOString();
    return { ...wishlist };
  }

  // Check if property is in any wishlist
  async isPropertyFavorited(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.wishlists.some(wishlist => 
      wishlist.propertyIds.includes(parseInt(propertyId))
    );
  }

  // Get wishlist containing property
  async getWishlistByProperty(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.wishlists.find(wishlist => 
      wishlist.propertyIds.includes(parseInt(propertyId))
    );
  }

  // Get default wishlist (create if doesn't exist)
  async getDefaultWishlist() {
    await new Promise(resolve => setTimeout(resolve, 200));
    let defaultWishlist = this.wishlists.find(w => w.name === 'My Favorites');
    
    if (!defaultWishlist) {
      defaultWishlist = await this.create({
        name: 'My Favorites',
        description: 'My favorite properties',
        isPrivate: true
      });
    }
    
    return defaultWishlist;
  }

  // Share wishlist (generate shareable link)
  async shareWishlist(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const wishlist = this.wishlists.find(w => w.Id === parseInt(id));
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }
    
    // Generate shareable URL
    const shareUrl = `${window.location.origin}/wishlist/shared/${id}`;
    return {
      url: shareUrl,
      title: wishlist.name,
      description: wishlist.description
    };
  }
}

export const wishlistService = new WishlistService();