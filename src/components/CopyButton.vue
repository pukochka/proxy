<template>
  <q-btn
    unelevated
    class="rounded-10"
    padding="4px 8px"
    color="secondary"
    :icon="state ? 'check' : 'content_copy'"
    @click="copy"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { copyToClipboard, Notify } from 'quasar';
import { useLang } from 'src/utils/useLang';

const props = withDefaults(defineProps<Props>(), {
  text: () => '',
});

const state = ref(false);
const lang = computed(() => useLang());

const copy = () => {
  state.value = true;

  copyToClipboard(props.text);

  Notify.create({
    message: lang.value.copied,
    position: 'top',
    classes: 'rounded-10',
    timeout: 500,
  });

  setTimeout(() => (state.value = false), 2000);
};

interface Props {
  text: string;
}
</script>

<style lang="scss" scoped></style>
