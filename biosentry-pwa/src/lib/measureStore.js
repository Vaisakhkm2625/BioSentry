import { writable, get } from 'svelte/store';
import { deviceStore } from './deviceStore';
import { rtdb } from './firebase';
import { ref, onValue } from 'firebase/database';
import { userStore } from './authStore';

export const metricsData = writable({
    temp: [],
    pressure: [],
    o2: [],
    skin_conductance: [],
});

export const currentMetrics = writable({
    temp: 0,
    pressure: 0,
    o2: 0,
    skin_conductance: 0,
});

export const severity = writable("Low");
export const showEmergencyPopup = writable(false);
export const isMeasuring = writable(false);

/** @type {any} */
let unsubscribeMetrics = null;

/** @param {any} data */
export function handleNewMetrics(data) {
    if (!data) return;

    currentMetrics.set({
        temp: data.temp || 0,
        pressure: data.pressure || 0,
        o2: data.o2 || 0,
        skin_conductance: data.skin_conductance || 0,
    });

    metricsData.update(md => ({
        temp: [...md.temp.slice(-19), data.temp || 0],
        pressure: [...md.pressure.slice(-19), data.pressure || 0],
        o2: [...md.o2.slice(-19), data.o2 || 0],
        skin_conductance: [...md.skin_conductance.slice(-19), data.skin_conductance || 0],
    }));

    if (data.temp > 38 || (data.o2 > 0 && data.o2 < 92)) {
        severity.set("High");
        showEmergencyPopup.set(true);
    } else if (data.temp > 37.5 || (data.o2 > 0 && data.o2 < 95)) {
        severity.set("Medium");
    } else {
        severity.set("Low");
    }
}

export function startVitalsFetch() {
    if (get(isMeasuring)) return;

    const user = /** @type {any} */ (get(userStore));
    const device = /** @type {any} */ (get(deviceStore));

    if (!user || !device?.deviceId) {
        console.warn("[measureStore] ⚠️ Cannot start monitoring: user or deviceId missing", { user: user?.uid, deviceId: device?.deviceId });
        return;
    }

    isMeasuring.set(true);

    const metricsRef = ref(rtdb, `users/${user.uid}/devices/${device.deviceId}/latest`);

    unsubscribeMetrics = onValue(metricsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            handleNewMetrics(data);
        }
    });

    console.log(`[measureStore] 🚀 Started real-time monitoring for device: ${device.deviceId}`);
}


export function stopVitalsFetch() {
    isMeasuring.set(false);
    if (unsubscribeMetrics) {
        unsubscribeMetrics();
        unsubscribeMetrics = null;
    }
    console.log("[measureStore] 🛑 Stopped monitoring");
}

