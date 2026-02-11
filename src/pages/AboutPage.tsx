import {motion} from 'framer-motion';
import {Globe, Code2, Briefcase} from 'lucide-react';

export function AboutPage() {
    return (
        <div className="min-h-screen bg-background p-4 pt-8 pb-24 max-w-md mx-auto">

            {/* --- Intro --- */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-8 text-center">
                <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-bold text-primary">TocheOn</span> nace de la alianza de estudiantes
                    apasionados por conectar a las personas con hábitos saludables y tecnología de vanguardia.
                </p>
            </div>

            <div className="space-y-6">

                {/* Creador 1 */}
                <CreatorCard
                    name="Leonardo Montes"
                    role="Ingeniero de Software en proceso & Arquitecto Cloud"
                    description="Especialista en desarrollo de soluciones escalables, PWAs y arquitecturas serverless."
                    website="https://molink.com.co"
                    icon={<Code2 className="w-8 h-8 text-indigo-500"/>}
                />

                {/* Creador 2 */}
                <CreatorCard
                    name="Juan Carlos Patiño"
                    role="Ingeniero en Sistemas"
                    description="Experto en crear experiencias de usuario memorables y estrategias digitales."
                    website="https://uxsistemas.com"
                    icon={<Briefcase className="w-8 h-8 text-rose-500"/>}
                />

                {/* Creador 3 */}
                <CreatorCard
                    name="Yesid Vera"
                    role="Abogado Magister en Derecho Administrativo"
                    description="Politicas Publicas"
                    website="https://wa.me/3118967362"
                    icon={<Briefcase className="w-8 h-8 text-rose-500"/>}
                />

            </div>

            {/* --- Footer --- */}
            <div className="mt-12 text-center">
                <p className="text-xs text-muted-foreground">
                    Hecho con ❤️ en Cúcuta, Colombia.
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">v1.0.0</p>
            </div>
        </div>
    );
}

// Componente interno para la tarjeta
function CreatorCard({name, role, description, website, icon}: any) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-muted rounded-full">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-card-foreground">{name}</h3>
                    <p className="text-xs font-semibold text-primary">{role}</p>
                </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {description}
            </p>

            <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-foreground text-background rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
                <Globe className="w-4 h-4"/>
                Visitar Portafolio
            </a>
        </motion.div>
    );
}