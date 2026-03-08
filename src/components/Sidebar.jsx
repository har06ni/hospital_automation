import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    User, Stethoscope, ShieldCheck, Pill, Calendar,
    Activity, CheckSquare, Settings, FileText,
    LogOut, LayoutDashboard, Search, GitMerge
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = {
        nurse: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/nurse' },
            { icon: <Search size={20} />, label: 'Medicine Finder', path: '/search' },
        ],
        doctor: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/doctor' },
            { icon: <Search size={20} />, label: 'Medicine Finder', path: '/search' },
        ],
        admin: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
            { icon: <GitMerge size={20} />, label: 'Workflows', path: '/admin/workflows' },
            { icon: <Search size={20} />, label: 'Medicine Finder', path: '/search' },
        ],
        patient: [
            { icon: <Calendar size={20} />, label: 'Appointments', path: '/appointments' },
            { icon: <Search size={20} />, label: 'Medicine Finder', path: '/search' },
        ]
    };

    const currentItems = menuItems[role] || [];

    return (
        <div className="glass-panel" style={{
            width: '240px',
            height: 'calc(100vh - 40px)',
            margin: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            position: 'sticky',
            top: '20px'
        }}>
            <div style={{ padding: '10px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '5px' }}>🏥</div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-color)' }}>Hospital Automate</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{role} Portal</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {currentItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 15px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            background: location.pathname === item.path ? 'var(--primary-color)' : 'transparent',
                            color: location.pathname === item.path ? 'white' : 'var(--text-primary)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {item.icon}
                        <span style={{ fontWeight: '500' }}>{item.label}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => navigate('/')}
                className="btn"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 15px',
                    borderRadius: '12px',
                    background: '#fee2e2',
                    color: 'var(--danger-color)',
                    width: '100%'
                }}
            >
                <LogOut size={20} />
                <span style={{ fontWeight: '600' }}>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
