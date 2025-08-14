<script lang="ts" setup>
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { applyProfileToItem, dumpNodeArray, getTopConceptsUrl, SYSTEM_PREDICATES, type PrezConceptSchemeNode, type PrezDataItem, type PrezProperties, type PrezFocusNode } from 'prez-lib';

const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const { globalProfiles } = useGlobalProfiles();
const route = useRoute();
const { getPageUrl } = usePageInfo();
const urlPath = ref(getPageUrl());
const apiEndpoint = useGetPrezAPIEndpoint();
const { status, error, data } = useGetItem(apiEndpoint, urlPath);
const isConceptScheme = computed(() => data.value?.data.rdfTypes?.find(n => n.value == SYSTEM_PREDICATES.skosConceptScheme));
const topConceptsUrl = computed(() => isConceptScheme.value ? getTopConceptsUrl(data.value!.data) : '');
const apiUrl = (apiEndpoint + urlPath.value).split('?')[0];
const currentProfile = computed(() => data.value ? data.value.profiles.find(p => p.current) : undefined);

const allowedPredicates = [
    "http://www.w3.org/2004/02/skos/core#definition",
    "http://www.w3.org/2004/02/skos/core#broader",
    "http://www.w3.org/2004/02/skos/core#narrower",
    "http://www.w3.org/2004/02/skos/core#inScheme",
    "http://www.w3.org/2004/02/skos/core#member",
    "https://schema.org/status",
];

const showHidden = ref(false);

const filteredData = computed<PrezFocusNode>(() => {
    let properties: PrezProperties = {};
    if (data.value?.data?.properties) {
        properties = Object.entries(data.value?.data.properties).filter(([key, value]) => allowedPredicates.includes(key)).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {} as PrezProperties);
    }

    return {...data.value?.data as PrezFocusNode, properties}
});

const hiddenData = computed<PrezFocusNode>(() => {
    let properties: PrezProperties = {};
    if (data.value?.data?.properties) {
        properties = Object.entries(data.value?.data.properties).filter(([key, value]) => !allowedPredicates.includes(key)).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {} as PrezProperties);
    }

    return {...data.value?.data as PrezFocusNode, properties}
});

// Watch for changes in both globalProfiles and currentProfile
// Apply profile to item uses the current profile to order properties
// To do: use a loader to show that the profile is being applied
watch([() => globalProfiles.value, () => currentProfile.value], ([newGlobalProfiles, newCurrentProfile]) => {
  if (newGlobalProfiles && newCurrentProfile && newGlobalProfiles[newCurrentProfile.uri] ) {
    const profile = newGlobalProfiles[newCurrentProfile.uri];
    if (data.value && profile) {
        applyProfileToItem(data.value as PrezDataItem, profile);
    }
  }
});
</script>

