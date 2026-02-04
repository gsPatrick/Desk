export default function sitemap() {
    return [
        {
            url: 'https://codebypatrick.com',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Add other routes here if you have dynamic pages in the future
    ]
}
