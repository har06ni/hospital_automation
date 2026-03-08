import React, { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { useWorkflow } from '../context/WorkflowContext';
import { AlertCircle, Clock, CheckCircle, User, Info, Activity, FileText, Pill, Thermometer, Droplets, Zap, Search, Users, ShieldAlert } from 'lucide-react';
import ClinicalChart from '../components/ClinicalChart';
import EscalationTracker from '../components/EscalationTracker';
import EmergencyOverride from '../components/EmergencyOverride';

const DoctorDashboard = () => {
    const { patients, updatePatientDetails, signClinicalEntry } = usePatients();
    const { logAction } = useWorkflow();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('vitals');
    const [searchQuery, setSearchQuery] = useState('');

    const weights = { 'Critical': 3, 'Warning': 2, 'Stable': 1 };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedPatients = [...filteredPatients].sort((a, b) => {
        return (weights[b.status] || 0) - (weights[a.status] || 0);
    });

    const getStatusBadge = (status) => {
        const styles = {
            'Critical': { color: '#ef4444', bg: '#fee2e2', icon: <AlertCircle size={14} /> },
            'Warning': { color: '#eab308', bg: '#fef9c3', icon: <AlertCircle size={14} /> },
            'Stable': { color: '#22c55e', bg: '#dcfce7', icon: <CheckCircle size={14} /> }
        };
        const s = styles[status] || styles['Stable'];
        return (
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                color: s.color, background: s.bg, padding: '4px 10px',
                borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold'
            }}>
                {s.icon} {status}
            </span>
        );
    };

    const handleOverride = (reason) => {
        logAction('Emergency Override Executed', 'Dr. Smith', selectedPatient?.name);
        alert(`Override logged: ${reason}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Priority Clinical Queue</h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Smart Search (Name, IP, Diagnosis)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', outline: 'none', marginLeft: '10px', fontSize: '0.9rem', width: '250px' }}
                        />
                    </div>
                    <div className="glass-panel" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={18} color="var(--primary-color)" />
                        <span style={{ fontWeight: '600' }}>{patients.length} Active</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.5)', borderBottom: '1px solid var(--glass-border)' }}>
                        <tr>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Rank</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Identification</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Diagnosis</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Last SpO2/BP</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPatients.map((p, i) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: p.status === 'Critical' ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>#{i + 1}</td>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.ipNumber} • Bed {p.bed}</div>
                                </td>
                                <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{p.diagnosis}</td>
                                <td style={{ padding: '15px 20px' }}>{getStatusBadge(p.status)}</td>
                                <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>
                                    {p.vitals.spo2}% | {p.vitals.bp}
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <button className="btn" style={{ background: 'white', border: '1px solid #cbd5e1' }} onClick={() => setSelectedPatient(p)}>
                                        Review Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Expanded Clinical Modal */}
            {selectedPatient && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)', zIndex: 1000
                }} onClick={() => setSelectedPatient(null)}>
                    <div className="glass-panel" style={{
                        background: 'white', width: '900px', maxWidth: '95%',
                        height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    }} onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div style={{ padding: '25px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <h2 style={{ margin: 0 }}>{selectedPatient.name}</h2>
                                    {getStatusBadge(selectedPatient.status)}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {selectedPatient.age}y / {selectedPatient.gender} • {selectedPatient.ipNumber} • Admitted: {selectedPatient.doa}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {selectedPatient.lastSignedBy ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color)', fontSize: '0.9rem', fontWeight: '600', background: '#f0fdf4', padding: '6px 12px', borderRadius: '20px' }}>
                                        <CheckCircle size={16} /> Signed by {selectedPatient.lastSignedBy}
                                    </div>
                                ) : (
                                    <button
                                        className="btn"
                                        onClick={() => signClinicalEntry(selectedPatient.id, 'Doctor', 'Dr. Smith')}
                                        style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <ShieldAlert size={18} /> Sign Off
                                    </button>
                                )}
                                <EmergencyOverride onOverride={handleOverride} />
                                <button className="btn" onClick={() => setSelectedPatient(null)}>Close</button>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                            {/* Left Navigation */}
                            <div style={{ width: '200px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', padding: '20px' }}>
                                {[
                                    { id: 'vitals', label: 'Vitals & TPR', icon: <Activity size={18} /> },
                                    { id: 'history', label: 'Clinical History', icon: <FileText size={18} /> },
                                    { id: 'treatment', label: 'Treatment Plan', icon: <Pill size={18} /> },
                                    { id: 'labs', label: 'Lab Reports', icon: <Zap size={18} /> },
                                    { id: 'timeline', label: 'Care Timeline', icon: <Clock size={18} /> }
                                ].map(tab => (
                                    <div
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            padding: '12px 15px', borderRadius: '8px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px',
                                            background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                                            color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                                            fontSize: '0.9rem', fontWeight: '500'
                                        }}
                                    >
                                        {tab.icon} {tab.label}
                                    </div>
                                ))}
                                <div style={{ marginTop: '20px' }}>
                                    <EscalationTracker currentStatus={selectedPatient.status} />
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
                                {activeTab === 'vitals' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <ClinicalChart
                                            title="TPR Chart: Heart Rate"
                                            unit=" bpm"
                                            color="#ef4444"
                                            data={selectedPatient.history.map(h => ({ time: h.timestamp, value: h.vitals.heartRate }))}
                                        />
                                        <ClinicalChart
                                            title="TPR Chart: SpO2"
                                            unit="%"
                                            color="#0ea5e9"
                                            min={80} max={100}
                                            data={selectedPatient.history.map(h => ({ time: h.timestamp, value: h.vitals.spo2 }))}
                                        />
                                        <ClinicalChart
                                            title="TPR Chart: Temp"
                                            unit="°C"
                                            color="#f59e0b"
                                            min={35} max={42}
                                            data={selectedPatient.history.map(h => ({ time: h.timestamp, value: h.vitals.temp }))}
                                        />
                                        <ClinicalChart
                                            title="Blood Sugar Monitoring"
                                            unit=" mg/dL"
                                            color="#8b5cf6"
                                            min={70} max={300}
                                            data={selectedPatient.history.map(h => ({ time: h.timestamp, value: h.vitals.bloodSugar || 120 }))}
                                        />
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div>
                                        <h3>Current Diagnosis: {selectedPatient.diagnosis}</h3>
                                        <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px' }}>
                                            <h4>Presenting Complaints</h4>
                                            <p>{selectedPatient.complaints.symptoms}</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '0.85rem' }}>
                                                <div><strong>Improved:</strong> {selectedPatient.complaints.improvement}</div>
                                                <div><strong>Appetite:</strong> {selectedPatient.complaints.appetite}</div>
                                                <div><strong>Sleep:</strong> {selectedPatient.complaints.sleep}</div>
                                            </div>
                                        </div>
                                        <h4>Event Timeline</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {selectedPatient.history.map((h, i) => (
                                                <div key={i} style={{ padding: '12px', borderLeft: `4px solid ${h.status === 'Critical' ? 'red' : '#cbd5e1'}`, background: '#f8fafc' }}>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{h.timestamp}</div>
                                                    <div>{h.action} - Status updated to <strong>{h.status}</strong></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'treatment' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="glass-panel" style={{ padding: '20px' }}>
                                            <h4 style={{ marginTop: 0 }}>Medications Administered</h4>
                                            {selectedPatient.treatment.map(m => (
                                                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                                    <div><strong>{m.name}</strong></div>
                                                    <div>{m.dose} @ {m.time}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="glass-panel" style={{ padding: '20px' }}>
                                            <h4 style={{ marginTop: 0 }}>Diet & Fluid Plan</h4>
                                            <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                                                <strong>Diet:</strong> {selectedPatient.dietPlan}
                                            </div>
                                            <h5>Intake-Output Summary</h5>
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ color: '#0ea5e9', fontWeight: 'bold' }}>1200ml</div>
                                                    <div style={{ fontSize: '0.75rem' }}>Oral/IV</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>1400ml</div>
                                                    <div style={{ fontSize: '0.75rem' }}>Urine</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'labs' && (
                                    <div className="glass-panel" style={{ padding: '20px' }}>
                                        <h4 style={{ marginTop: 0 }}>Laboratory Investigations</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h5>Hematology</h5>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}>View Report ↗</span>
                                                </div>
                                                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem' }}>
                                                    <strong>Hb:</strong> {selectedPatient.investigations.blood.split(' ')[1]} g/dL<br />
                                                    <strong>WBC:</strong> {selectedPatient.investigations.blood.split(' ')[0]} /cu mm
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h5>Imaging</h5>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}>Open Viewer ↗</span>
                                                </div>
                                                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem' }}>
                                                    <strong>X-Ray:</strong> {selectedPatient.investigations.xray}<br />
                                                    <strong>ECG:</strong> {selectedPatient.investigations.ecg}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'timeline' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div className="glass-panel" style={{ flex: 1, padding: '15px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                                    {selectedPatient.responseTimeLogs.length > 0
                                                        ? Math.round(selectedPatient.responseTimeLogs.reduce((acc, log) => acc + log.time, 0) / selectedPatient.responseTimeLogs.length / 1000)
                                                        : '--'}s
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg Response Time</div>
                                            </div>
                                            <div className="glass-panel" style={{ flex: 1, padding: '15px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                                                    {selectedPatient.timeline.length}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Care Events</div>
                                            </div>
                                        </div>

                                        <div style={{ borderLeft: '2px dashed #cbd5e1', marginLeft: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {selectedPatient.timeline.map((item, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute', left: '-27px', top: '0', width: '12px', height: '12px',
                                                        borderRadius: '50%', background: item.type === 'Escalation' ? '#ef4444' : 'var(--primary-color)',
                                                        border: '2px solid white'
                                                    }} />
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.time} • {item.user}</div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.type}</div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.detail}</div>
                                                </div>
                                            )).reverse()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
