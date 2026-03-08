import React, { createContext, useContext, useState } from 'react';
import { useNotifications } from './NotificationContext';

const PatientContext = createContext();
export const usePatients = () => useContext(PatientContext);

const initialPatients = [
    {
        id: 1,
        name: 'Ravi Kumar',
        age: 45,
        gender: 'Male',
        ipNumber: 'IP-2024-001',
        ward: 'ICU-1',
        bed: 'A1',
        doa: '2024-02-10',
        diagnosis: 'Severe Pneumonia',
        status: 'Stable',
        consentSigned: true,
        vitals: { heartRate: 72, bp: '120/80', spo2: 98, temp: 36.5, bloodSugar: 140, painScale: 2, rr: 18 },
        history: [],
        complaints: { symptoms: 'None', improvement: 'Stable', sleep: 'Good', appetite: 'Normal', urineBowel: 'Regular' },
        treatment: [
            { id: 1, name: 'Paracetamol', dose: '650mg', time: '08:00 AM' },
            { id: 2, name: 'IV Fluids', dose: 'NS 500ml', time: 'Continuous' }
        ],
        investigations: { blood: 'WBC 11000', xray: 'Clear', ecg: 'Normal' },
        dietPlan: 'High Protein, Low Salt',
        doctorNotes: 'Maintain vitals monitoring every 4 hours.',
        escalationPath: ['Stable'],
        timeline: [
            { type: 'Admission', time: '2024-02-10 10:00 AM', detail: 'Admitted to ICU-1 from ER', user: 'Dr. John' },
            { type: 'Investigation', time: '2024-02-10 02:00 PM', detail: 'Chest X-Ray completed', user: 'Nurse Sarah' }
        ],
        responseTimeLogs: []
    },
    {
        id: 2,
        name: 'Anita Sharma',
        age: 62,
        gender: 'Female',
        ipNumber: 'IP-2024-005',
        ward: 'ICU-1',
        bed: 'A2',
        doa: '2024-02-11',
        diagnosis: 'Post-Op Observation',
        status: 'Warning',
        consentSigned: false,
        vitals: { heartRate: 110, bp: '140/90', spo2: 95, temp: 37.0, bloodSugar: 180, painScale: 5, rr: 22 },
        history: [],
        complaints: { symptoms: 'Mild Chest Pain', improvement: 'Improving', sleep: 'Disturbed', appetite: 'Reduced', urineBowel: 'Regular' },
        treatment: [
            { id: 1, name: 'Augmentin', dose: '625mg', time: '10:00 AM' }
        ],
        investigations: { blood: 'Hb 10.5', xray: 'Shadow in lower lobe', ecg: 'Sinus Tachycardia' },
        dietPlan: 'Soft Diet',
        doctorNotes: 'Monitor HR closely.',
        escalationPath: ['Stable', 'Warning'],
        timeline: [
            { type: 'Admission', time: '2024-02-11 08:30 AM', detail: 'Admitted after surgery', user: 'Dr. John' }
        ],
        responseTimeLogs: []
    }
];

export const PatientProvider = ({ children, addTask }) => {
    const [patients, setPatients] = useState(initialPatients);
    const { addNotification } = useNotifications();

    const updateVitals = (patientId, newVitals) => {
        setPatients(prevPatients => prevPatients.map(patient => {
            if (patient.id !== patientId) return patient;

            let newStatus = 'Stable';
            const tasks = [];

            if (newVitals.spo2 < 92) {
                newStatus = 'Critical';
                tasks.push({
                    id: Date.now() + 1,
                    patientId: patient.id,
                    title: `Check Oxygen Level for ${patient.name}`,
                    priority: 'High', deadline: '10 min', completed: false, type: 'System',
                    generatedAt: new Date().getTime()
                });
                addNotification(`CRITICAL: ${patient.name} has low SpO2 (${newVitals.spo2}%)`, 'danger');
            } else if (newVitals.spo2 < 95) {
                newStatus = 'Warning';
                addNotification(`Warning: ${patient.name} SpO2 dropping (${newVitals.spo2}%)`, 'warning');
            }

            const [sys, dia] = newVitals.bp.split('/').map(Number);
            if (sys > 160 || dia > 100) {
                if (newStatus !== 'Critical') newStatus = 'Critical';
                tasks.push({
                    id: Date.now() + 2,
                    patientId: patient.id,
                    title: `Administer BP Meds for ${patient.name}`,
                    priority: 'High', deadline: '15 min', completed: false, type: 'System',
                    generatedAt: new Date().getTime()
                });
                addNotification(`CRITICAL: ${patient.name} High BP (${newVitals.bp})`, 'danger');
            }

            if (tasks.length > 0 && addTask) {
                tasks.forEach(task => addTask(task));
            }

            const timestamp = new Date().toLocaleTimeString();

            // Add to clinical timeline if status changed to Critical/Warning
            const newTimeline = [...patient.timeline];
            if (newStatus !== patient.status && newStatus !== 'Stable') {
                newTimeline.push({
                    type: 'Escalation',
                    time: new Date().toLocaleString(),
                    detail: `Status changed to ${newStatus} due to clinical vitals spike`,
                    user: 'System Engine'
                });
            }

            return {
                ...patient,
                vitals: { ...patient.vitals, ...newVitals },
                status: newStatus,
                history: [{ timestamp, vitals: { ...newVitals }, status: newStatus }, ...patient.history.slice(0, 49)],
                escalationPath: [...patient.escalationPath, newStatus].slice(-10),
                timeline: newTimeline
            };
        }));
    };

    const updatePatientDetails = (patientId, field, data) => {
        setPatients(prev => prev.map(p =>
            p.id === patientId ? { ...p, [field]: data } : p
        ));
    };

    const recordStaffResponse = (patientId, taskTitle, responseTimeMs) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    responseTimeLogs: [
                        ...p.responseTimeLogs,
                        { task: taskTitle, time: responseTimeMs, timestamp: new Date().toISOString() }
                    ]
                };
            }
            return p;
        }));
    };

    const signClinicalEntry = (patientId, userRole, userName) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                const newTimeline = [...p.timeline, {
                    type: 'Signature',
                    time: new Date().toLocaleString(),
                    detail: `Digitally signed by ${userName} (${userRole})`,
                    user: userName
                }];
                return { ...p, timeline: newTimeline, lastSignedBy: userName };
            }
            return p;
        }));
    };

    return (
        <PatientContext.Provider value={{
            patients,
            updateVitals,
            updatePatientDetails,
            recordStaffResponse,
            signClinicalEntry
        }}>
            {children}
        </PatientContext.Provider>
    );
};
