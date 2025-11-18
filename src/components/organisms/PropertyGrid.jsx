import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { propertyService } from "@/services/api/propertyService";

const PropertyGrid = ({ filters = {}, searchLocation = "" }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await propertyService.getAll();
      
      let filteredProperties = data;

      // Apply location filter
      if (searchLocation) {
        filteredProperties = filteredProperties.filter(property =>
          property.location.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
          property.location.country.toLowerCase().includes(searchLocation.toLowerCase()) ||
          property.title.toLowerCase().includes(searchLocation.toLowerCase())
        );
      }

      // Apply price filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filteredProperties = filteredProperties.filter(property =>
          property.pricePerNight >= min && property.pricePerNight <= max
        );
      }

      // Apply guest filter
      if (filters.guests) {
        filteredProperties = filteredProperties.filter(property =>
          property.maxGuests >= filters.guests
        );
      }

      // Apply property type filter
      if (filters.propertyType && filters.propertyType !== "all") {
        filteredProperties = filteredProperties.filter(property =>
          property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
        );
      }

      // Apply amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        filteredProperties = filteredProperties.filter(property =>
          filters.amenities.every(amenity =>
            property.amenities.includes(amenity)
          )
        );
      }

      // Apply instant book filter
      if (filters.instantBook) {
        filteredProperties = filteredProperties.filter(property => property.instantBook);
      }

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