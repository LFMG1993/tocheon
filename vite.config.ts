import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],

            devOptions: {
                enabled: true,
                type: 'module',
            },

            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'service-worker.ts',

            injectManifest: {
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
            },
            manifest: {
                name: 'Toche On',
                short_name: 'TocheOn',
                description: 'Tu guía para descubrir lo mejor de Cúcuta.',
                theme_color: '#F7FFF7',
                background_color: '#F7FFF7',
                gcm_sender_id: "103953800507",
                icons: [
                    {
                        src: 'icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            } as any,
        }),
    ],
})
