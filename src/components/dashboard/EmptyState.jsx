import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const EmptyState = ({ onAddHabit, filter }) => {
    const messages = {
        all: {
            title: 'لا توجد عادات بعد',
            text: 'ابدأ رحلتك بإضافة عادة جديدة!',
            showButton: true,
        },
        completed: {
            title: 'لا توجد عادات منجزة',
            text: 'لم تنجز أي عادة بعد اليوم',
            showButton: false,
        },
        incomplete: {
            title: 'رائع! أنجزت جميع عاداتك',
            text: 'لا توجد عادات غير منجزة حالياً.',
            showButton: false,
        }
    };

    const { title, text, showButton } = messages[filter];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
        >
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-500 mb-4">{text}</p>
            {showButton && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddHabit}
                    className="btn-primary"
                >
                    إضافة عادة جديدة
                </motion.button>
            )}
        </motion.div>
    );
};

export default EmptyState;