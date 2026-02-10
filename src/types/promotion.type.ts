export interface Promotion {
    id: string;
    businessName: string;
    title: string;
    description: string;
    originalPrice: number;
    discountPrice: number;
    imageUrl?: string;
    mapsUrl?: string;
    validUntil?: string;
}