import React from 'react';

const ClinicalChart = ({ data, title, color = 'var(--primary-color)', min = 0, max = 200, unit = '' }) => {
    if (!data || data.length < 2) {
        return (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Insufficient data for graph</span>
            </div>
        );
    }

    const width = 400;
    const height = 150;
    const padding = 20;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((d.value - min) / (max - min)) * (height - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="glass-panel" style={{ padding: '15px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                {title} <span>{data[data.length - 1].value}{unit}</span>
            </h4>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e2e8f0" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" />

                {/* Data Line */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />

                {/* Points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                    const y = height - ((d.value - min) / (max - min)) * (height - padding * 2) - padding;
                    return (
                        <circle key={i} cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
                    );
                })}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <span>{data[0].time}</span>
                <span>{data[data.length - 1].time}</span>
            </div>
        </div>
    );
};

export default ClinicalChart;
