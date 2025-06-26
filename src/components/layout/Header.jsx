import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Target, Trophy, Bell, BarChart3, Sun, Moon, Menu, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Header = ({ totalPoints, darkMode, setDarkMode, setShowStats, notificationPermission, requestNotificationPermission }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-40 backdrop-blur-lg border-b border-white/20 p-4"
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                    <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                        <Target className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {t('appName')}
                        </h1>
                    </motion.div>
                    <div className="points-badge">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mx-1" />
                        {t('totalPoints', { count: totalPoints })}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    {notificationPermission === 'default' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={requestNotificationPermission} className="btn-secondary flex items-center gap-2">
                            <Bell className="w-4 h-4" /> {t('enableNotifications')}
                        </motion.button>
                    )}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowStats(true)} className="btn-secondary flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> {t('statistics')}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDarkMode(!darkMode)} className="btn-secondary p-3">
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.button>
                </div>

                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"> <Menu className="h-6 w-6" /> </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                            {notificationPermission === 'default' && (
                                <DropdownMenuItem onClick={requestNotificationPermission} className="flex items-center gap-2 cursor-pointer">
                                    <Bell className="w-4 h-4" /> <span>{t('enableNotifications')}</span>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setShowStats(true)} className="flex items-center gap-2 cursor-pointer">
                                <BarChart3 className="w-4 h-4" /> <span>{t('statistics')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-2 cursor-pointer">
                                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                <span>{darkMode ? t('lightMode') : t('darkMode')}</span>
                            </DropdownMenuItem>
                             <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                                    <Languages className="w-4 h-4" />
                                    <span>{t('language')}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;