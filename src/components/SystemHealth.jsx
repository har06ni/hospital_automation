import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';

const SystemHealth = () => {
    const { systemHealth } = useWorkflow();
    const isHealthy = systemHealth.status === 'Healthy';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isHealthy ? '#22c55e' : '#ef4444',
                boxShadow: isHealthy ? '0 0 8px #22c55e' : '0 0 8px #ef4444'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    System {systemHealth.status}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    Last Sync: {systemHealth.lastSync}
                </span>
            </div>
        </div>
    );
};

export default SystemHealth;
