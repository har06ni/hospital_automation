import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PatientProvider } from './context/PatientContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';
import { InventoryProvider } from './context/InventoryContext';
import { WorkflowProvider } from './context/WorkflowContext';
import Login from './pages/Login';
import NurseDashboard from './pages/NurseDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import MedicineSearch from './pages/MedicineSearch';
import Sidebar from './components/Sidebar';
import SystemHealth from './components/SystemHealth';
import './styles/global.css';

const RoleLayout = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem('userRole') || 'nurse');
    const location = useLocation();

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) setRole(storedRole);
    }, [location]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', width: '100%' }}>
            <Sidebar role={role} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div style={{ padding: '20px 30px 0 30px', display: 'flex', justifyContent: 'flex-end' }}>
                    <SystemHealth />
                </div>
                <div style={{ flex: 1, padding: '10px 30px 30px 30px', overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const AppContent = () => {
    const { addTask } = useTasks();
    return (
        <WorkflowProvider>
            <NotificationProvider>
                <InventoryProvider>
                    <PatientProvider addTask={addTask}>
                        <Router>
                            <Routes>
                                <Route path="/" element={<Login />} />
                                <Route path="/nurse" element={<RoleLayout><NurseDashboard /></RoleLayout>} />
                                <Route path="/doctor" element={<RoleLayout><DoctorDashboard /></RoleLayout>} />
                                <Route path="/admin" element={<RoleLayout><AdminDashboard /></RoleLayout>} />
                                <Route path="/appointments" element={<RoleLayout><AppointmentBooking /></RoleLayout>} />
                                <Route path="/search" element={<RoleLayout><MedicineSearch /></RoleLayout>} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Router>
                    </PatientProvider>
                </InventoryProvider>
            </NotificationProvider>
        </WorkflowProvider>
    );
};

function App() {
    return (
        <TaskProvider>
            <AppContent />
        </TaskProvider>
    );
}

export default App;
