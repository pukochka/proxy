<template>
  <q-btn
    outline
    size="11px"
    class="rounded"
    color="primary"
    :icon="state ? 'check' : 'content_copy'"
    @click="copy"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { copyToClipboard, Notify } from 'quasar';

const props = withDefaults(defineProps<Props>(), {
  text: () => '',
});

const { t } = useI18n();
const state = ref(false);

const copy = () => {
  state.value = true;

  copyToClipboard(props.text);

  Notify.create({
    message: t('copied'),
    position: 'top',
    classes: 'rounded',
    timeout: 500,
  });

  setTimeout(() => (state.value = false), 2000);
};

interface Props {
  text: string;
}
</script>
