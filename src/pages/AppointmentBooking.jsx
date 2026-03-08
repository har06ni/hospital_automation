import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Stethoscope, CheckCircle, AlertCircle, MapPin, Phone, MessageSquare, Send, X, Bot, ChevronDown } from 'lucide-react';

const doctors = [
    { id: 1, name: 'Dr. Rajesh Sharma', specialty: 'Cardiology', available: true, nextSlot: '10:30 AM', experience: '15 years', rating: 4.8 },
    { id: 2, name: 'Dr. Priya Mehta', specialty: 'General Medicine', available: true, nextSlot: '11:00 AM', experience: '12 years', rating: 4.9 },
    { id: 3, name: 'Dr. Anil Gupta', specialty: 'Orthopedics', available: false, nextSlot: 'Tomorrow 9:00 AM', experience: '20 years', rating: 4.7 },
    { id: 4, name: 'Dr. Sunita Patel', specialty: 'Dermatology', available: true, nextSlot: '2:00 PM', experience: '8 years', rating: 4.6 },
    { id: 5, name: 'Dr. Vikram Singh', specialty: 'Neurology', available: true, nextSlot: '3:30 PM', experience: '18 years', rating: 4.9 },
    { id: 6, name: 'Dr. Meera Joshi', specialty: 'Pediatrics', available: true, nextSlot: '12:00 PM', experience: '10 years', rating: 4.8 },
];

const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];

