export default function manifest() {
    return {
        name: 'Patrick.Developer | Full Stack & CNPJ',
        short_name: 'Patrick.Dev',
        description: 'Portfólio oficial de Patrick Gomes Siqueira. Desenvolvimento de elite.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
