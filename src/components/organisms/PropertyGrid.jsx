import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { propertyService } from "@/services/api/propertyService";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";

const PropertyGrid = ({ filters = {}, searchLocation = "" }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

// Filter properties based on current filters and search location
  const filterProperties = (properties) => {
    return properties.filter(property => {
      // Location filter
      if (searchLocation && searchLocation.trim()) {
        const searchTerm = searchLocation.toLowerCase();
        const matchesLocation = 
          property.location.city.toLowerCase().includes(searchTerm) ||
          property.location.country.toLowerCase().includes(searchTerm) ||
          property.location.address.toLowerCase().includes(searchTerm) ||
          property.title.toLowerCase().includes(searchTerm);
        
        if (!matchesLocation) return false;
      }
      
      // Guest capacity filter
      if (filters.guests && property.maxGuests < filters.guests) {
        return false;
      }
      
      // Price range filter
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (property.pricePerNight < minPrice || property.pricePerNight > maxPrice) {
          return false;
        }
      }
      
      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (property.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) {
          return false;
        }
      }

      // Bedrooms filter
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
        return false;
      }
      
      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      // Instant Book filter
      if (filters.instantBook && !property.instantBook) {
        return false;
      }
      
      return true;
    });
  };
  
// Load properties
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await propertyService.getProperties();
      const allProperties = response?.data || [];
      
      // Apply filters to the properties
      const filteredProperties = filterProperties(allProperties);
      setProperties(filteredProperties);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters, searchLocation]);

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <ErrorView
        title="Unable to load properties"
        message={error}
        onRetry={loadProperties}
      />
    );
  }

  if (properties.length === 0) {
    return (
      <Empty
        title="No properties found"
        message={searchLocation 
          ? `No properties match your search for "${searchLocation}". Try adjusting your filters or search terms.`
          : "No properties match your current filters. Try adjusting your search criteria."
        }
        actionLabel="Clear Filters"
        onAction={() => window.location.href = "/"}
      />
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {properties.map((property, index) => (
        <motion.div
          key={property.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;