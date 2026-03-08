import React from 'react';
import { AlertCircle, ChevronDown, CheckCircle2, Siren } from 'lucide-react';

const EscalationTracker = ({ currentStatus }) => {
    const stages = [
        { id: 'Stable', label: 'Advice', color: 'var(--success-color)', icon: <CheckCircle2 size={16} /> },
        { id: 'Warning', label: 'Warning', color: 'var(--warning-color)', icon: <AlertCircle size={16} /> },
        { id: 'Critical', label: 'Emergency', color: 'var(--danger-color)', icon: <Siren size={16} /> }
    ];

    const currentIdx = stages.findIndex(s => s.id === currentStatus);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px' }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Escalation Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                {stages.map((stage, index) => {
                    const isPassed = index <= currentIdx;
                    const isActive = index === currentIdx;

                    return (
                        <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isPassed ? 1 : 0.4 }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: isPassed ? stage.color : '#e2e8f0',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2
                            }}>
                                {stage.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'normal', color: isPassed ? stage.color : 'var(--text-secondary)' }}>
                                    {stage.label}
                                </div>
                                {isActive && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        Current Status
                                    </div>
                                )}
                            </div>
                            {index < stages.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    left: '13px',
                                    top: `${index * 45 + 28}px`,
                                    width: '2px',
                                    height: '17px',
                                    background: (index < currentIdx) ? stages[index + 1].color : '#e2e8f0',
                                    zIndex: 1
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EscalationTracker;
