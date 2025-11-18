import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FilterChip = ({ label, active = false, onClick, onRemove, removable = false }) => {
  return (
    <motion.div
      className={`filter-chip inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
        active ? 'active text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{label}</span>
      {removable && active && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <ApperIcon name="X" className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};

export default FilterChip;