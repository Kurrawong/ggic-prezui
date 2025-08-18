<script lang="ts" setup>
import { Menu, X } from "lucide-vue-next";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

const navOpen = ref(false);
</script>

<template>
    <div class="border border-[#a5a5a5] relative bg-primary">
        <Button variant="ghost" size="icon" class="md:hidden" @click="navOpen = !navOpen">
            <X v-if="navOpen" />
            <Menu v-else />
        </Button>
        <nav :class="`main-nav md:container mx-auto flex flex-col md:flex-row text-xs uppercase md:px-4 ${navOpen ? 'h-auto' : 'h-0'} overflow-hidden md:h-auto`">
            <NuxtLink
                v-for="{ label, url } in appConfig.menu.filter(item => item.active !== false)"
                :to="url"
                :class="`p-[14px] border-[#a5a5a5] border-b last:border-b-0 md:border-b-0 md:border-l md:last:border-r hover:bg-secondary hover:text-secondary-foreground transition-all ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'bg-secondary text-secondary-foreground' : ''}`"
            >{{ label }}</NuxtLink>
        </nav>
    </div>
</template>