const AppointmentBooking = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [reason, setReason] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [filterSpecialty, setFilterSpecialty] = useState('All');

    // AI Chatbot State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatQuestion, setChatQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', content: 'Hello! I am your Medical Assistant. How can I help you with your symptoms or hospital guidance today?' }
    ]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isChatOpen) scrollToBottom();
    }, [chatHistory, isChatOpen]);

    const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];

    const filteredDoctors = filterSpecialty === 'All' ? doctors : doctors.filter(d => d.specialty === filterSpecialty);

    const handleBookAppointment = () => {
        if (!selectedDoctor || !selectedDate || !selectedTime || !patientName) return;

        const newAppointment = {
            id: Date.now(),
            doctor: selectedDoctor,
            date: selectedDate,
            time: selectedTime,
            patientName,
            patientPhone,
            reason,
            status: 'Confirmed',
            bookedAt: new Date().toLocaleString()
        };

        setAppointments(prev => [newAppointment, ...prev]);
        setShowSuccess(true);
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedTime('');
        setPatientName('');
        setPatientPhone('');
        setReason('');

        setTimeout(() => setShowSuccess(false), 4000);
    };

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!chatQuestion.trim() || isChatLoading) return;

        const userMsg = { role: 'user', content: chatQuestion };
        setChatHistory(prev => [...prev, userMsg]);
        setChatQuestion('');
        setIsChatLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: chatQuestion })
            });

            const data = await response.json();
            setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply || "I'm sorry, I couldn't process that." }]);
        } catch (err) {
            console.error('Chat Error:', err);
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Connection error. Please try again later." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Appointment Booking</h2>
                <div className="glass-panel" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} color="var(--primary-color)" />
                    <span style={{ fontWeight: '600' }}>{appointments.length} Booked</span>
                </div>
            </div>

            {showSuccess && (
                <div style={{
                    background: '#f0fdf4', border: '1px solid #86efac', padding: '15px 20px',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <CheckCircle size={22} color="#22c55e" />
                    <div>
                        <div style={{ fontWeight: '700', color: '#166534' }}>Appointment Confirmed!</div>
                        <div style={{ fontSize: '0.85rem', color: '#15803d' }}>Your appointment has been booked successfully.</div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Doctor Selection */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', maxHeight: '60vh', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Stethoscope size={20} color="var(--primary-color)" /> Select Doctor
                        </h3>
                        <select
                            value={filterSpecialty}
                            onChange={(e) => setFilterSpecialty(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                        >
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredDoctors.map(doc => (
                            <div
                                key={doc.id}
                                onClick={() => setSelectedDoctor(doc)}
                                style={{
                                    padding: '15px', borderRadius: '12px', cursor: 'pointer',
                                    background: selectedDoctor?.id === doc.id ? 'rgba(14, 165, 233, 0.08)' : 'white',
                                    border: selectedDoctor?.id === doc.id ? '2px solid #0ea5e9' : '1px solid #f1f5f9',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{doc.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.specialty} • {doc.experience}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            padding: '3px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700',
                                            background: doc.available ? '#dcfce7' : '#fee2e2',
                                            color: doc.available ? '#16a34a' : '#dc2626'
                                        }}>
                                            {doc.available ? 'Available' : 'Busy'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            ⭐ {doc.rating}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                                    <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                    Next: {doc.nextSlot}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Form */}
                <div className="glass-panel" style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} color="var(--primary-color)" /> Book Appointment
                    </h3>

                    {selectedDoctor && (
                        <div style={{
                            background: '#f0f9ff', padding: '12px 15px', borderRadius: '10px',
                            marginBottom: '20px', border: '1px solid #bae6fd'
                        }}>
                            <div style={{ fontWeight: '700', color: '#0369a1' }}>{selectedDoctor.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#0c4a6e' }}>{selectedDoctor.specialty}</div>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Patient Name *</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                <input
                                    type="text" placeholder="Enter full name" value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                <input
                                    type="tel" placeholder="Enter phone number" value={patientPhone}
                                    onChange={(e) => setPatientPhone(e.target.value)}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Preferred Date *</label>
                            <input
                                type="date" min={today} value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Time Slot *</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {timeSlots.map(slot => (
                                    <div
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        style={{
                                            padding: '8px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer',
                                            fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s',
                                            background: selectedTime === slot ? 'var(--primary-color)' : '#f8fafc',
                                            color: selectedTime === slot ? 'white' : 'var(--text-primary)',
                                            border: selectedTime === slot ? '1px solid var(--primary-color)' : '1px solid #e2e8f0'
                                        }}
                                    >
                                        {slot}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Reason for Visit</label>
                            <textarea
                                placeholder="Describe your symptoms or reason..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            />
                        </div>

                        <button
                            className="btn"
                            onClick={handleBookAppointment}
                            disabled={!selectedDoctor || !selectedDate || !selectedTime || !patientName}
                            style={{
                                background: (!selectedDoctor || !selectedDate || !selectedTime || !patientName) ? '#cbd5e1' : 'var(--primary-color)',
                                color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '700',
                                fontSize: '1rem', cursor: (!selectedDoctor || !selectedDate || !selectedTime || !patientName) ? 'not-allowed' : 'pointer',
                                border: 'none', transition: 'all 0.2s'
                            }}
                        >
                            Confirm Appointment
                        </button>
                    </div>
                </div>
            </div>

            {/* Booked Appointments */}
            {appointments.length > 0 && (
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 15px 0' }}>Your Appointments</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {appointments.map(apt => (
                            <div key={apt.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '15px', background: '#f8fafc', borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '50%',
                                        background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Stethoscope size={20} color="#0ea5e9" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700' }}>{apt.doctor.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {apt.doctor.specialty} • {apt.date} at {apt.time}
                                        </div>
                                        {apt.reason && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Reason: {apt.reason}</div>}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem',
                                    fontWeight: '700', background: '#dcfce7', color: '#16a34a'
                                }}>
                                    {apt.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Chatbot Widget */}
            <div style={{
                position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000,
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px'
            }}>
                {isChatOpen && (
                    <div className="glass-panel" style={{
                        width: '350px', height: '450px', display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(14, 165, 233, 0.2)', animation: 'slideUp 0.3s ease'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'var(--primary-color)', padding: '15px', color: 'white',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Bot size={20} />
                                <span style={{ fontWeight: '700' }}>AI Health Assistant</span>
                            </div>
                            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsChatOpen(false)} />
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%', padding: '10px 14px', borderRadius: '15px',
                                    fontSize: '0.85rem', lineHeight: '1.4',
                                    background: msg.role === 'user' ? 'var(--primary-color)' : 'white',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                                    borderBottomRightRadius: msg.role === 'user' ? '2px' : '15px',
                                    borderBottomLeftRadius: msg.role === 'user' ? '15px' : '2px'
                                }}>
                                    {msg.content}
                                </div>
                            ))}
                            {isChatLoading && (
                                <div style={{ alignSelf: 'flex-start', background: 'white', padding: '10px 15px', borderRadius: '15px', fontSize: '0.8rem', color: '#64748b' }}>
                                    Thinking...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleAskAI} style={{ padding: '15px', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                            <input
                                type="text" placeholder="Ask about symptoms..." value={chatQuestion}
                                onChange={(e) => setChatQuestion(e.target.value)}
                                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                            />
                            <button type="submit" disabled={isChatLoading} style={{
                                background: 'var(--primary-color)', color: 'white', border: 'none',
                                width: '36px', height: '36px', borderRadius: '8px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                )}

                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '30px',
                        background: 'var(--primary-color)', color: 'white', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)', cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isChatOpen ? <ChevronDown size={28} /> : <MessageSquare size={28} />}
                </button>
            </div>
        </div>
    );
};

export default AppointmentBooking;
