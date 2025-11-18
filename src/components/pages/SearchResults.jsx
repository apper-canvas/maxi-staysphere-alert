import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import FilterPanel from "@/components/organisms/FilterPanel";
import FilterChip from "@/components/molecules/FilterChip";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchLocation, setSearchLocation] = useState("");

  // Initialize from URL params
  useEffect(() => {
    const location = searchParams.get("location") || "";
    const guests = searchParams.get("guests");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const propertyType = searchParams.get("propertyType");
    const amenities = searchParams.get("amenities");
    const instantBook = searchParams.get("instantBook");
    const superhost = searchParams.get("superhost");
    
    setSearchLocation(location);
    
    const urlFilters = {};
    if (guests) urlFilters.guests = parseInt(guests);
    if (priceMin && priceMax) urlFilters.priceRange = [parseInt(priceMin), parseInt(priceMax)];
    if (checkIn && checkOut) {
      urlFilters.dates = { checkIn, checkOut };
    }
    
    setFilters(urlFilters);
  }, [searchParams]);

  const handleSearch = (searchData) => {
    const params = new URLSearchParams();
    if (searchData.location) params.set("location", searchData.location);
    if (searchData.checkIn) params.set("checkIn", searchData.checkIn);
    if (searchData.checkOut) params.set("checkOut", searchData.checkOut);
    if (searchData.guests) params.set("guests", searchData.guests.toString());
    
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filter params
    params.delete("priceMin");
params.delete("priceMax");
    params.delete("propertyType");
    params.delete("amenities");
    params.delete("instantBook");
    params.delete("superhost");
    params.delete("propertyType");
    
    // Add new filter params
    if (newFilters.priceRange) {
      params.set("priceMin", newFilters.priceRange[0].toString());
      params.set("priceMax", newFilters.priceRange[1].toString());
    }
    if (newFilters.propertyType && newFilters.propertyType !== "all") {
      params.set("propertyType", newFilters.propertyType);
    }
    if (newFilters.guests) {
      params.set("guests", newFilters.guests.toString());
    }
    
    setSearchParams(params);
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
    handleFiltersChange(newFilters);
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
if (searchParams.get("propertyType")) {
      chips.push({
        key: "propertyType",
        label: searchParams.get("propertyType")
      });
    }

    if (searchParams.get("amenities")) {
      const amenities = searchParams.get("amenities").split(",");
      amenities.forEach(amenity => {
        chips.push({
          key: `amenity-${amenity}`,
          label: amenity.charAt(0).toUpperCase() + amenity.slice(1)
        });
      });
    }

    if (searchParams.get("instantBook") === "true") {
      chips.push({
        key: "instantBook",
        label: "Instant Book"
      });
    }

    if (searchParams.get("superhost") === "true") {
      chips.push({
        key: "superhost",
        label: "Superhost"
      });
    }

    if (searchParams.get("priceMin") || searchParams.get("priceMax")) {
      const min = searchParams.get("priceMin") || "0";
      const max = searchParams.get("priceMax") || "∞";
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
      {/* Search Header */}
      <motion.div
        className="bg-white border-b border-gray-200 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <SearchBar 
            onSearch={handleSearch}
            initialLocation={searchLocation}
            initialGuests={filters.guests}
          />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Results Header */}
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-semibold text-gray-900 mb-2">
                {searchLocation ? `Places to stay in ${searchLocation}` : "Search results"}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {searchParams.get("checkIn") && searchParams.get("checkOut") && (
                  <>
                    <span>
                      {new Date(searchParams.get("checkIn")).toLocaleDateString()} - {new Date(searchParams.get("checkOut")).toLocaleDateString()}
                    </span>
                    <span>•</span>
                  </>
                )}
                {searchParams.get("guests") && (
                  <span>{searchParams.get("guests")} guest{searchParams.get("guests") !== "1" ? "s" : ""}</span>
                )}
              </div>
            </div>
            
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
                  onClick={() => handleFiltersChange({})}
                  className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Results Grid */}
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

export default SearchResults;