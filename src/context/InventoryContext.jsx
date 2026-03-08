import React, { createContext, useContext, useState } from 'react';
import { useNotifications } from './NotificationContext';

const InventoryContext = createContext();
export const useInventory = () => useContext(InventoryContext);

const initialMedicines = [
    {
        id: 1,
        name: 'Paracetamol',
        brand: 'Dolo 650',
        dosage: '650mg',
        form: 'Tablet',
        stock: 45,
        status: 'Available',
        expiry: '2025-12-01',
        price: 30,
        manufacturer: 'Micro Labs',
        isEmergency: false,
        alternatives: [
            { id: 101, brand: 'Calpol 650', manufacturer: 'GSK', price: 32, status: 'Available' },
            { id: 102, brand: 'Pacimol 650', manufacturer: 'Ipca', price: 28, status: 'Available' }
        ],
        nearby: [
            { id: 'p1', name: 'Apollo Pharmacy', distance: 0.5, availability: 'Available', price: 30 },
            { id: 'p2', name: 'MedPlus', distance: 1.2, availability: 'Low Stock', price: 29 }
        ]
    },
    {
        id: 2,
        name: 'Amoxicillin',
        brand: 'Augmentin 625',
        dosage: '625mg',
        form: 'Tablet',
        stock: 8,
        status: 'Low Stock',
        expiry: '2024-10-15',
        price: 120,
        manufacturer: 'GSK',
        isEmergency: false,
        alternatives: [
            { id: 201, brand: 'Moxikind-CV 625', manufacturer: 'Mankind', price: 110, status: 'Available' }
        ],
        nearby: [
            { id: 'p2', name: 'MedPlus', distance: 1.2, availability: 'Available', price: 118 }
        ]
    },
    {
        id: 3,
        name: 'Adrenaline',
        brand: 'EpiPen',
        dosage: '0.3mg',
        form: 'Injection',
        stock: 5,
        status: 'Low Stock',
        expiry: '2026-05-10',
        price: 4500,
        manufacturer: 'Mylan',
        isEmergency: true,
        alternatives: [
            { id: 301, brand: 'Auvi-Q', manufacturer: 'Kaleo', price: 4800, status: 'Available' }
        ],
        nearby: [
            { id: 'p3', name: 'City Hospital Pharmacy', distance: 0.1, availability: 'Available', price: 4500 }
        ]
    },
    {
        id: 4,
        name: 'Atropine',
        brand: 'Atropine Sulfate',
        dosage: '0.6mg',
        form: 'Injection',
        stock: 0,
        status: 'Out of Stock',
        expiry: '2025-08-20',
        price: 150,
        manufacturer: 'Generic',
        isEmergency: true,
        alternatives: [
            { id: 401, brand: 'Glycopyrrolate', manufacturer: 'Generic', price: 180, status: 'Available' }
        ],
        nearby: [
            { id: 'p1', name: 'Apollo Pharmacy', distance: 0.5, availability: 'Available', price: 160 }
        ]
    }
];

export const InventoryProvider = ({ children }) => {
    const [medicines, setMedicines] = useState(initialMedicines);
    const { addNotification } = useNotifications();

    const determineStatus = (qty) => {
        if (qty === 0) return 'Out of Stock';
        if (qty < 10) return 'Low Stock';
        return 'Available';
    };

    const updateStock = (id, quantity) => {
        setMedicines(prev => prev.map(med => {
            if (med.id === id) {
                const newStatus = determineStatus(quantity);
                if (quantity === 0) {
                    addNotification(`CRITICAL: ${med.brand} is OUT OF STOCK!`, 'danger');
                }
                return { ...med, stock: quantity, status: newStatus };
            }
            return med;
        }));
    };

    const searchMedicines = (query, emergencyMode = false) => {
        let results = [...medicines];

        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(med =>
                med.name.toLowerCase().includes(lowerQuery) ||
                med.brand.toLowerCase().includes(lowerQuery)
            );
        }

        if (emergencyMode) {
            // Sort by: isEmergency (true first), then Availability, then Distance
            return results.sort((a, b) => {
                if (a.isEmergency !== b.isEmergency) return b.isEmergency ? 1 : -1;

                const aAvail = a.status === 'Available' ? 2 : (a.status === 'Low Stock' ? 1 : 0);
                const bAvail = b.status === 'Available' ? 2 : (b.status === 'Low Stock' ? 1 : 0);
                if (aAvail !== bAvail) return bAvail - aAvail;

                const aDist = a.nearby[0]?.distance || 99;
                const bDist = b.nearby[0]?.distance || 99;
                return aDist - bDist;
            });
        }

        return results;
    };

    const getNearbyPharmacies = (medicineId) => {
        const med = medicines.find(m => m.id === medicineId);
        return med ? med.nearby : [];
    };

    const getAlternatives = (medicineId) => {
        const med = medicines.find(m => m.id === medicineId);
        return med ? med.alternatives : [];
    };

    return (
        <InventoryContext.Provider value={{
            medicines,
            updateStock,
            searchMedicines,
            getNearbyPharmacies,
            getAlternatives
        }}>
            {children}
        </InventoryContext.Provider>
    );
};
