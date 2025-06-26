import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HabitItem from './HabitItem';
import EmptyState from './EmptyState';

const HabitList = ({ habits, onToggle, onEdit, onDelete, onAddHabit, filter }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
        >
            <AnimatePresence>
                {habits.length === 0 ? (
                    <EmptyState onAddHabit={onAddHabit} filter={filter} />
                ) : (
                    habits.map((habit, index) => (
                        <HabitItem
                            key={habit.id}
                            habit={habit}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            index={index}
                        />
                    ))
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HabitList;