import React, { useState, useEffect } from 'react';

const backgrounds = [
  'bg-daily-1',
  'bg-daily-2',
  'bg-daily-3',
  'bg-daily-4',
  'bg-daily-5',
  'bg-daily-6',
  'bg-daily-7',
];

const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const useDailyBackground = (currentDate) => {
  const [backgroundClass, setBackgroundClass] = useState('');

  useEffect(() => {
    if (!currentDate) return;
    const dayOfYear = getDayOfYear(currentDate);
    const bgIndex = dayOfYear % backgrounds.length;
    setBackgroundClass(backgrounds[bgIndex]);
  }, [currentDate]);

  return backgroundClass;
};