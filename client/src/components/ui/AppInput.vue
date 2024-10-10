<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  modelValue?: unknown
}>()

const emit = defineEmits(['update:modelValue'])
const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <input v-bind="$attrs" :class="`px-2 ${$attrs.class}`" :value="modelValue" @input="updateValue" />
</template>
