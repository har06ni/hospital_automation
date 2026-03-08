import React, { useState } from 'react';
import { Siren, AlertTriangle, CheckCircle2 } from 'lucide-react';

const EmergencyOverride = ({ onOverride }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onOverride(reason);
        setIsOpen(false);
        setReason('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn"
                style={{
                    background: 'var(--danger-color)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 'bold',
                    padding: '8px 16px'
                }}
            >
                <Siren size={18} /> EMERGENCY OVERRIDE
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ padding: '30px', maxWidth: '400px', background: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger-color)', marginBottom: '15px' }}>
                            <AlertTriangle size={24} />
                            <h3 style={{ margin: 0 }}>Confirm Override</h3>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            This action allows immediate manual intervention and will be logged for audit purposes. Please provide a reason.
                        </p>
                        <textarea
                            placeholder="Reason for override..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={{
                                width: '100%',
                                height: '80px',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                marginBottom: '20px',
                                outline: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn" onClick={() => setIsOpen(false)} style={{ background: '#f1f5f9' }}>Cancel</button>
                            <button className="btn" onClick={handleConfirm} style={{ background: 'var(--danger-color)', color: 'white' }}>Confirm & Log</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmergencyOverride;
