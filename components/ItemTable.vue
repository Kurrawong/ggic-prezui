<script lang="ts" setup>
import { type PrezFocusNode } from "prez-lib";
import type { ItemTableProps } from "prez-components";

const props = defineProps<ItemTableProps>();
const term = props.term as PrezFocusNode;

const descPredicates = [
    "http://www.w3.org/2004/02/skos/core#definition",
];

const sortedProperties = computed(() => {
    if (term?.properties) {
        return Object.values(term.properties).sort((a, b) => {
            if (descPredicates.includes(a.predicate.value)) { // definition first
                return -1;
            } else if (descPredicates.includes(b.predicate.value)) {
                return 1;
            } else {
                return a.predicate.label?.value.localeCompare(b.predicate.label?.value);
            }
        });
    } else {
        return [];
    }
});
</script>

<template>
    <!-- ItemTable -->
    <Table v-if="term?.properties" class="item-table">
        <TableBody role="rowgroup">
            <ItemTableRow v-for="(fieldProp, index) in sortedProperties"
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
</template>