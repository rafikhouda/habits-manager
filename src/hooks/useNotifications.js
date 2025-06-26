import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useNotifications = () => {
    const { toast } = useToast();
    const [notificationPermission, setNotificationPermission] = useState('default');

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const scheduleNotifications = useCallback(() => {
        if (Notification.permission === 'granted') {
            const now = new Date();
            const reminderTime = new Date();
            reminderTime.setHours(9, 0, 0, 0);

            if (reminderTime <= now) {
                reminderTime.setDate(reminderTime.getDate() + 1);
            }

            const timeUntilReminder = reminderTime.getTime() - now.getTime();

            setTimeout(() => {
                new Notification('تذكير العادات اليومية', {
                    body: 'حان وقت مراجعة عاداتك اليومية! 💪',
                    icon: '/vite.svg'
                });

                setInterval(() => {
                    new Notification('تذكير العادات اليومية', {
                        body: 'حان وقت مراجعة عاداتك اليومية! 💪',
                        icon: '/vite.svg'
                    });
                }, 24 * 60 * 60 * 1000);
            }, timeUntilReminder);
        }
    }, []);
    
    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            toast({
                title: "المتصفح لا يدعم الإشعارات",
                variant: "destructive"
            });
            return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === 'granted') {
            toast({
                title: "تم تفعيل الإشعارات! 🔔",
                description: "ستتلقى تذكيرات بعاداتك اليومية",
            });
            scheduleNotifications();
        } else if (permission === 'denied') {
            toast({
                title: "تم رفض الإشعارات",
                description: "يمكنك تفعيلها من إعدادات المتصفح.",
                variant: "destructive"
            });
        }
    };
    
    useEffect(() => {
        scheduleNotifications();
    }, [scheduleNotifications]);


    return { notificationPermission, requestNotificationPermission };
};