import React, { useState, useEffect } from 'react';
import { usePatients } from '../context/PatientContext';
import { Save, AlertTriangle, Thermometer, Activity, Droplets, Info, Clipboard, Pill } from 'lucide-react';

const VitalsForm = ({ patient }) => {
    const { updateVitals, updatePatientDetails, signClinicalEntry } = usePatients();
    const [formData, setFormData] = useState({
        bp: '',
        heartRate: '',
        spo2: '',
        temp: '',
        bloodSugar: ''
    });
    const [extraData, setExtraData] = useState({
        symptoms: '',
        dietPlan: '',
        treatmentUpdate: ''
    });
    const [warning, setWarning] = useState(null);

    useEffect(() => {
        if (patient) {
            setFormData(patient.vitals);
            setExtraData({
                symptoms: patient.complaints.symptoms || '',
                dietPlan: patient.dietPlan || '',
                treatmentUpdate: ''
            });
            setWarning(null);
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleExtraChange = (e) => {
        const { name, value } = e.target;
        setExtraData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Duplicate Entry Prevention Logic
        const lastEntry = patient.history[0];
        if (lastEntry) {
            const lastTime = new Date().getTime(); // Simulation: in real app would use lastEntry.timestamp
            // Simplified check for demo: just show warning if they click too fast
            if (warning === null) {
                setWarning("Potential duplicate entry. Are you sure you want to update vitals again so soon?");
                return;
            }
        }

        updateVitals(patient.id, formData);

        if (extraData.dietPlan !== patient.dietPlan) {
            updatePatientDetails(patient.id, 'dietPlan', extraData.dietPlan);
        }

        if (extraData.symptoms) {
            updatePatientDetails(patient.id, 'complaints', { ...patient.complaints, symptoms: extraData.symptoms });
        }

        setWarning(null);
        signClinicalEntry(patient.id, 'Nurse', 'Nurse Sarah');
        alert("Clinical Entry Digitally Signed & Updated Successfully");
    };

    if (!patient) return (
        <div className="glass-panel" style={{
            padding: '20px', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', textAlign: 'center'
        }}>
            <Activity size={48} style={{ marginBottom: '15px', opacity: 0.2 }} />
            <h3>No Patient Selected</h3>
            <p>Select a patient from the list to begin clinical data entry.</p>
        </div>
    );

    return (
        <div className="glass-panel" style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Clinical Entry: {patient.name}</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {patient.ipNumber}</div>
            </div>

            {warning && (
                <div style={{
                    background: '#fffbeb', border: '1px solid #fef3c7',
                    padding: '12px', borderRadius: '8px', marginBottom: '20px',
                    display: 'flex', alignItems: 'center', gap: '10px', color: '#92400e'
                }}>
                    <AlertTriangle size={20} />
                    <div style={{ flex: 1, fontSize: '0.85rem' }}>{warning}</div>
                    <button className="btn" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setWarning(null)}>Dismiss</button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                    <Activity size={18} color="var(--primary-color)" /> Vitals Monitoring
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '500' }}>BP (mmHg)</label>
                        <input
                            type="text" name="bp" value={formData.bp} onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            placeholder="120/80"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '500' }}>Pulse (bpm)</label>
                        <input
                            type="number" name="heartRate" value={formData.heartRate} onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '500' }}>SpO2 (%)</label>
                        <input
                            type="number" name="spo2" value={formData.spo2} onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '500' }}>Temp (°C)</label>
                        <input
                            type="number" name="temp" value={formData.temp} onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                </div>

                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={18} color="var(--primary-color)" /> Observations & Care
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '500' }}>Current Symptoms / Complaints</label>
                        <textarea
                            name="symptoms" value={extraData.symptoms} onChange={handleExtraChange}
                            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                            placeholder="Pain levels, nausea, bowel movements..."
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '500' }}>Dietary Plan</label>
                        <select
                            name="dietPlan" value={extraData.dietPlan} onChange={handleExtraChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="Normal">Normal Diet</option>
                            <option value="Soft">Soft Diet</option>
                            <option value="Liquid">Clear Liquid</option>
                            <option value="NPO">NPO (Nil Per Oral)</option>
                            <option value="Diabetic">Diabetic Diet</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <Save size={18} /> SAVE CLINICAL UPDATE
                </button>
            </form>

            <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <h5 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <Clipboard size={14} /> Automation Engine Status
                </h5>
                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-secondary)' }}>
                    Updates are processed against Rule #1 (Oxygen) and Rule #2 (BP). Alerts will be propagated to Doctor Station and Pharmacy.
                </p>
            </div>
        </div>
    );
};

export default VitalsForm;
