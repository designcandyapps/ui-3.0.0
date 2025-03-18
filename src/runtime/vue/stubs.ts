import { ref } from 'vue'
import type { Ref, Plugin as VuePlugin } from 'vue'

import appConfig from '#build/app.config'
import type { NuxtApp } from '#app'
import { useColorMode as useColorModeVueUse } from '@vueuse/core'

export { useHead } from '@unhead/vue'
export { useRoute, useRouter } from 'vue-router'

export { defineShortcuts } from '../composables/defineShortcuts'
export { defineLocale } from '../composables/defineLocale'
export { useLocale } from '../composables/useLocale'

export const useColorMode = () => {
  if (!appConfig.colorMode) {
    return {
      forced: true
    }
  }

  const { store, system } = useColorModeVueUse()

  return {
    get preference() { return store.value === 'auto' ? 'system' : store.value },
    set preference(value) { store.value = value === 'system' ? 'auto' : value },
    get value() { return store.value === 'auto' ? system.value : store.value },
    forced: false
  }
}

export const useAppConfig = () => appConfig

export const useCookie = <T = string>(
  _name: string,
  _options: Record<string, any> = {}
) => {
  const value = ref(null) as Ref<T>

  return {
    value,
    get: () => value.value,
    set: () => {},
    update: () => {},
    refresh: () => Promise.resolve(value.value),
    remove: () => {}
  }
}

const state: Record<string, any> = {}

export const useState = <T>(key: string, init: () => T): Ref<T> => {
  if (state[key]) {
    return state[key] as Ref<T>
  }
  const value = ref(init())
  state[key] = value
  return value as Ref<T>
}

export function useNuxtApp() {
  return {
    isHydrating: true,
    isVue: true,
    payload: { serverRendered: false }
  }
}

export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void) {
  return {
    install(app) {
      plugin({ vueApp: app } as NuxtApp)
    }
  } satisfies VuePlugin
}
