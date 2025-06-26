import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Save, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WEEKDAYS = [
  { id: 1, key: 'Mon' }, { id: 2, key: 'Tue' }, { id: 3, key: 'Wed' }, 
  { id: 4, key: 'Thu' }, { id: 5, key: 'Fri' }, { id: 6, key: 'Sat' }, { id: 0, key: 'Sun' }
];

const HabitForm = ({ habit, onSave, onClose, categories, onAddCategory }) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: habit?.category || categories[0]?.id || 'other',
    repeat: {
      type: 'daily',
      days: [],
      dates: [],
    },
  });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name || '',
        description: habit.description || '',
        category: habit.category || 'other',
        repeat: habit.repeat || { type: 'daily', days: [], dates: [] },
      });
    }
  }, [habit]);

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: t('error'), description: t('nameRequired'), variant: "destructive" });
      return;
    }
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleRepeatChange = (key, value) => {
    setFormData(p => ({ ...p, repeat: { ...p.repeat, [key]: value } }));
  };

  const handleWeeklyDayChange = (dayId) => {
    const currentDays = formData.repeat.days || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(d => d !== dayId)
      : [...currentDays, dayId];
    handleRepeatChange('days', newDays);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{habit ? t('editHabit') : t('addHabitTitle')}</h2>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="p-2 rounded-lg hover:bg-accent">
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('habitName')}</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t('habitNamePlaceholder')} required />
          </div>

          <div>
            <Label htmlFor="description">{t('descriptionOptional')}</Label>
            <Input as="textarea" id="description" name="description" value={formData.description} onChange={handleChange} placeholder={t('descriptionPlaceholder')} rows={3} className="resize-none" />
          </div>

          <div>
            <Label htmlFor="category">{t('category')}</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange({ target: { name: 'category', value }})}>
                <SelectTrigger id="category">
                    <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                            {i18n.language === 'ar' ? cat.name : cat.name_en}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <button type="button" onClick={() => setShowNewCategory(!showNewCategory)} className="text-sm text-primary mt-2 flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> {t('addNewCategory')}
            </button>
            {showNewCategory && (
                <div className="flex gap-2 mt-2">
                    <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder={t('newCategoryName')} />
                    <button type="button" onClick={handleAddNewCategory} className="btn-secondary px-4">{t('save')}</button>
                </div>
            )}
          </div>
          
          <div>
            <Label>{t('frequency')}</Label>
            <RadioGroup defaultValue="daily" value={formData.repeat.type} onValueChange={value => handleRepeatChange('type', value)} className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="daily" id="r-daily" /><Label htmlFor="r-daily">{t('daily')}</Label></div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="weekly" id="r-weekly" /><Label htmlFor="r-weekly">{t('weekly')}</Label></div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="monthly" id="r-monthly" /><Label htmlFor="r-monthly">{t('monthly')}</Label></div>
            </RadioGroup>
          </div>

          {formData.repeat.type === 'weekly' && (
            <div className="space-y-2">
                <Label>{t('daysOfWeek')}</Label>
                <div className="grid grid-cols-4 gap-2">
                    {WEEKDAYS.map(day => (
                        <div key={day.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox id={`d-${day.id}`} checked={formData.repeat.days.includes(day.id)} onCheckedChange={() => handleWeeklyDayChange(day.id)} />
                            <Label htmlFor={`d-${day.id}`}>{t(day.key)}</Label>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {formData.repeat.type === 'monthly' && (
            <div>
                <Label htmlFor="monthly-dates">{t('daysOfMonth')}</Label>
                <Input id="monthly-dates" placeholder={t('daysOfMonthPlaceholder')} 
                    value={(formData.repeat.dates || []).join(', ')}
                    onChange={e => handleRepeatChange('dates', e.target.value.split(',').map(d => parseInt(d.trim())).filter(Boolean))} />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {habit ? t('saveChanges') : t('addHabitBtn')}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={onClose} className="btn-secondary px-6">{t('cancel')}</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HabitForm;