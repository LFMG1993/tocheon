import type {Coordinates} from "./user.type.ts";

export interface LocationSlice {
    coordinates: Coordinates | null;
    loadingLocation: boolean;
    locationError: string | null;
    getGeolocation: () => Promise<void>;
}