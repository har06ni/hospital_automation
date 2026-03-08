import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Search, MapPin, AlertCircle, Navigation, Pill, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

const MedicineSearch = () => {
    const { searchMedicines } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [emergencyMode, setEmergencyMode] = useState(false);

    const results = searchMedicines(searchTerm, emergencyMode);

    const getStatusColor = (status) => {
        if (status === 'Out of Stock') return '#ef4444';
        if (status === 'Low Stock') return '#eab308';
        return '#22c55e';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Clinical Inventory & Pharmacy Search</h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div
                        onClick={() => setEmergencyMode(!emergencyMode)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 15px', borderRadius: '30px', cursor: 'pointer',
                            background: emergencyMode ? '#fee2e2' : 'white',
                            border: `1px solid ${emergencyMode ? '#ef4444' : '#cbd5e1'}`,
                            color: emergencyMode ? '#ef4444' : 'var(--text-secondary)',
                            fontWeight: '600', transition: 'all 0.3s'
                        }}
                    >
                        <ShieldAlert size={18} /> Emergency Mode {emergencyMode ? 'ON' : 'OFF'}
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '12px', color: '#94a3b8' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search generic name or brand (e.g. Adrenaline, Dolo)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '12px 12px 12px 50px', borderRadius: '30px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedMedicine ? '1.2fr 1fr' : '1fr', gap: '20px', flex: 1, overflow: 'hidden' }}>
                {/* Results List */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Pill size={20} color="var(--primary-color)" /> Search Results ({results.length})
                    </h3>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {results.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                                <Search size={48} style={{ opacity: 0.2, marginBottom: '15px' }} />
                                <p>No matching clinical stock found.</p>
                            </div>
                        ) : (
                            results.map(med => (
                                <div
                                    key={med.id}
                                    onClick={() => setSelectedMedicine(med)}
                                    style={{
                                        padding: '15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                                        background: selectedMedicine?.id === med.id ? 'rgba(14, 165, 233, 0.05)' : 'white',
                                        borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        marginBottom: '10px', transition: 'all 0.2s', border: selectedMedicine?.id === med.id ? '1px solid #0ea5e9' : '1px solid #f1f5f9'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            padding: '10px', background: med.isEmergency ? '#fee2e2' : '#f0f9ff',
                                            borderRadius: '10px', color: med.isEmergency ? '#ef4444' : '#0ea5e9'
                                        }}>
                                            <Pill size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{med.brand} {med.isEmergency && <ShieldAlert size={14} style={{ display: 'inline', color: '#ef4444' }} />}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{med.name} • {med.dosage}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: getStatusColor(med.status), fontWeight: 'bold', fontSize: '0.8rem' }}>{med.status}</div>
                                        <div style={{ fontSize: '0.85rem' }}>₹{med.price}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Details View */}
                {selectedMedicine && (
                    <div className="glass-panel" style={{ padding: '0', overflowY: 'auto', border: selectedMedicine.isEmergency ? '2px solid #ef4444' : 'none' }}>
                        <div style={{ padding: '25px', background: selectedMedicine.isEmergency ? '#fff1f2' : '#f0f9ff', borderBottom: '1px solid #cbd5e1' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {selectedMedicine.brand}
                                        {selectedMedicine.isEmergency && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px' }}>CRITICAL</span>}
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>{selectedMedicine.name} ({selectedMedicine.dosage} {selectedMedicine.form})</p>
                                </div>
                                <button className="btn" onClick={() => setSelectedMedicine(null)} style={{ border: 'none', background: 'transparent' }}>✕</button>
                            </div>
                        </div>

                        <div style={{ padding: '25px' }}>
                            {selectedMedicine.status === 'Out of Stock' && (
                                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
                                    <Info color="#92400e" size={20} />
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '4px' }}>In-House Stock Depleted</div>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e' }}>Check nearby pharmacies or consider suggested alternatives below.</p>
                                    </div>
                                </div>
                            )}

                            <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={18} color="var(--primary-color)" /> Nearby Distribution
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                                {selectedMedicine.nearby.map(place => (
                                    <div key={place.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{place.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{place.distance} km • Stock: {place.availability}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{place.price}</div>
                                            <Navigation size={16} style={{ cursor: 'pointer', marginTop: '5px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <RefreshCw size={18} color="var(--success-color)" /> Recommended Alternatives
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedMedicine.alternatives.map(alt => (
                                    <div key={alt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{alt.brand}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alt.manufacturer} • {alt.status}</div>
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>₹{alt.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicineSearch;
