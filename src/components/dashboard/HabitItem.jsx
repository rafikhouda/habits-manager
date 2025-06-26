import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';

const HabitItem = ({ habit, onToggle, onEdit, onDelete, index }) => {
    const { t, i18n } = useTranslation();

    const getCategoryName = (category) => {
        if (!category) return t('other');
        return i18n.language === 'ar' ? category.name : category.name_en;
    }

    const categoryStyles = {
        health: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        productivity: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        learning: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        fitness: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        other: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    };
    
    const categoryName = habit.category ? (i18n.language === 'ar' ? habit.category.name : habit.category.name_en) : t('other');
    const categoryStyle = habit.category ? categoryStyles[habit.category.id] || categoryStyles.other : categoryStyles.other;
    

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="habit-card"
        >
            <div className="flex items-center gap-3 sm:gap-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggle(habit.id)}
                    className="flex-shrink-0"
                >
                    {habit.completed ? (
                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                    ) : (
                        <Circle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                    )}
                </motion.button>

                <div className="flex-1 min-w-0">
                    <h3 className={`text-base sm:text-lg font-semibold truncate ${habit.completed ? 'line-through text-gray-500' : ''}`}>
                        {habit.name}
                    </h3>
                    {habit.description && (
                        <p className={`text-xs sm:text-sm truncate ${habit.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                            {habit.description}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyles[habit.category] || categoryStyles.other}`}>
                           {t(habit.category) || t('other')}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1 sm:gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(habit)} className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600">
                        <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onDelete(habit)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default HabitItem;