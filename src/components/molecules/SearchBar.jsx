import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SearchBar = ({ onSearch, className = "" }) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const handleSearch = () => {
    onSearch({
      location,
      checkIn,
      checkOut,
      guests
    });
  };

  const adjustGuests = (delta) => {
    const newGuests = Math.max(1, Math.min(16, guests + delta));
    setGuests(newGuests);
  };

  return (
    <motion.div 
      className={`bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 ${className}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Location */}
        <div className="flex flex-col p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <label className="text-xs font-semibold text-gray-700 mb-1">WHERE</label>
          <input
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-0 outline-none bg-transparent text-sm placeholder-gray-400 font-medium"
          />
        </div>

        {/* Check-in */}
        <div className="flex flex-col p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border-l border-r border-gray-100 md:border-l md:border-r-0">
          <label className="text-xs font-semibold text-gray-700 mb-1">CHECK IN</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border-0 outline-none bg-transparent text-sm font-medium text-gray-600"
          />
        </div>

        {/* Check-out */}
        <div className="flex flex-col p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border-r border-gray-100 md:border-r-0">
          <label className="text-xs font-semibold text-gray-700 mb-1">CHECK OUT</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border-0 outline-none bg-transparent text-sm font-medium text-gray-600"
          />
        </div>

        {/* Guests */}
        <div className="relative flex items-center p-2">
          <div 
            className="flex flex-col flex-1 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => setShowGuestSelector(!showGuestSelector)}
          >
            <label className="text-xs font-semibold text-gray-700 mb-1">WHO</label>
            <span className="text-sm font-medium text-gray-600">
              {guests} guest{guests !== 1 ? 's' : ''}
            </span>
          </div>
          
          <Button
            onClick={handleSearch}
            className="ml-2 p-3 rounded-full"
            size="sm"
          >
            <ApperIcon name="Search" className="w-4 h-4" />
          </Button>

          {showGuestSelector && (
            <motion.div
              className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 min-w-[280px]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Guests</h4>
                  <p className="text-sm text-gray-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustGuests(-1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    disabled={guests === 1}
                  >
                    <ApperIcon name="Minus" className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-gray-900 min-w-[20px] text-center">{guests}</span>
                  <button
                    onClick={() => adjustGuests(1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    disabled={guests === 16}
                  >
                    <ApperIcon name="Plus" className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;