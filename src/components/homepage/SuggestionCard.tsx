import type {PlaceSuggestion} from "../../store/suggestionsSlice.ts";
import {Map} from "lucide-react";

export function SuggestionCard({place}: { place: PlaceSuggestion }) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ", Cúcuta")}`;

    return (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
           className="block bg-card p-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-card-foreground">{place.name}</p>
                    <p className="text-sm font-semibold text-primary">{place.category}</p>
                    <p className="text-sm text-muted-foreground mt-2">{place.description}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-full ml-4">
                    <Map className="h-5 w-5 text-blue-500"/>
                </div>
            </div>
        </a>
    );
}