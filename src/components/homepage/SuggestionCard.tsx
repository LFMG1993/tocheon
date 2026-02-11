import type {PlaceSuggestion} from "../../types";
import {Map} from "lucide-react";
import {ImagesApi} from "../../utils/images";

const getProviderLogo = (provider?: string) => {
    if (!provider) return null;
    const p = provider.toLowerCase();
    if (p.includes('gemini')) return ImagesApi.gemini;
    if (p.includes('gpt') || p.includes('openai')) return ImagesApi.openai;
    if (p.includes('llama') || p.includes('meta')) return ImagesApi.llama3;
    return null;
};

export function SuggestionCard({place}: { place: PlaceSuggestion }) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " Cúcuta " + place.category)}`;
    const providerLogo = getProviderLogo(place.provider);

    return (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
           className="block bg-card p-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border group">
            <div className="flex justify-between">
                <div>
                    <p className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
                        {place.name}
                    </p>
                    <span
                        className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                        {place.category}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {place.description}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-between gap-3 ml-4">
                    <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                        <Map className="h-5 w-5 text-blue-500"/>
                    </div>
                    {providerLogo && (
                        <img
                            src={providerLogo}
                            alt={place.provider}
                            title={`Sugerencia generada por ${place.provider}`}
                            className="w-5 h-5 object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                        />
                    )}
                </div>
            </div>
        </a>
    );
}