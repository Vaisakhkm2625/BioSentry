import { writable } from 'svelte/store';

const STORAGE_KEY = 'biosentry_device_state';

// Initialize from localStorage if in browser
let initialState = {
    url: null,
    username: null,
    password: null,
    deviceId: null,
    isConnected: false
};

if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            initialState = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved device state', e);
        }
    }
}

export const deviceStore = writable(initialState);

// Persist changes to localStorage
if (typeof window !== 'undefined') {
    deviceStore.subscribe(state => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });
}


