<template>
  <span
    v-if="useCssFlag"
    class="fi country-flag-display rounded-borders"
    :class="[flagClass, { fis: squared }]"
    role="img"
    :style="boxStyle"
  />
  <q-img
    v-else-if="resolvedFallback"
    class="rounded"
    :src="resolvedFallback"
    spinner-color="primary"
    :style="boxStyle"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    code: string;
    fallbackSrc?: string;
    width?: number;
    height?: number;
    squared?: boolean;
  }>(),
  {
    code: '',
    fallbackSrc: '',
    width: 24,
    height: 18,
    squared: false,
  }
);

const isoCode = computed(() => props.code.trim().toLowerCase());

const useCssFlag = computed(() => /^[a-z]{2}$/.test(isoCode.value));

const flagClass = computed(() =>
  useCssFlag.value ? `fi-${isoCode.value}` : ''
);

const resolvedFallback = computed(() => {
  const s = (props.fallbackSrc || '').trim();
  if (!s) return '';
  if (s.startsWith('//')) return `https:${s}`;
  return s;
});

const boxStyle = computed(() => {
  const w = props.width;
  const h = props.squared ? props.width : props.height;
  return {
    width: `${w}px`,
    height: `${h}px`,
  };
});
</script>

<style scoped>
.country-flag-display {
  display: inline-block;
  box-sizing: border-box;
  vertical-align: middle;
  background-size: cover;
  background-position: center;
}
</style>
