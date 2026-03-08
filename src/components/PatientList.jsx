import React from 'react';
import { usePatients } from '../context/PatientContext';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
const PatientList = ({ onSelectPatient, selectedPatientId, filterWard, searchQuery = '' }) => {
    const { patients } = usePatients();

    const filteredPatients = patients.filter(p => {
        const matchesWard = filterWard ? p.ward === filterWard : true;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.ipNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesWard && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Critical': return 'text-danger';
            case 'Observation': return 'text-warning';
            case 'Warning': return 'text-warning';
            case 'Stable': return 'text-success';
            default: return 'text-secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Critical': return <AlertCircle size={16} />;
            case 'Stable': return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', height: '100%' }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} /> Patient List {filterWard && `(${filterWard})`}
            </h3>
            <div className="patient-list">
                {filteredPatients.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No patients found</div>
                ) : (
                    filteredPatients.map(patient => (
                        <div
                            key={patient.id}
                            onClick={() => onSelectPatient(patient)}
                            className={`patient-card ${selectedPatientId === patient.id ? 'active' : ''}`}
                            style={{
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: 'var(--radius-md)',
                                background: selectedPatientId === patient.id ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.4)',
                                border: selectedPatientId === patient.id ? '1px solid var(--primary-color)' : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <strong>{patient.name}</strong>
                                <span className={getStatusColor(patient.status)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    {getStatusIcon(patient.status)} {patient.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {patient.ward} • Bed {patient.bed}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default PatientList;
