<script setup lang="ts">
import colors from 'tailwindcss/colors'
// import { debounce } from 'perfect-debounce'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const appConfig = useAppConfig()
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content', ['framework', 'module']))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('content'), {
  server: false
})

const searchTerm = ref('')

// watch(searchTerm, debounce((query: string) => {
//   if (!query) {
//     return
//   }

//   useTrackEvent('Search', { props: { query: `${query} - ${searchTerm.value?.commandPaletteRef.results.length} results` } })
// }, 500))

const links = useLinks()
const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')
const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)
const blackAsPrimary = computed(() => appConfig.theme.blackAsPrimary ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimary, id: 'nuxt-ui-black-as-primary', tagPriority: -2 }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI v3',
  title: String(props.error.statusCode)
})

useServerSeoMeta({
  ogSiteName: 'Nuxt UI',
  twitterCard: 'summary_large_image'
})

const { frameworks, modules } = useSharedData()
const { mappedNavigation, filteredNavigation } = useContentNavigation(navigation)

provide('navigation', mappedNavigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#FFF" />

    <!-- <Banner /> -->

    <Header :links="links" />

    <UError :error="error" />

    <!-- <Footer /> -->

    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="files"
        :groups="[{
          id: 'framework',
          label: 'Framework',
          items: frameworks
        }, {
          id: 'module',
          label: 'Module',
          items: modules
        }]"
        :navigation="filteredNavigation"
        :fuse="{ resultLimit: 100 }"
      />
    </ClientOnly>
  </UApp>
</template>
