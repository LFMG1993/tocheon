import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            devOptions: {
                // Habilitamos la PWA en el modo de desarrollo
                enabled: true,
            },
            // Estrategia de actualización automática del service worker
            registerType: 'autoUpdate',
            // Archivos para incluir en el precaching (disponibles offline)
            includeAssets: ['react.svg'],
            // Configuración del manifest de la PWA
            manifest: {
                name: 'Toche On',
                short_name: 'TocheOn',
                description: 'Tu guía para descubrir lo mejor de Cúcuta.',
                // Color del tema para la barra de estado del navegador
                theme_color: '#F7FFF7',
                // Color de fondo para la pantalla de bienvenida (splash screen)
                background_color: '#F7FFF7',
                // Íconos para la pantalla de inicio en diferentes tamaños
                icons: [
                    {
                        src: 'react.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any maskable',
                    },
                    {
                        src: 'react.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],
})
