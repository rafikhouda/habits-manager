import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, TrendingUp, Target, Award } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HabitStats = ({ habits, onClose, darkMode }) => {
  const [period, setPeriod] = useState(7); // 7 or 30 days
  const [statsData, setStatsData] = useState({
    dailyCompletion: [],
    habitPerformance: [],
    categoryStats: {},
    totalDays: 0,
    averageCompletion: 0
  });

  useEffect(() => {
    calculateStats();
  }, [habits, period]);

  const calculateStats = () => {
    const today = new Date();
    const dates = [];
    const dailyCompletion = [];
    const habitPerformance = {};
    const categoryStats = {};

    for (let i = period - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    dates.forEach(date => {
      const dateKey = `habits_${date.toISOString().split('T')[0]}`;
      const dayHabits = JSON.parse(localStorage.getItem(dateKey) || '[]');
      
      const completionRate = dayHabits.length > 0 
        ? (dayHabits.filter(h => h.completed).length / dayHabits.length) * 100 
        : 0;
      
      dailyCompletion.push({
        date: date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
        completion: Math.round(completionRate)
      });

      dayHabits.forEach(habit => {
        if (!habitPerformance[habit.name]) {
          habitPerformance[habit.name] = { completed: 0, total: 0, category: habit.category };
        }
        habitPerformance[habit.name].total++;
        if (habit.completed) {
          habitPerformance[habit.name].completed++;
        }
      });

      dayHabits.forEach(habit => {
        if (!categoryStats[habit.category]) {
          categoryStats[habit.category] = { completed: 0, total: 0 };
        }
        categoryStats[habit.category].total++;
        if (habit.completed) {
          categoryStats[habit.category].completed++;
        }
      });
    });

    const averageCompletion = dailyCompletion.length > 0
      ? Math.round(dailyCompletion.reduce((sum, day) => sum + day.completion, 0) / dailyCompletion.length)
      : 0;

    setStatsData({
      dailyCompletion,
      habitPerformance: Object.entries(habitPerformance).map(([name, data]) => ({
        name,
        completion: Math.round((data.completed / data.total) * 100),
        category: data.category
      })),
      categoryStats,
      totalDays: period,
      averageCompletion
    });
  };

  const textColor = darkMode ? 'rgba(230, 230, 230, 0.9)' : 'rgba(55, 65, 81, 0.9)';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: {
            family: 'Cairo'
          }
        }
      },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: textColor,
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
            color: gridColor,
        }
      },
      x: {
        ticks: {
            color: textColor,
        },
        grid: {
            color: gridColor,
        }
      }
    }
  };

  const dailyCompletionChart = {
    labels: statsData.dailyCompletion.map(d => d.date),
    datasets: [
      {
        label: 'معدل الإنجاز اليومي',
        data: statsData.dailyCompletion.map(d => d.completion),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const habitPerformanceChart = {
    labels: statsData.habitPerformance.slice(0, 10).map(h => h.name),
    datasets: [
      {
        label: 'معدل الإنجاز',
        data: statsData.habitPerformance.slice(0, 10).map(h => h.completion),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ]
      }
    ]
  };

  const categoryChart = {
    labels: Object.keys(statsData.categoryStats).map(cat => {
      const categoryNames = {
        health: 'صحة',
        fitness: 'لياقة',
        productivity: 'إنتاجية',
        learning: 'تعلم',
        other: 'أخرى'
      };
      return categoryNames[cat] || cat;
    }),
    datasets: [
      {
        data: Object.values(statsData.categoryStats).map(cat => 
          Math.round((cat.completed / cat.total) * 100)
        ),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ]
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: {
            family: 'Cairo'
          }
        }
      }
    }
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
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            إحصائيات العادات
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex gap-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPeriod(7)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === 7 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            7 أيام
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPeriod(30)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === 30 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            30 يوم
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stats-card text-center"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="text-2xl font-bold">{statsData.totalDays}</h3>
            <p className="text-gray-600 dark:text-gray-400">أيام مراقبة</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stats-card text-center"
          >
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="text-2xl font-bold">{statsData.averageCompletion}%</h3>
            <p className="text-gray-600 dark:text-gray-400">متوسط الإنجاز</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stats-card text-center"
          >
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h3 className="text-2xl font-bold">{habits.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">إجمالي العادات</p>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stats-card"
          >
            <h3 className="text-lg font-semibold mb-4">اتجاه الإنجاز اليومي</h3>
            <div className="h-64">
              <Line data={dailyCompletionChart} options={chartOptions} />
            </div>
          </motion.div>

          {statsData.habitPerformance.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="stats-card"
            >
              <h3 className="text-lg font-semibold mb-4">أداء العادات الفردية</h3>
              <div className="h-64">
                <Bar data={habitPerformanceChart} options={chartOptions} />
              </div>
            </motion.div>
          )}

          {Object.keys(statsData.categoryStats).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="stats-card"
            >
              <h3 className="text-lg font-semibold mb-4">أداء الفئات</h3>
              <div className="h-64 flex justify-center">
                <Doughnut 
                  data={categoryChart} 
                  options={doughnutChartOptions} 
                />
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="stats-card mt-8"
        >
          <h3 className="text-lg font-semibold mb-4">نصائح وملاحظات</h3>
          <div className="space-y-2 text-sm">
            {statsData.averageCompletion >= 80 && (
              <p className="text-green-600 dark:text-green-400">
                🎉 ممتاز! معدل إنجازك عالي جداً. استمر على هذا المنوال!
              </p>
            )}
            {statsData.averageCompletion >= 60 && statsData.averageCompletion < 80 && (
              <p className="text-blue-600 dark:text-blue-400">
                👍 أداء جيد! يمكنك تحسين معدل الإنجاز قليلاً.
              </p>
            )}
            {statsData.averageCompletion < 60 && (
              <p className="text-orange-600 dark:text-orange-400">
                💪 لا تستسلم! حاول التركيز على عادات أقل لتحسين معدل الإنجاز.
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-400">
              💡 نصيحة: ابدأ بعادات صغيرة وسهلة لبناء الزخم والثقة.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HabitStats;