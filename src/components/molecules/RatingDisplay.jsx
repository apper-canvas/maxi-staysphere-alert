import ApperIcon from "@/components/ApperIcon";

const RatingDisplay = ({ rating, reviewCount, showText = true, size = "sm", showStars = true }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            className={`${iconSizes[size]} text-yellow-400 fill-current`}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <ApperIcon
              name="Star"
              className={`${iconSizes[size]} text-gray-300`}
            />
            <ApperIcon
              name="Star"
              className={`${iconSizes[size]} text-yellow-400 fill-current absolute top-0 left-0`}
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            className={`${iconSizes[size]} text-gray-300`}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      {showStars && (
        <div className="flex items-center">
          {renderStars()}
        </div>
      )}
      {showText && (
        <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
          <span className="font-semibold text-gray-900">{rating}</span>
          {reviewCount > 0 && (
            <span className="text-gray-500">
              ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Component for displaying category ratings
export const CategoryRatingDisplay = ({ ratings, size = "sm" }) => {
  const categories = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'checkin', label: 'Check-in' },
    { key: 'communication', label: 'Communication' },
    { key: 'location', label: 'Location' },
    { key: 'value', label: 'Value' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{label}</span>
          <RatingDisplay 
            rating={ratings[key] || 0} 
            showText={false} 
            size={size}
            showStars={true}
          />
        </div>
      ))}
    </div>
  );
};

export default RatingDisplay;