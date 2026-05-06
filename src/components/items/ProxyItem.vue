<template>
  <q-item
    clickable
    class="rounded bordered bg-blur"
    :class="props.item.version === '4' ? ' bordered-popular' : ''"
    @click="select"
  >
    <q-item-section side>
      <CustomEmoji :src="proxyIcons[props.item.version]" :size="64" alt="" />
    </q-item-section>

    <q-item-section class="q-gutter-y-sm">
      <q-item-label>
        <span class="text-h4">{{ item.title }} </span>

        <span class="text-h6 text-primary"> {{ ' ' + t('proxy') }}</span>
      </q-item-label>

      <q-item-label caption>
        {{ proxyDescriptions[props.item.version] }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon name="chevron_right" color="primary" size="32px" />
    </q-item-section>

    <div
      v-if="props.item.version === '4'"
      class="absolute-top-right text-caption bg-primary text-white text-weight-bold rounded-bottom q-px-xs q-mr-md"
    >
      ⚡ {{ t('popular') }}
    </div>

    <q-inner-loading :showing="loading" class="z-marginals">
      <q-spinner-ball size="64px" color="primary" />
    </q-inner-loading>
  </q-item>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { defaultProxyItem } from 'stores/defaults';
import { useDataStore } from 'stores/data/dataStore';
import { fetchProxy } from 'boot/queries';
import CustomEmoji from 'components/emoji/CustomEmoji.vue';

const props = withDefaults(defineProps<ProxyItemProps>(), {
  item: () => defaultProxyItem,
});

const linkUrl = new URL('../../assets/Link.tgs', import.meta.url).href;
const earthUrl = new URL('../../assets/Earth.tgs', import.meta.url).href;
const planeUrl = new URL('../../assets/Plane.tgs', import.meta.url).href;
const diamondUrl = new URL('../../assets/Diamond.tgs', import.meta.url).href;

const proxyIcons = {
  '3': diamondUrl,
  '4': earthUrl,
  '5': planeUrl,
  '6': linkUrl,
};

const { t } = useI18n();
const data = useDataStore();

const proxyDescriptions = {
  '3': t('ipv4shared'),
  '4': t('ipv4'),
  '5': t('mtproto'),
  '6': t('ipv6'),
};

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
