import React, { createContext, useContext, useState } from 'react';
const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'System initialization complete.', type: 'info', timestamp: '10:00 AM' },
    ]);
    const addNotification = (message, type = 'info') => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications(prev => [newNotification, ...prev]);
    };
    const clearNotifications = () => {
        setNotifications([]);
    };
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    return (
        <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
