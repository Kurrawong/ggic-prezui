<script lang="ts" setup>
import { type PrezFocusNode, DEFAULT_PREFIXES } from 'prez-lib';
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import type { ItemTableProps } from "prez-components";

const props = defineProps<ItemTableProps>();
const term = props.term as PrezFocusNode;

// const fieldNames = Object.keys(term.properties || {});

// const fields = computed(()=>
//     [...(props.fields || []).filter(f => fieldNames.includes(f.node.value)).map(f=>f.node.value),    // add fields that are in the list
//     ...fieldNames.filter(fname => !(props.fields || []).find(f=>f.node.value == fname))              // add the rest of the fields that are not in the list
//     ].filter(f=>f in (term.properties || {})).map(f=>term.properties![f] as PrezProperty)
// );

const allowedPredicates = [
    `${DEFAULT_PREFIXES.skos}definition`,
    `${DEFAULT_PREFIXES.skos}broader`,
    `${DEFAULT_PREFIXES.skos}narrower`,
    `${DEFAULT_PREFIXES.skos}inScheme`,
    `${DEFAULT_PREFIXES.skos}member`,
    `${DEFAULT_PREFIXES.dcterms}creator`,
    `${DEFAULT_PREFIXES.dcterms}created`,
    `${DEFAULT_PREFIXES.dcterms}modified`,
    `${DEFAULT_PREFIXES.dcterms}publisher`,
    `${DEFAULT_PREFIXES.owl}versionInfo`,
    `${DEFAULT_PREFIXES.sdo}creator`,
    `${DEFAULT_PREFIXES.sdo}dateCreated`,
    `${DEFAULT_PREFIXES.sdo}dateModified`,
    `${DEFAULT_PREFIXES.sdo}publisher`,
];

const showHidden = ref(false);

const filteredProperties = computed(() => {
    if (term?.properties) {
        return Object.entries(term.properties)
            .filter(([key, value]) => allowedPredicates.includes(key))
            .map(([key, value]) => value)
            .sort((a, b) => {
            if (a.predicate.value === `${DEFAULT_PREFIXES.skos}definition`) { // definition first
                return -1;
            } else if (b.predicate.value === `${DEFAULT_PREFIXES.skos}definition`) {
                return 1;
            } else {
                return a.predicate.label.value.localeCompare(b.predicate.label.value);
            }
        });
    } else {
        return [];
    }
});

const hiddenProperties = computed(() => {
    if (term?.properties) {
        return Object.entries(term.properties)
            .filter(([key, value]) => !allowedPredicates.includes(key))
            .map(([key, value]) => value)
            .sort((a, b) => a.predicate.label.value.localeCompare(b.predicate.label.value));
    } else {
        return [];
    }
});
</script>

<template>
    <!-- ItemTable -->
    <Table v-if="term?.properties" class="item-table w-full">
        <TableBody role="rowgroup">
            <ItemTableRow v-for="(fieldProp, index) in filteredProperties"
                :key="fieldProp?.predicate.value" 
                :index="index"
                :term="term" 
                :objects="fieldProp ? fieldProp.objects : []" 
                :predicate="fieldProp!.predicate"
                :renderHtml="props.renderHtml"
                :renderMarkdown="props.renderMarkdown"
            />
        </TableBody>
    </Table>
    <div class="m-4 flex flex-col">
        <div :class="`w-full flex flex-row items-center justify-between border rounded-t p-2 text-sm cursor-pointer hover:bg-accent transition-all ${showHidden ? '' : 'rounded-b'}`" @click="showHidden = !showHidden">
            <span>Extra properties</span>
            <ChevronUp v-if="showHidden" class="size-4" />
            <ChevronDown v-else class="size-4" />
        </div>
        <div :class="`overflow-hidden transition-all ${showHidden ? 'h-auto' : 'h-0'}`">
            <Table v-if="term?.properties" class="item-table w-full">
                <TableBody role="rowgroup">
                    <ItemTableRow v-for="(fieldProp, index) in hiddenProperties"
                        :key="fieldProp?.predicate.value" 
                        :index="index"
                        :term="term" 
                        :objects="fieldProp ? fieldProp.objects : []" 
                        :predicate="fieldProp!.predicate"
                        :renderHtml="props.renderHtml"
                        :renderMarkdown="props.renderMarkdown"
                    />
                </TableBody>
            </Table>
        </div>
    </div>
</template>