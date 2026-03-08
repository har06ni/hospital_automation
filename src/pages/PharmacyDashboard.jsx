import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Package, AlertTriangle, Search, PlusCircle, RefreshCw, Pill, ShoppingCart, TrendingDown } from 'lucide-react';

const PharmacyDashboard = () => {
    const { medicines, updateStock } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: medicines.length,
        low: medicines.filter(m => m.stock > 0 && m.stock < 10).length,
        outOfStock: medicines.filter(m => m.stock === 0).length
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { color: '#ef4444', text: 'Out of Stock', bg: '#fee2e2' };
        if (stock < 10) return { color: '#eab308', text: 'Low Stock', bg: '#fef9c3' };
        return { color: '#22c55e', text: 'Available', bg: '#dcfce7' };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Pharmacy Master Inventory</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Search clinical stock..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', marginLeft: '10px', fontSize: '0.9rem', width: '200px' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#e0f2fe', p: '10px', borderRadius: '12px', padding: '10px', color: '#0ea5e9' }}><Package size={24} /></div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total SKUs</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#fffbeb', p: '10px', borderRadius: '12px', padding: '10px', color: '#f59e0b' }}><AlertTriangle size={24} /></div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.low}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Low Stock Alert</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#fee2e2', p: '10px', borderRadius: '12px', padding: '10px', color: '#ef4444' }}><ShoppingCart size={24} /></div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.outOfStock}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Out of Stock</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#f0fdf4', p: '10px', borderRadius: '12px', padding: '10px', color: '#22c55e' }}><TrendingDown size={24} /></div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>92%</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fulfillment Rate</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Medication Distribution Compliance</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                            { label: 'Antibiotics', val: 95, color: '#0ea5e9' },
                            { label: 'Analgesics', val: 88, color: '#f59e0b' },
                            { label: 'IV Fluids', val: 100, color: '#22c55e' },
                            { label: 'Emergency Drugs', val: 100, color: '#ef4444' }
                        ].map(item => (
                            <div key={item.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                                    <span>{item.label}</span>
                                    <span>{item.val}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${item.val}%`, height: '100%', background: item.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginTop: 0 }}>Stock Turnover Efficiency</h4>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#22c55e 0% 75%, #f1f5f9 75% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>75.4%</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Efficiency</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.5)', borderBottom: '1px solid var(--glass-border)' }}>
                        <tr>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Medicine / Brand</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Clinical Props</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Stock Status</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Expiry</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Unit Price</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.map(med => {
                            const status = getStockStatus(med.stock);
                            return (
                                <tr key={med.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ fontWeight: '600' }}>{med.brand}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{med.name}</div>
                                    </td>
                                    <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>
                                        {med.dosage} <span style={{ opacity: 0.6 }}>({med.form})</span><br />
                                        <span style={{ fontSize: '0.75rem' }}>{med.manufacturer}</span>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <span style={{
                                            background: status.bg, color: status.color,
                                            padding: '4px 10px', borderRadius: '12px',
                                            fontSize: '0.8rem', fontWeight: 'bold',
                                            display: 'inline-flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            {status.text} ({med.stock})
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{med.expiry}</td>
                                    <td style={{ padding: '15px 20px', fontWeight: '600' }}>₹{med.price}</td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <button
                                            className="btn"
                                            onClick={() => updateStock(med.id, med.stock + 50)}
                                            style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px' }}
                                        >
                                            <PlusCircle size={18} color="var(--primary-color)" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
