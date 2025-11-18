import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import PropertyCard from "@/components/molecules/PropertyCard";
import CollectionModal from "@/components/molecules/CollectionModal";
import { wishlistService } from "@/services/api/wishlistService";
import { propertyService } from "@/services/api/propertyService";
import { toast } from "react-toastify";

const WishlistsPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState(null);

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getAll();
      setWishlists(data);
      
      // Auto-select first wishlist if available
      if (data.length > 0 && !selectedWishlist) {
        setSelectedWishlist(data[0]);
        loadWishlistProperties(data[0]);
      }
    } catch (err) {
      setError("Failed to load wishlists");
      console.error('Error loading wishlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistProperties = async (wishlist) => {
    try {
      const allProperties = await propertyService.getAll();
      const wishlistProperties = allProperties.filter(property => 
        wishlist.propertyIds.includes(property.Id)
      );
      setProperties(wishlistProperties);
    } catch (err) {
      console.error('Error loading wishlist properties:', err);
      toast.error("Failed to load properties", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleWishlistSelect = (wishlist) => {
    setSelectedWishlist(wishlist);
    loadWishlistProperties(wishlist);
  };

  const handleCreateWishlist = () => {
    setEditingWishlist(null);
    setShowModal(true);
  };

  const handleEditWishlist = (wishlist) => {
    setEditingWishlist(wishlist);
    setShowModal(true);
  };

  const handleDeleteWishlist = async (wishlistId) => {
    if (!window.confirm("Are you sure you want to delete this wishlist?")) {
      return;
    }

    try {
      await wishlistService.delete(wishlistId);
      await loadWishlists();
      
      if (selectedWishlist?.Id === wishlistId) {
        setSelectedWishlist(null);
        setProperties([]);
      }
      
      toast.success("Wishlist deleted successfully", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to delete wishlist", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error('Error deleting wishlist:', error);
    }
  };

  const handleShareWishlist = async (wishlistId) => {
    try {
      const shareData = await wishlistService.shareWishlist(wishlistId);
      
      if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url,
        });
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Failed to share wishlist", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error('Error sharing wishlist:', error);
    }
  };

  const handleModalSave = async (wishlistData) => {
    try {
      if (editingWishlist) {
        await wishlistService.update(editingWishlist.Id, wishlistData);
        toast.success("Wishlist updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        await wishlistService.create(wishlistData);
        toast.success("Wishlist created successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      }
      
      setShowModal(false);
      setEditingWishlist(null);
      await loadWishlists();
    } catch (error) {
      toast.error("Failed to save wishlist", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error('Error saving wishlist:', error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadWishlists} />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Your Wishlists
            </h1>
            <p className="text-gray-600 mt-1">
              Organize your favorite properties into collections
            </p>
          </div>
          <Button
            onClick={handleCreateWishlist}
            className="btn-primary text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Create Wishlist
          </Button>
        </motion.div>

        {wishlists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ApperIcon name="Heart" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No wishlists yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start organizing your favorite properties by creating your first wishlist.
            </p>
            <Button
              onClick={handleCreateWishlist}
              className="btn-primary text-white px-6 py-3 rounded-lg"
            >
              Create Your First Wishlist
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Wishlist Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <AnimatePresence>
                  {wishlists.map((wishlist, index) => (
                    <motion.div
                      key={wishlist.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                          selectedWishlist?.Id === wishlist.Id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleWishlistSelect(wishlist)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {wishlist.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {wishlist.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-xs text-gray-500">
                                {wishlist.propertyIds.length} properties
                              </span>
                              {!wishlist.isPrivate && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  Public
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditWishlist(wishlist);
                              }}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareWishlist(wishlist.Id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                            >
                              <ApperIcon name="Share" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWishlist(wishlist.Id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              {selectedWishlist ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-display font-bold text-gray-900">
                      {selectedWishlist.name}
                    </h2>
                    {selectedWishlist.description && (
                      <p className="text-gray-600 mt-1">
                        {selectedWishlist.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {properties.length} properties saved
                    </p>
                  </motion.div>

                  {properties.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <ApperIcon name="Home" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No properties saved yet
                      </h3>
                      <p className="text-gray-600">
                        Start adding properties to this wishlist by clicking the heart icon on any property.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      <AnimatePresence>
                        {properties.map((property, index) => (
                          <motion.div
                            key={property.Id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <PropertyCard property={property} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <ApperIcon name="ArrowLeft" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a wishlist
                  </h3>
                  <p className="text-gray-600">
                    Choose a wishlist from the sidebar to view your saved properties.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collection Modal */}
      <AnimatePresence>
        {showModal && (
          <CollectionModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingWishlist(null);
            }}
            onSave={handleModalSave}
            initialData={editingWishlist}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistsPage;