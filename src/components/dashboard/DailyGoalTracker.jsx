import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSound } from '@/hooks/useSound';

const DailyGoalTracker = ({ completedCount, dailyGoal, onGoalChange }) => {
  const progress = dailyGoal > 0 ? (completedCount / dailyGoal) * 100 : 0;
  const playGoalSound = useSound('/sounds/goal.mp3', 0.7);
  const goalReached = useRef(false);

  useEffect(() => {
    const wasReached = goalReached.current;
    const isReached = completedCount >= dailyGoal && dailyGoal > 0;

    if (isReached && !wasReached) {
      playGoalSound();
    }
    
    goalReached.current = isReached;
  }, [completedCount, dailyGoal, playGoalSound]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="stats-card p-4"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-purple-500" />
          <div>
            <h3 className="font-semibold">الهدف اليومي</h3>
            <p className="text-2xl font-bold">
              {completedCount} / <span className="text-purple-500">{dailyGoal}</span>
            </p>
          </div>
        </div>
        
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-2">
            <Slider
              dir="rtl"
              defaultValue={[dailyGoal]}
              max={20}
              step={1}
              min={1}
              onValueChange={(value) => onGoalChange(value[0])}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyGoalTracker;