import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import FilterPanel from "@/components/organisms/FilterPanel";
import FilterChip from "@/components/molecules/FilterChip";
import ApperIcon from "@/components/ApperIcon";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchLocation, setSearchLocation] = useState("");

  // Initialize from URL params
  useEffect(() => {
    const location = searchParams.get("location");
    const guests = searchParams.get("guests");
    const priceMin = searchParams.get("priceMin");
const priceMax = searchParams.get("priceMax");
    const propertyType = searchParams.get("propertyType");
    const amenities = searchParams.get("amenities");
    const instantBook = searchParams.get("instantBook");
    const superhost = searchParams.get("superhost");
    
    if (location) setSearchLocation(location);
    const urlFilters = {};
    if (guests) urlFilters.guests = parseInt(guests);
    if (priceMin && priceMax) urlFilters.priceRange = [parseInt(priceMin), parseInt(priceMax)];
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams();
    if (searchParams.location) params.set("location", searchParams.location);
    if (searchParams.checkIn) params.set("checkIn", searchParams.checkIn);
    if (searchParams.checkOut) params.set("checkOut", searchParams.checkOut);
    if (searchParams.guests) params.set("guests", searchParams.guests.toString());
    
    navigate(`/search?${params.toString()}`);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilter = (filterKey, value = null) => {
    const newFilters = { ...filters };
    if (value && Array.isArray(newFilters[filterKey])) {
      newFilters[filterKey] = newFilters[filterKey].filter(item => item !== value);
      if (newFilters[filterKey].length === 0) delete newFilters[filterKey];
    } else {
      delete newFilters[filterKey];
    }
    setFilters(newFilters);
  };

  const getActiveFilterChips = () => {
    const chips = [];
    
    if (filters.priceRange) {
      chips.push({
        key: "priceRange",
        label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`
      });
    }
    
    if (filters.guests) {
      chips.push({
        key: "guests",
        label: `${filters.guests}+ guests`
      });
    }
    
    if (filters.propertyType && filters.propertyType !== "all") {
      chips.push({
        key: "propertyType",
        label: filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1)
      });
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        chips.push({
          key: "amenities",
          value: amenity,
          label: amenity.charAt(0).toUpperCase() + amenity.slice(1)
        });
      });
    }
    
    if (filters.instantBook) {
chips.push({
        key: "instantBook",
        label: "Instant Book"
      });
    }

    if (propertyType) {
      chips.push({
        key: "propertyType",
        label: propertyType
      });
    }

    if (amenities) {
      const amenityList = amenities.split(",");
      amenityList.forEach(amenity => {
        chips.push({
          key: `amenity-${amenity}`,
          label: amenity.charAt(0).toUpperCase() + amenity.slice(1)
        });
      });
    }

    if (superhost === "true") {
      chips.push({
        key: "superhost",
        label: "Superhost"
      });
    }

    if (priceMin || priceMax) {
      const min = priceMin || "0";
      const max = priceMax || "∞";
      chips.push({
        key: "priceRange",
        label: `$${min} - $${max}`
      });
    }
    
    return chips;
  };

  const activeFilters = getActiveFilterChips();
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-12 lg:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find your perfect stay
          </motion.h1>
          
          <motion.p
            className="text-lg lg:text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover unique places to stay, from cozy apartments to luxurious villas, all around the world.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </motion.div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Filter Bar */}
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              {searchLocation ? `Properties in ${searchLocation}` : "Explore properties"}
            </h2>
            
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="SlidersHorizontal" className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {activeFilters.map((filter, index) => (
                <FilterChip
                  key={`${filter.key}-${filter.value || index}`}
                  label={filter.label}
                  active={true}
                  removable={true}
                  onRemove={() => clearFilter(filter.key, filter.value)}
                />
              ))}
              {activeFilters.length > 1 && (
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Property Grid */}
        <PropertyGrid filters={filters} searchLocation={searchLocation} />
      </div>

      {/* Filter Panel Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;