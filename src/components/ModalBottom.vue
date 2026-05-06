<template>
  <q-card-section
    class="row no-wrap items-center q-gutter-x-sm"
    :class="[
      (props.noTopSpace ? ' q-pt-none' : '') +
        (props.reverse ? ' reverse' : ''),
    ]"
  >
    <q-btn
      flat
      no-caps
      v-close-popup
      class="rounded col"
      color="primary"
      :label="t('close')"
      v-if="!props.noClose"
    />

    <slot></slot>
  </q-card-section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = withDefaults(defineProps<Props>(), {
  noClose: false,
  noTopSpace: false,
  reverse: false,
});

const { t } = useI18n();

interface Props {
  noClose?: boolean;
  noTopSpace?: boolean;
  reverse?: boolean;
}
</script>
