import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DateNavigator = ({ currentDate, navigateDate, completionPercentage, isToday }) => {
    const longFormat = currentDate.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const shortFormat = currentDate.toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stats-card"
        >
            <div className="flex items-center justify-between mb-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateDate(-1)}
                    className="btn-secondary p-2 sm:p-3 rounded-full"
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
                <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 justify-center">
                        <Calendar className="w-5 h-5" />
                        <span className="hidden sm:inline">{longFormat}</span>
                        <span className="sm:hidden">{shortFormat}</span>
                    </h2>
                    {isToday && (
                        <span className="text-sm text-purple-500 font-medium">اليوم</span>
                    )}
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateDate(1)}
                    className="btn-secondary p-2 sm:p-3 rounded-full"
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>التقدم اليومي</span>
                    <span>{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default DateNavigator;