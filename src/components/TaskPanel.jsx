import React from 'react';
import { useTasks } from '../context/TaskContext';
import { usePatients } from '../context/PatientContext';
import { CheckSquare, AlertOctagon } from 'lucide-react';

const TaskPanel = () => {
    const { tasks, completeTask } = useTasks();
    const { recordStaffResponse } = usePatients();

    const handleComplete = (task) => {
        if (task.generatedAt && task.patientId) {
            const responseTime = new Date().getTime() - task.generatedAt;
            recordStaffResponse(task.patientId, task.title, responseTime);
        }
        completeTask(task.id);
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={20} /> System Tasks
            </h3>

            {tasks.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No active tasks.</p>
            ) : (
                tasks.filter(t => !t.completed).map(task => (
                    <div
                        key={task.id}
                        style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '10px',
                            borderLeft: `4px solid ${task.priority === 'High' ? 'var(--danger-color)' : 'var(--success-color)'}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{task.type}</span>
                            <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px' }}>{task.deadline}</span>
                        </div>

                        <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>{task.title}</p>

                        <button
                            className="btn"
                            onClick={() => handleComplete(task)}
                            style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#ecfdf5', color: 'var(--success-color)', width: '100%' }}
                        >
                            Mark Completed
                        </button>
                    </div>
                ))
            )}
            {tasks.some(t => t.completed) && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)' }}>Completed</h4>
                    {tasks.filter(t => t.completed).map(task => (
                        <div key={task.id} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px', textDecoration: 'line-through' }}>
                            {task.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default TaskPanel;
