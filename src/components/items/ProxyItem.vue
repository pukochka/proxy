<template>
  <q-item
    clickable
    class="rounded q-card--bordered bg-blur proxy-item-card"
    :class="glowModifierClass"
    @click="select"
  >
    <q-item-section class="q-gutter-y-sm proxy-item-card__content">
      <q-item-label class="text-center text-h5 text-weight-bold">
        {{ item.title }}
      </q-item-label>

      <div
        class="text-weight-bold text-caption text-center"
        v-if="props.item.title.includes('v6')"
      >
        {{ t('support_ipv6') }}
      </div>

      <div
        v-else-if="
          !props.item.title.includes('v6') &&
          !props.item.title.includes('MTproto')
        "
        class="text-weight-bold text-caption text-center"
      >
        {{ t('support_all') }}
      </div>

      <div
        class="text-weight-bold text-caption text-center"
        v-if="props.item.title.includes('MTproto')"
      >
        {{ t('telegramOnly') }}
      </div>

      <div
        class="text-weight-bold text-caption text-center"
        v-if="props.item.title.includes('Shared')"
      >
        {{ t('used_many') }}
      </div>

      <div v-else class="text-weight-bold text-caption text-center">
        {{ t('used_once') }}
      </div>
    </q-item-section>

    <q-item-section side class="proxy-item-card__content">
      <q-icon name="chevron_right" size="32px" />
    </q-item-section>

    <q-inner-loading :showing="loading" class="z-marginals">
      <q-spinner-ball size="64px" color="primary" />
    </q-inner-loading>
  </q-item>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { defaultProxyItem } from 'stores/defaults';
import { useDataStore } from 'stores/data/dataStore';
import { fetchProxy } from 'boot/queries';

const props = withDefaults(defineProps<ProxyItemProps>(), {
  item: () => defaultProxyItem,
});

const glowModifierClass = computed(() =>
  props.gradientVariant === undefined
    ? ''
    : `proxy-item-card--glow proxy-item-card--g${props.gradientVariant % 4}`
);

const { t } = useI18n();
const data = useDataStore();

const loading = ref(false);

const select = () => {
  data.select(props.item);
  loading.value = true;

  Promise.all([
    fetchProxy('getPrice', {
      version: data.selected.version,
      period: '30',
      count: '1',
      public_key: config.public_key,
    }),
    fetchProxy(
      'getCount',
      {
        version: data.selected.version,
        country: 'ca',
        user_secret_key: data.systemUserValue.secret_user_key,
        public_key: config.public_key,
      },
      true
    ),
  ]).then(() => (loading.value = false));
};

interface ProxyItemProps {
  item: ProxyItem;
  gradientVariant?: number;
}
</script>

<style lang="scss" scoped>
.proxy-item-card {
  position: relative;
  overflow: hidden;
}

.proxy-item-card--glow::before {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 0;
  width: 85%;
  height: 70%;
  top: -15%;
  right: -20%;
  opacity: 0.38;
  filter: blur(36px);
  transform: translateZ(0);
  background: linear-gradient(
    125deg,
    var(--proxy-g-a) 0%,
    var(--proxy-g-b) 55%,
    transparent 100%
  );
}

.proxy-item-card--g0 {
  --proxy-g-a: #8b9cff;
  --proxy-g-b: #5ee7df;
}

.proxy-item-card--g1 {
  --proxy-g-a: #f0abfc;
  --proxy-g-b: #fda4af;
}

.proxy-item-card--g2 {
  --proxy-g-a: #c4b5fd;
  --proxy-g-b: #93c5fd;
}

.proxy-item-card--g3 {
  --proxy-g-a: #86efac;
  --proxy-g-b: #5eead4;
}

.proxy-item-card__content {
  position: relative;
  z-index: 1;
}

.z-absolute {
  z-index: 0;
}

.z-focus {
  z-index: 1;
}
</style>
