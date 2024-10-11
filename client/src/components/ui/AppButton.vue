<script lang="ts" setup>
type Variant = 'default' | 'danger'
const { variant } = defineProps<{ variant?: Variant }>()

const getStyle = (variant: Variant = 'default') => {
  switch (variant) {
    case 'default':
      return 'bg-[#1D0455] text-white rounded-lg px-3 py-1 shadow-md hover:shadow-xl'
    case 'danger':
      return 'text-sm text-red-800 block rounded-lg px-3 py-1 hover:underline'
  }
}

const baseClass = getStyle(variant)
</script>

<template>
  <button v-bind="$attrs" :class="`${baseClass} ${$attrs.class}`">
    <slot></slot>
  </button>
</template>
