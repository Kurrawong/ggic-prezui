<template>
    <NuxtLayout contentonly>
        <template #default>
            <h1 class="text-3xl mt-4 mb-4">GGIC Vocabularies Register</h1>
            <p>Vocabularies managed and published by Geoscience Australia on behalf of the Government Geoscience Information Committee (GGIC), within the Australian Geological Survey Organisation Network (AGSON).  The vocabularies are a compilation of mineral exploration related terms agreed to by the GGIC member organisations, intended to enhance the interoperability of geoscience data generated and managed by Commonwealth, State and Territory governments.</p>

            <p>The vocabularies are formulated according to the Simple Knowledge Organization System (SKOS) W3C web standard which means they are structured in a machine-readable way.  The vocabularies are delivered as web pages for human readability, and a RESTful API and SPARQL service are provided for machine readability.</p>

            <Button class="" as-child>
                <NuxtLink to="/catalogs/catalogue:ggic-vocabs/collections">Go to Vocabularies</NuxtLink>
            </Button>
        </template>
    </NuxtLayout>
</template>

<style scoped>
p {
    margin-bottom: 1rem;
}
</style>