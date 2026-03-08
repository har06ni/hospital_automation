import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext();
export const useWorkflow = () => useContext(WorkflowContext);

export const WorkflowProvider = ({ children }) => {
    const [workflowLogs, setWorkflowLogs] = useState([]);
    const [systemHealth, setSystemHealth] = useState({
        status: 'Healthy',
        lastSync: new Date().toLocaleTimeString(),
        online: true
    });

    const logAction = (action, user, target) => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            action,
            user,
            target
        };
        setWorkflowLogs(prev => [newLog, ...prev]);
    };

    const [performanceData, setPerformanceData] = useState({
        avgResponseTime: '12 min',
        taskCompletionRate: '94%',
        alertsToday: 24
    });

    return (
        <WorkflowContext.Provider value={{
            workflowLogs,
            logAction,
            systemHealth,
            performanceData
        }}>
            {children}
        </WorkflowContext.Provider>
    );
};
