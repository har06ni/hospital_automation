import React, { useState } from 'react';
import PatientList from '../components/PatientList';
import VitalsForm from '../components/VitalsForm';
import TaskPanel from '../components/TaskPanel';
import { usePatients } from '../context/PatientContext';
import { ShieldAlert, CheckCircle2, FileText, Clipboard } from 'lucide-react';

const NurseDashboard = () => {
    const { patients, updatePatientDetails } = usePatients();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedWard, setSelectedWard] = useState('ICU-1');
    const [showConsent, setShowConsent] = useState(false);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        if (!patient.consentSigned) {
            setShowConsent(true);
        }
    };

    const handleConsent = () => {
        updatePatientDetails(selectedPatient.id, 'consentSigned', true);
        setShowConsent(false);
    };

    return (
        <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Clinical Care Dashboard</h2>
                    <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        style={{ padding: '8px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 'bold' }}
                    >
                        <option value="ICU-1">ICU-1 (Standard)</option>
                        <option value="General Ward A">General Ward A</option>
                        <option value="Emergency">ER Department</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="glass-panel" style={{ padding: '8px 15px', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={18} /> Shift: Active
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(250px, 300px) 1fr minmax(250px, 300px)',
                gap: '20px',
                flex: 1,
                overflow: 'hidden'
            }}>
                <div style={{ overflowY: 'auto' }}>
                    <PatientList filterWard={selectedWard} onSelectPatient={handlePatientSelect} selectedPatientId={selectedPatient?.id} />
                </div>

                <div style={{ overflowY: 'auto' }}>
                    <VitalsForm patient={selectedPatient} />
                </div>

                <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <TaskPanel />
                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clipboard size={18} color="var(--primary-color)" /> Ward Bed Heatmap
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                            {Array.from({ length: 20 }).map((_, i) => {
                                const bedNum = `A${i + 1}`;
                                const patientOnBed = patients.find(p => p.bed === bedNum);
                                const statusColor = patientOnBed
                                    ? (patientOnBed.status === 'Critical' ? '#ef4444' : (patientOnBed.status === 'Warning' ? '#f59e0b' : '#22c55e'))
                                    : '#e2e8f0';

                                return (
                                    <div
                                        key={i}
                                        title={patientOnBed ? `${patientOnBed.name} (${patientOnBed.status})` : 'Empty Bed'}
                                        onClick={() => patientOnBed && setSelectedPatient(patientOnBed)}
                                        style={{
                                            aspectRatio: '1', borderRadius: '4px', background: statusColor,
                                            cursor: patientOnBed ? 'pointer' : 'default',
                                            border: patientOnBed ? '1px solid rgba(0,0,0,0.1)' : '1px solid transparent',
                                            transition: 'transform 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', fontWeight: 'bold', color: patientOnBed ? 'white' : 'var(--text-secondary)'
                                        }}
                                        onMouseOver={(e) => patientOnBed && (e.currentTarget.style.transform = 'scale(1.1)')}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {bedNum}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '2px' }} /> Crit</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '2px' }} /> Warn</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '2px' }} /> Stab</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#e2e8f0', borderRadius: '2px' }} /> Empty</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role-Locked Consent Modal */}
            {showConsent && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)', zIndex: 2000
                }}>
                    <div className="glass-panel" style={{ background: 'white', padding: '30px', maxWidth: '500px' }}>
                        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)' }}>
                            <FileText size={24} /> Patient Consent Required
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Before proceeding with clinical updates for <strong>{selectedPatient?.name}</strong>, digital consent for record processing and treatment acknowledgment must be confirmed.
                        </p>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                            <label style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                                <input type="checkbox" id="consent-check" />
                                <span>I acknowledge that the patient has provided verbal/written consent for treatment and digital record tracking as per hospital policy.</span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button className="btn" onClick={() => setSelectedPatient(null)}>Cancel</button>
                            <button className="btn" onClick={handleConsent} style={{ background: 'var(--primary-color)', color: 'white' }}>Sign & Acknowledge</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NurseDashboard;
