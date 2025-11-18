import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { availabilityService } from '@/services/api/availabilityService';
import { toast } from 'react-toastify';

const AvailabilityCalendar = ({ 
  propertyId, 
  isEditable = false, 
  selectedDates = [], 
  onDateSelect = () => {},
  className = '' 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('available');

  useEffect(() => {
    if (propertyId) {
      loadAvailability();
    }
  }, [propertyId, currentMonth]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const data = await availabilityService.getByPropertyIdAndDateRange(
        propertyId,
        monthStart.toISOString().split('T')[0],
        monthEnd.toISOString().split('T')[0]
      );
      setAvailability(data);
    } catch (error) {
      console.error('Failed to load availability:', error);
      toast.error('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (date) => {
    if (!isEditable || isBefore(date, new Date())) return;
    
    const dateString = date.toISOString().split('T')[0];
    
    try {
      await availabilityService.updateAvailability(propertyId, [{
        date: dateString,
        status: selectedStatus
      }]);
      
      await loadAvailability();
      onDateSelect(date, selectedStatus);
      toast.success(`Date marked as ${selectedStatus}`);
    } catch (error) {
      console.error('Failed to update availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const getDateStatus = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const availabilityItem = availability.find(item => item.date === dateString);
    return availabilityItem?.status || 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'booked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditable ? 'Manage Availability' : 'Availability Calendar'}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </button>
          <span className="text-lg font-medium min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>

      {/* Status Controls for Editable Calendar */}
      {isEditable && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">Select status to apply when clicking dates:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
              { value: 'unavailable', label: 'Unavailable', color: 'bg-red-100 text-red-800' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedStatus === status.value 
                    ? `${status.color} ring-2 ring-offset-1 ring-gray-400` 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span className="text-gray-600">Booked</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, dayIdx) => {
            const status = getDateStatus(day);
            const isPast = isBefore(day, new Date());
            const isClickable = isEditable && !isPast;
            const isSelected = selectedDates.some(selected => isSameDay(selected, day));

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={!isClickable}
                className={`
                  relative p-2 h-10 text-sm rounded-lg border transition-all
                  ${getStatusColor(status)}
                  ${isPast ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isClickable ? 'hover:scale-105 cursor-pointer' : ''}
                  ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                  ${isToday(day) ? 'font-bold' : ''}
                `}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                <span className="relative z-10">
                  {format(day, 'd')}
                </span>
                {isToday(day) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Instructions for Editable Calendar */}
      {isEditable && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <ApperIcon name="Info" size={16} className="inline mr-2" />
            Click on future dates to mark them as available or unavailable. Past dates cannot be modified.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;