import React, { createContext, useContext, useState } from 'react';
const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);
export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([
        { id: 101, title: 'Routine Ward Check', priority: 'Medium', deadline: '30 min', completed: false, type: 'Routine' },
    ]);
    const addTask = (task) => {
        setTasks(prev => [task, ...prev]);
    };
    const completeTask = (taskId) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    };
    return (
        <TaskContext.Provider value={{ tasks, addTask, completeTask }}>
            {children}
        </TaskContext.Provider>
    );
};
