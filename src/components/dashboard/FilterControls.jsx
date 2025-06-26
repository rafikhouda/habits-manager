import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Filter, Tag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FILTERS = [
    { key: 'all', labelKey: 'all' },
    { key: 'completed', labelKey: 'completed' },
    { key: 'incomplete', labelKey: 'incomplete' }
];

const FilterControls = ({ activeHabitFilter, setHabitFilter, categories, activeCategoryFilter, setCategoryFilter }) => {
    const { t, i18n } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
        >
            <div className="flex gap-2 items-center">
                <Filter className="w-5 h-5 flex-shrink-0" />
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {FILTERS.map(({ key, labelKey }) => (
                        <motion.button
                            key={key}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setHabitFilter(key)}
                            className={`filter-btn ${activeHabitFilter === key ? 'active' : ''}`}
                        >
                            {t(labelKey)}
                        </motion.button>
                    ))}
                </div>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
                 <Tag className="w-5 h-5 flex-shrink-0" />
                 <Select value={activeCategoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder={t('selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allCategories')}</SelectItem>
                        {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {i18n.language === 'ar' ? cat.name : cat.name_en}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </motion.div>
    );
};

export default FilterControls;