import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
const NotificationCenter = () => {
    const { notifications, removeNotification, clearNotifications } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
    const getIconColor = (type) => {
        switch (type) {
            case 'danger': return 'var(--danger-color)';
            case 'warning': return 'var(--warning-color)';
            case 'success': return 'var(--success-color)';
            default: return 'var(--primary-color)';
        }
    };
    return (
        <div style={{ position: 'relative' }}>
            <div
                onClick={toggleOpen}
                style={{ position: 'relative', cursor: 'pointer' }}
            >
                <Bell size={24} color="var(--text-secondary)" />
                {notifications.length > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'var(--danger-color)',
                        color: 'white',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {notifications.length}
                    </span>
                )}
            </div>
            {isOpen && (
                <>
                    <div
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="glass-panel" style={{
                        position: 'absolute',
                        top: '45px',
                        right: '0',
                        width: '320px',
                        zIndex: 9999, // Ensure it's above everything
                        background: '#ffffff', // Solid background to prevent transparency clash
                        border: '1px solid #e2e8f0', // distinct border
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Stronger shadow
                        padding: 0,
                        overflow: 'hidden',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>Notifications</h4>
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearNotifications}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    No new notifications.
                                </div>
                            ) : (
                                notifications.map(note => (
                                    <div key={note.id} style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                                        <div style={{
                                            minWidth: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            marginTop: '6px',
                                            background: getIconColor(note.type)
                                        }}></div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{note.message}</p>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{note.timestamp}</span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeNotification(note.id); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default NotificationCenter;
