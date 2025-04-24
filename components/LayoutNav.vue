<script lang="ts" setup>
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
</script>

<template>
    <div class="border border-[#a5a5a5] relative bg-primary">
        <nav class="main-nav container font-extralight mx-auto hidden md:flex md:flex-row text-xs uppercase px-4">
            <NuxtLink
                v-for="{ label, url } in appConfig.menu.filter(item => item.active !== false)"
                :to="url"
                :class="`p-[14px] border-l last:border-r border-[#a5a5a5] hover:bg-secondary hover:text-secondary-foreground transition-all ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'bg-secondary text-secondary-foreground' : ''}`"
            >{{ label }}</NuxtLink>
        </nav>
    </div>
</template>
