import type {StateCreator} from 'zustand';
import type {LocationSlice} from '../types';
import {fetchGeolocation} from '../services/location.service';

export const createLocationSlice: StateCreator<LocationSlice> = (set) => ({
    coordinates: null,
    loadingLocation: false,
    locationError: null,
    getGeolocation: async () => {
        set({loadingLocation: true, locationError: null});
        try {
            const coords = await fetchGeolocation();
            set({coordinates: coords, loadingLocation: false});
        } catch (error) {
            const message = (error as Error).message || 'No se pudo obtener la ubicación.';
            set({
                locationError: message,
                loadingLocation: false,
                coordinates: null
            });
        }
    },
});