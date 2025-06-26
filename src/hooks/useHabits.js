import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { useSound } from './useSound';
import { useTranslation } from 'react-i18next';
import { isSameDay, getDay, getDate } from 'date-fns';

const formatDateKey = (date) => date.toISOString().split('T')[0];

const isHabitActiveOnDate = (habit, date) => {
    const { repeat } = habit;
    if (!repeat || !repeat.type || repeat.type === 'daily') {
        return true; 
    }

    const dayOfWeek = getDay(date); 
    const dayOfMonth = getDate(date);

    switch (repeat.type) {
        case 'weekly':
            return repeat.days.includes(dayOfWeek);
        case 'monthly':
            return repeat.dates.includes(dayOfMonth);
        default:
            return true;
    }
};

export const useHabits = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [habits, setHabits] = useLocalStorage('habits', []);
    const [totalPoints, setTotalPoints] = useLocalStorage('totalPoints', 0);
    const [currentDate, setCurrentDate] = useState(new Date());

    const playAddSound = useSound('/sounds/add.mp3', 0.5);
    const playDeleteSound = useSound('/sounds/delete.mp3', 0.5);
    const playCompleteSound = useSound('/sounds/complete.mp3', 0.7);

    const getHabitsForDate = useCallback((date, masterHabits) => {
        const dateKey = formatDateKey(date);
        const dayData = JSON.parse(localStorage.getItem(dateKey) || '{}');
        
        return masterHabits
            .filter(habit => isHabitActiveOnDate(habit, date))
            .map(habit => ({
                ...habit,
                completed: dayData[habit.id]?.completed || false,
            }));
    }, []);

    const [currentDateHabits, setCurrentDateHabits] = useState(() => getHabitsForDate(new Date(), habits));

    useEffect(() => {
        setCurrentDateHabits(getHabitsForDate(currentDate, habits));
    }, [currentDate, habits, getHabitsForDate]);

    const addHabit = (habitData) => {
        const newHabit = { id: Date.now(), ...habitData, createdAt: new Date().toISOString() };
        setHabits(prev => [...prev, newHabit]);
        playAddSound();
        toast({ title: t('habitAddedSuccess'), description: t('habitAddedDesc', { habitName: habitData.name }) });
    };
    
    const editHabit = (habitId, habitData) => {
        setHabits(habits.map(h => (h.id === habitId ? { ...h, ...habitData } : h)));
        toast({ title: t('habitUpdatedSuccess'), description: t('habitUpdatedDesc', { habitName: habitData.name }) });
    };

    const deleteHabit = (habitId) => {
        setHabits(habits.filter(h => h.id !== habitId));
        playDeleteSound();
        toast({ title: t('habitDeleted'), description: t('habitDeletedDesc') });
    };

    const toggleHabitCompletion = (habitId) => {
        const dateKey = formatDateKey(currentDate);
        const dayData = JSON.parse(localStorage.getItem(dateKey) || '{}');
        const habit = currentDateHabits.find(h => h.id === habitId);
        
        const isCompleted = dayData[habitId]?.completed || false;
        dayData[habitId] = { completed: !isCompleted };
        localStorage.setItem(dateKey, JSON.stringify(dayData));

        setCurrentDateHabits(habits => habits.map(h => h.id === habitId ? { ...h, completed: !isCompleted } : h));

        if (!isCompleted) {
            setTotalPoints(p => p + 1);
            playCompleteSound();
            toast({ title: t('goodJob'), description: t('newPoint') });
        } else {
            setTotalPoints(p => Math.max(0, p - 1));
        }
    };
    
    const navigateDate = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        if (isSameDay(newDate, new Date()) && direction > 0) {
            setCurrentDate(new Date());
        } else {
            setCurrentDate(newDate);
        }
    };

    const resetCurrentDay = () => {
        const dateKey = formatDateKey(currentDate);
        const completedHabits = currentDateHabits.filter(h => h.completed);
        
        localStorage.setItem(dateKey, '{}');
        setCurrentDateHabits(habits => habits.map(h => ({ ...h, completed: false })));
        
        setTotalPoints(p => Math.max(0, p - completedHabits.length));
        toast({ title: t('dayReset'), description: t('dayResetDesc') });
    };

    const exportData = () => {
        const allData = { habits, totalPoints, exportDate: new Date().toISOString() };
        const habitData = {};
        Object.keys(localStorage).filter(k => k.match(/^(\d{4}-\d{2}-\d{2})$/)).forEach(k => {
            habitData[k] = JSON.parse(localStorage.getItem(k));
        });
        allData.habitData = habitData;
        allData.dailyGoal = JSON.parse(localStorage.getItem('dailyGoal') || '5');
        allData.categories = JSON.parse(localStorage.getItem('categories') || '[]');

        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `habit-tracker-backup-${formatDateKey(new Date())}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast({ title: t('dataExported'), description: t('dataExportedDesc') });
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.habits) setHabits(data.habits);
                if (data.totalPoints) setTotalPoints(data.totalPoints);
                if (data.habitData) {
                    Object.keys(data.habitData).forEach(key => {
                        localStorage.setItem(key, JSON.stringify(data.habitData[key]));
                    });
                }
                if (data.dailyGoal) localStorage.setItem('dailyGoal', JSON.stringify(data.dailyGoal));
                if (data.categories) localStorage.setItem('categories', JSON.stringify(data.categories));
                
                setCurrentDate(new Date()); 
                window.location.reload();
            } catch (error) {
                toast({ title: t('dataImportError'), variant: "destructive" });
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return { habits, totalPoints, currentDate, currentDateHabits, addHabit, editHabit, deleteHabit, toggleHabitCompletion, navigateDate, resetCurrentDay, exportData, importData, formatDateKey };
};