import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { bookingService } from "@/services/api/bookingService";
import { differenceInDays, format, isAfter, isBefore, startOfDay } from "date-fns";

const BookingWidget = ({ property }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;
  const subtotal = nights * property.pricePerNight;
  const cleaningFee = 50;
  const serviceFee = Math.round(subtotal * 0.14);
  const total = subtotal + cleaningFee + serviceFee;

  const isValidBooking = checkIn && checkOut && nights > 0 && nights <= 28;

  const adjustGuests = (delta) => {
    const newGuests = Math.max(1, Math.min(property.maxGuests, guests + delta));
    setGuests(newGuests);
  };

  const handleReserve = async () => {
    if (!isValidBooking) {
      toast.error("Please select valid check-in and check-out dates");
      return;
    }

    try {
      setLoading(true);
      
      const booking = await bookingService.create({
        propertyId: property.Id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice: total,
        priceBreakdown: {
          nightlyRate: property.pricePerNight,
          nights,
          cleaningFee,
          serviceFee,
          total
        }
      });

      toast.success("Booking confirmed! Check your email for details.", {
        position: "top-center",
        autoClose: 5000,
      });

      // Reset form
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent past dates
  const today = format(new Date(), "yyyy-MM-dd");
  const minCheckOut = checkIn ? format(new Date(new Date(checkIn).getTime() + 86400000), "yyyy-MM-dd") : today;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sticky top-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-bold text-gray-900">
            ${property.pricePerNight}
          </span>
          <span className="text-gray-600">night</span>
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="font-semibold text-gray-900">{property.rating}</span>
          <span className="text-gray-500">({property.reviewCount})</span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-gray-300">
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border-0 outline-none bg-transparent text-sm font-medium text-gray-900"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              min={minCheckOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border-0 outline-none bg-transparent text-sm font-medium text-gray-900"
            />
          </div>
        </div>
        
        <div className="relative border-t border-gray-300 p-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">
            Guests
          </label>
          <button
            onClick={() => setShowGuestSelector(!showGuestSelector)}
            className="w-full text-left text-sm font-medium text-gray-900 flex items-center justify-between"
          >
            <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
            <ApperIcon 
              name={showGuestSelector ? "ChevronUp" : "ChevronDown"} 
              className="w-4 h-4 text-gray-500" 
            />
          </button>

          {showGuestSelector && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-10"
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
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                    disabled={guests === 1}
                  >
                    <ApperIcon name="Minus" className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-gray-900 min-w-[20px] text-center">{guests}</span>
                  <button
                    onClick={() => adjustGuests(1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                    disabled={guests === property.maxGuests}
                  >
                    <ApperIcon name="Plus" className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reserve Button */}
      <Button
        onClick={handleReserve}
        disabled={!isValidBooking || loading}
        className="w-full mb-4 py-4 text-base font-semibold"
        size="lg"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          "Reserve"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500 mb-4">
        You won't be charged yet
      </p>

      {/* Price Breakdown */}
      {isValidBooking && (
        <motion.div
          className="space-y-3 pt-4 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              ${property.pricePerNight} × {nights} night{nights !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-900 font-medium">${subtotal}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Cleaning fee</span>
            <span className="text-gray-900 font-medium">${cleaningFee}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">StaySphere service fee</span>
            <span className="text-gray-900 font-medium">${serviceFee}</span>
          </div>
          
          <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${total}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookingWidget;