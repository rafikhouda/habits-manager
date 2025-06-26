import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Toaster } from '@/components/ui/toaster';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { useHabits } from '@/hooks/useHabits';
import { useDailyBackground } from '@/hooks/useDailyBackground';
import Header from '@/components/layout/Header';
import DateNavigator from '@/components/dashboard/DateNavigator';
import ActionButtons from '@/components/dashboard/ActionButtons';
import FilterControls from '@/components/dashboard/FilterControls';
import HabitList from '@/components/dashboard/HabitList';
import HabitForm from '@/components/HabitForm';
import HabitStats from '@/components/HabitStats';
import ConfirmDialog from '@/components/ConfirmDialog';
import DailyGoalTracker from '@/components/dashboard/DailyGoalTracker';

const defaultCategories = [
    { id: 'health', name: 'صحة', name_en: 'Health' },
    { id: 'fitness', name: 'لياقة بدنية', name_en: 'Fitness' },
    { id: 'productivity', name: 'إنتاجية', name_en: 'Productivity' },
    { id: 'learning', name: 'تعلم', name_en: 'Learning' },
    { id: 'other', name: 'أخرى', name_en: 'Other' },
];

function App() {
    const { t, i18n } = useTranslation();
    const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
    const [dailyGoal, setDailyGoal] = useLocalStorage('dailyGoal', 5);
    const [categories, setCategories] = useLocalStorage('categories', defaultCategories);
    const { notificationPermission, requestNotificationPermission } = useNotifications();
    const {
        habits,
        totalPoints,
        currentDate,
        currentDateHabits,
        addHabit,
        editHabit,
        deleteHabit,
        toggleHabitCompletion,
        navigateDate,
        resetCurrentDay,
        exportData,
        importData,
        formatDateKey,
    } = useHabits();
    
    const [showHabitForm, setShowHabitForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [habitFilter, setHabitFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState(null);
    
    const backgroundClass = useDailyBackground(currentDate);

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [darkMode]);
    
    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.dir();
    }, [i18n, i18n.language]);

    useEffect(() => {
        document.body.className = '';
        if (backgroundClass) {
            document.body.classList.add(backgroundClass);
        }
    }, [backgroundClass]);

    const handleAddHabitClick = () => {
        setEditingHabit(null);
        setShowHabitForm(true);
    };

    const handleEditHabitClick = (habit) => {
        setEditingHabit(habit);
        setShowHabitForm(true);
    };

    const handleDeleteHabitClick = (habit) => {
        setHabitToDelete(habit);
        setShowConfirmDialog(true);
    };

    const handleSaveHabit = (habitData) => {
        if (editingHabit) {
            editHabit(editingHabit.id, habitData);
        } else {
            addHabit(habitData);
        }
        setShowHabitForm(false);
        setEditingHabit(null);
    };

    const confirmDeleteHabit = () => {
        if (habitToDelete) {
            deleteHabit(habitToDelete.id);
        }
        setShowConfirmDialog(false);
        setHabitToDelete(null);
    };

    const filteredHabits = useMemo(() => {
        return currentDateHabits.filter(habit => {
            const habitStatusMatch = habitFilter === 'all' || (habitFilter === 'completed' && habit.completed) || (habitFilter === 'incomplete' && !habit.completed);
            const categoryMatch = categoryFilter === 'all' || habit.category === categoryFilter;
            return habitStatusMatch && categoryMatch;
        });
    }, [currentDateHabits, habitFilter, categoryFilter]);

    const completedCount = useMemo(() => {
        return currentDateHabits.filter(h => h.completed).length;
    }, [currentDateHabits]);

    const completionPercentage = useMemo(() => {
        return currentDateHabits.length > 0 ? Math.round((completedCount / currentDateHabits.length) * 100) : 0;
    }, [completedCount, currentDateHabits]);
    
    const isToday = useMemo(() => formatDateKey(currentDate) === formatDateKey(new Date()), [currentDate, formatDateKey]);

    const addCategory = useCallback((categoryName) => {
        const newCategory = { id: Date.now().toString(), name: categoryName, name_en: categoryName };
        setCategories(prev => [...prev, newCategory]);
    }, [setCategories]);

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>{t('helmetTitle')}</title>
                <meta name="description" content={t('helmetDescription')} />
            </Helmet>

            <Header 
                totalPoints={totalPoints}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                setShowStats={setShowStats}
                notificationPermission={notificationPermission}
                requestNotificationPermission={requestNotificationPermission}
            />

            <main className="max-w-6xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
                <DateNavigator 
                    currentDate={currentDate}
                    navigateDate={navigateDate}
                    completionPercentage={completionPercentage}
                    isToday={isToday}
                />
                <DailyGoalTracker completedCount={completedCount} dailyGoal={dailyGoal} onGoalChange={setDailyGoal} />
                <ActionButtons onAddHabit={handleAddHabitClick} onResetDay={resetCurrentDay} onExport={exportData} onImport={importData} />
                <FilterControls 
                    activeHabitFilter={habitFilter} 
                    setHabitFilter={setHabitFilter}
                    categories={categories}
                    activeCategoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                />
                <HabitList 
                    habits={filteredHabits}
                    onToggle={toggleHabitCompletion}
                    onEdit={handleEditHabitClick}
                    onDelete={handleDeleteHabitClick}
                    onAddHabit={handleAddHabitClick}
                    filter={habitFilter}
                />
            </main>

            <AnimatePresence>
                {showHabitForm && (
                    <HabitForm
                        habit={editingHabit}
                        onSave={handleSaveHabit}
                        onClose={() => setShowHabitForm(false)}
                        categories={categories}
                        onAddCategory={addCategory}
                    />
                )}
                {showStats && ( <HabitStats habits={habits} onClose={() => setShowStats(false)} darkMode={darkMode} /> )}
                {showConfirmDialog && habitToDelete && (
                    <ConfirmDialog
                        title={t('deleteHabitTitle')}
                        message={t('deleteHabitMessage', { habitName: habitToDelete.name })}
                        onConfirm={confirmDeleteHabit}
                        onCancel={() => setShowConfirmDialog(false)}
                    />
                )}
            </AnimatePresence>

            <Toaster />
        </div>
    );
}

export default App;