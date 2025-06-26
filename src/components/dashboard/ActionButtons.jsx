import React from 'react';
import { motion } from 'framer-motion';
import { Plus, RotateCcw, Download, Upload } from 'lucide-react';

const ActionButtons = ({ onAddHabit, onResetDay, onExport, onImport }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3"
        >
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddHabit}
                className="btn-primary flex-grow sm:flex-grow-0 flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                إضافة عادة جديدة
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onResetDay}
                className="btn-secondary flex-grow sm:flex-grow-0 flex items-center justify-center gap-2"
            >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">إعادة تعيين</span>
                <span className="sm:hidden">إعادة</span>
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExport}
                className="btn-secondary flex-grow sm:flex-grow-0 flex items-center justify-center gap-2"
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">تصدير</span>
                <span className="sm:hidden">تصدير</span>
            </motion.button>
            <label className="btn-secondary flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">استيراد</span>
                <span className="sm:hidden">استيراد</span>
                <input
                    type="file"
                    accept=".json"
                    onChange={onImport}
                    className="hidden"
                />
            </label>
        </motion.div>
    );
};

export default ActionButtons;