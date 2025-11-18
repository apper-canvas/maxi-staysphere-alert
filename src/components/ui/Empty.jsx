import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No results found", 
  message = "We couldn't find what you're looking for. Try adjusting your search.", 
  actionLabel = "Clear Filters",
  onAction
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[400px] px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name="Search" className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-3">
          {title}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        {onAction && (
          <motion.button
            onClick={onAction}
            className="btn-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;