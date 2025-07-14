export default defineAppConfig({
    // @ts-ignore
    menu: () => [
        { "label": "Home", "url": "/", "active": true },
        // currently, the /catalogs root listing endpoint menu option can be overridden by the global config from PrezAPI, 
        // this occurs when PrezAPI is configured to use different listings endpoints
        // if you overwrite the appConfig to not include /catalogs, the global config will leave your custom listings endpoint menu option in place
        { "label": "Vocabularies", "url": "/catalogs/catalogue:ggic-vocabs/collections", "active": true },  
        { "label": "Search", "url": "/search", "active": true },
        { "label": "SPARQL", "url": "/sparql", "active": false },
        { "label": "Profiles", "url": "/profiles", "active": false },
        { "label": "About", "url": "/about", "active": true },
        { "label": "API Documentation", "url": "/docs", "active": true },
        { "label": "Vocabulary Management", "url": "/admin", "active": false }
    ],
    nameSubstitutions: {
        "collections": "Vocabularies"
    }
});

declare module '@nuxt/schema' {
    interface AppConfigInput {
        menu?: Array<{ label: string, url: string, active?: boolean }>,
        nameSubstitutions?: Record<string, string>,
        breadcrumbPrepend?: Array<{ label: string, url: string }>,
        utilsMenu?: Array<{ label: string, url: string }>
    }
}