<template>
    <NuxtLayout sidepanel>
        <template #header-text>
            <slot name="header-text" :data="data">
                <Node v-if="data" :key="data?.data.value" :term="data.data" variant="item-header" />
                <div v-else>&nbsp;</div>
            </slot>
        </template>

        <template #debug>
            <pre class="p-2"><small><b>{{currentProfile?.title}}</b><br>{{ dumpNodeArray(globalProfiles?.[currentProfile?.uri || '']) }}</small></pre>
        </template>

        <template #breadcrumb>
            <slot name="breadcrumb" :data="data">
                <div :key="data?.parents.slice(2).join()">
                    <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents.slice(2)" />
                    <ItemBreadcrumb v-else-if="error" :custom-items="[{url: '/', label: 'Unable to load page'}]" />
                    <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{url: '#', label: '...'}]" />
                </div>
            </slot>
        </template>

        <template #default>
            <slot :data="data" :status="status" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">

                <slot name="top" :data="data" :status="status" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>

                <slot v-if="error" name="message">
                    <Message severity="error">{{ error }}</Message>
                </slot>

                <slot v-else-if="status == 'pending'" name="loading" :status="status">
                    <Loading variant="item" />
                </slot>

                <div v-else-if="data?.data" :key="data?.data.value">
                    <slot name="header-section" :data="data">
                        <slot name="header-top" :data="data"></slot>
                        <slot name="header-description" :data="data"></slot>
                        <slot name="header-middle" :data="data"></slot>
                        <slot name="header-identifiers" :data="data">
                            <div class="mb-2 mt-2 flex flex-row items-center">
                                <Badge variant="secondary" class="mr-2 rounded-md">IRI</Badge><ItemLink :secondary-to="data.data.value" copy-link>{{ data.data.value }}</ItemLink>
                            </div>
                            <div class="flex flex-row gap-3" v-if="data?.data.rdfTypes">
                                <Badge variant="secondary" class="self-start rounded-md">Type</Badge>
                                <div>
                                    <div v-for="rdfType in data.data.rdfTypes"><Node :term="rdfType" /></div>
                                </div>
                            </div>
                        </slot>
                        <slot name="header-bottom" :data="data"></slot>
                    </slot>
                    <div class="mt-4 mb-12 overflow-auto">
                        <slot name="item-section" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">
                            <slot name="item-top" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>
                            <slot name="item-table" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">

                                <ItemTable
                                    :term="filteredData" 
                                    :key="urlPath + globalProfiles?.length + currentProfile?.uri" 
                                    :is-concept-scheme="isConceptScheme"
                                    :top-concepts-url="topConceptsUrl"
                                    :renderMarkdown="runtimeConfig.public.prezAutoDetectMarkdown"
                                />

                                <div v-if="hiddenData.properties" class="m-4 flex flex-col">
                                    <div :class="`w-full flex flex-row items-center justify-between border rounded-t p-2 text-sm cursor-pointer hover:bg-accent transition-all ${showHidden ? '' : 'rounded-b'}`" @click="showHidden = !showHidden">
                                        <span>Further metadata</span>
                                        <ChevronUp v-if="showHidden" class="size-4" />
                                        <ChevronDown v-else class="size-4" />
                                    </div>
                                    <div :class="`overflow-hidden transition-all ${showHidden ? 'h-auto' : 'h-0'}`">
                                        <ItemTable
                                            :term="hiddenData" 
                                            :key="urlPath + globalProfiles?.length + currentProfile?.uri" 
                                            :is-concept-scheme="isConceptScheme"
                                            :top-concepts-url="topConceptsUrl"
                                            :renderMarkdown="runtimeConfig.public.prezAutoDetectMarkdown"
                                        />
                                    </div>
                                </div>

                            </slot>
                            <slot name="item-middle" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>

                            <!-- <slot name="item-members" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">
                                <p class="mt-6" v-if="data.data.members">
                                    <Button as-child>
                                        <NuxtLink :to="data!.data.members!.value">Members</NuxtLink>
                                    </Button>
                                </p>
                            </slot> -->

                            <slot name="item-collections" :data="data" :is-concept-scheme="isConceptScheme">
                                <div class="mt-6" v-if="isConceptScheme && (data.data as PrezConceptSchemeNode).collections.length > 0">
                                    <p><b>Collections</b></p>
                                    <div class="mt-4 flex flex-col gap-2">
                                        <Node v-for="collection in (data.data as PrezConceptSchemeNode).collections" :term="collection" />
                                    </div>
                                </div>
                            </slot>

                            <slot name="item-concepts" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">
                                <div class="mt-6" v-if="isConceptScheme && topConceptsUrl != ''">
                                    <p><b>Concept Hierarchy</b></p>
                                    <div class="mt-4">
                                        <ConceptHierarchy
                                            :base-url="apiEndpoint" 
                                            :url-path="topConceptsUrl"
                                        />
                                    </div>
                                </div>
                            </slot>

                            <slot name="item-bottom" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>
                        </slot>
                    </div>
                </div>
                
                <slot name="bottom" :data="data" :status="status" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>
            </slot>
        </template>

        <template #sidepanel>
            <slot name="profiles" :data="data" :apiUrl="apiUrl" :status="status">
                <ItemProfiles :key="status" :objectUri="(route.query.uri as string)" :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" />
            </slot>
        </template>

    </NuxtLayout>
</template>