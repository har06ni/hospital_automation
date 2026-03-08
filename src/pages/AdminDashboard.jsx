import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { ShieldCheck, Settings, Users, Activity, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const { workflowLogs, performanceData, systemHealth } = useWorkflow();
    const [activeTab, setActiveTab] = useState('wards');

    const wards = [
        { id: 1, name: 'ICU-1', total: 20, occupied: 18, available: 2 },
        { id: 2, name: 'General Ward A', total: 40, occupied: 35, available: 5 },
        { id: 3, name: 'Emergency', total: 10, occupied: 8, available: 2 },
    ];

    const rules = [
        { id: 1, name: 'Oxygen Critical', condition: 'SpO2 < 92%', action: 'Status -> Critical, Alert Doctor', active: true },
        { id: 2, name: 'BP High Spike', condition: 'Sys > 160 or Dia > 100', action: 'Task -> Administer Meds', active: true },
        { id: 3, name: 'Heart Rate Warning', condition: 'HR > 120 or HR < 50', action: 'Status -> Warning', active: true },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Hospital Admin Control</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="glass-panel" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={18} color="var(--success-color)" />
                        <span style={{ fontWeight: '600' }}>{performanceData.taskCompletionRate} Efficiency</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px', alignItems: 'start' }}>
                {/* Secondary Navigation */}
                <div className="glass-panel" style={{ padding: '15px', position: 'sticky', top: '10px' }}>
                    <div style={{ padding: '5px 10px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '10px' }}>MANAGEMENT</div>
                    {[
                        { id: 'wards', label: 'Ward Occupancy', icon: <Users size={18} /> },
                        { id: 'analytics', label: 'Staff Analytics', icon: <Activity size={18} /> },
                        { id: 'rules', label: 'Automation Rules', icon: <Settings size={18} /> },
                        { id: 'logs', label: 'Audit Logs', icon: <FileText size={18} /> }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '12px 15px', borderRadius: '8px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px',
                                background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon} <span style={{ fontWeight: '500' }}>{tab.label}</span>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="glass-panel" style={{ padding: '25px', minHeight: '600px' }}>
                    {activeTab === 'analytics' && (
                        <div>
                            <h3 style={{ marginTop: 0 }}>Staff Response & Clinical KPIs</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
                                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>42s</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Critical Response</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>12.5m</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Routine Check</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success-color)' }}>98.2%</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Protocol Adherence</div>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '15px' }}>Ward Efficiency Trends</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {[
                                    { ward: 'ICU-1', efficiency: 95, color: '#ef4444' },
                                    { ward: 'General Ward A', efficiency: 82, color: '#0ea5e9' },
                                    { ward: 'Emergency', efficiency: 98, color: '#f59e0b' }
                                ].map(w => (
                                    <div key={w.ward}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                                            <span>{w.ward}</span>
                                            <span>{w.efficiency}%</span>
                                        </div>
                                        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{ width: `${w.efficiency}%`, height: '100%', background: w.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'wards' && (
                        <div>
                            <h3 style={{ marginTop: 0 }}>Bed Occupancy Status</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
                                {wards.map(ward => (
                                    <div key={ward.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <h4 style={{ margin: 0 }}>{ward.name}</h4>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Live Status</span>
                                        </div>
                                        <div style={{ margin: '15px 0' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                                {ward.occupied} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ {ward.total}</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
                                                <div style={{ width: `${(ward.occupied / ward.total) * 100}%`, height: '100%', background: 'var(--primary-color)' }} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--success-color)' }}>{ward.available} Available</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{Math.round((ward.occupied / ward.total) * 100)}% Full</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'rules' && (
                        <div>
                            <h3 style={{ marginTop: 0 }}>Clinical Automation Pipeline</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '25px' }}>
                                System rules govern automated task creation and status propagation based on vitals data.
                            </p>
                            {rules.map(rule => (
                                <div key={rule.id} style={{
                                    background: '#f8fafc', padding: '20px', borderRadius: '12px',
                                    border: '1px solid #e2e8f0', marginBottom: '15px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                            <h4 style={{ margin: 0 }}>{rule.name}</h4>
                                            {rule.active && <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#16a34a', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold' }}>ACTIVE</span>}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Trigger condition: <code style={{ color: '#0ea5e9' }}>{rule.condition}</code></div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Action: <strong style={{ color: 'var(--text-primary)' }}>{rule.action}</strong></div>
                                    </div>
                                    <button className="btn" style={{ background: 'white', border: '1px solid #cbd5e1' }}>Configure</button>
                                </div>
                            ))}
                            <button className="btn btn-primary" style={{ marginTop: '10px' }}>Deploy New Rule</button>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div>
                            <h3 style={{ marginTop: 0 }}>Security & Audit Trail</h3>
                            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                    <thead>
                                        <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Timestamp</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Operator</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Clinical Action</th>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Identifier</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workflowLogs.map(log => (
                                            <tr key={log.id} style={{ background: 'white' }}>
                                                <td style={{ padding: '12px 10px', borderRadius: '8px 0 0 8px', border: '1px solid #f1f5f9', borderRight: 'none' }}>{log.timestamp}</td>
                                                <td style={{ padding: '12px 10px', border: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none', fontWeight: '600' }}>{log.user}</td>
                                                <td style={{ padding: '12px 10px', border: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>
                                                    <span style={{ padding: '4px 8px', background: log.action.includes('Critical') ? '#fee2e2' : '#f1f5f9', color: log.action.includes('Critical') ? '#ef4444' : 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 10px', borderRadius: '0 8px 8px 0', border: '1px solid #f1f5f9', borderLeft: 'none', color: 'var(--text-secondary)' }}>{log.target}</td>
                                            </tr>
                                        ))}
                                        {/* Original Seed Logs */}
                                        {[
                                            { time: '10:02 AM', user: 'System', action: 'Rule Triggered: Oxygen Critical', target: 'Ravi Kumar' },
                                            { time: '10:05 AM', user: 'Nurse Sarah', action: 'Vitals Updated', target: 'Anita Sharma' }
                                        ].map((log, i) => (
                                            <tr key={`seed-${i}`} style={{ background: 'white' }}>
                                                <td style={{ padding: '12px 10px', borderRadius: '8px 0 0 8px', border: '1px solid #f1f5f9', borderRight: 'none' }}>{log.time}</td>
                                                <td style={{ padding: '12px 10px', border: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none', fontWeight: '600' }}>{log.user}</td>
                                                <td style={{ padding: '12px 10px', border: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>{log.action}</td>
                                                <td style={{ padding: '12px 10px', borderRadius: '0 8px 8px 0', border: '1px solid #f1f5f9', borderLeft: 'none' }}>{log.target}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
