<template>
  <q-item
    class="rounded-10 q-list--bordered"
    :class="[states.itemBackgroundClass]"
  >
    <q-item-section class="q-gutter-y-sm">
      <q-item-label class="text-center text-size-24 text-weight-bold">
        {{ item.title }}
      </q-item-label>

      <div
        class="q-list--bordered q-px-xs rounded-10 text-size-13 text-weight-bold relative-position overflow-hidden"
        v-for="(item, index) in info"
        :key="index"
      >
        <div class="opacity-5 absolute-full" :class="[item.class]"></div>

        <div class="relative-position text-center">
          {{ item.label }}
        </div>
      </div>
    </q-item-section>

    <q-item-section side>
      <q-btn
        unelevated
        size="md"
        class="rounded-10 fit"
        color="secondary"
        :label="lang.buy"
        :loading="loading"
        @click="select"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';

import { defaultProxyItem } from 'stores/defaults';
import { useDataStore } from 'stores/data/dataStore';
import { useLang } from 'src/utils/useLang';
import { fetchProxy } from 'boot/queries';
import { useStatesStore } from 'stores/states/statesStore';

const props = withDefaults(defineProps<ProxyItemProps>(), {
  item: () => defaultProxyItem,
});

const data = useDataStore();
const states = useStatesStore();
const lang = computed(() => useLang());

const loading = ref(false);

const support = computed(() =>
  props.item.title.includes('v6')
    ? lang.value.support_ipv6
    : lang.value.support_all
);

const used = computed(() =>
  props.item.title.includes('Shared')
    ? lang.value.used_many
    : lang.value.used_once
);

const info = [
  {
    label: support.value,
    class: props.item.title.includes('IPv6') ? 'bg-warning ' : 'bg-secondary',
  },
  {
    label: used.value,
    class: props.item.title.includes('Shared') ? 'bg-warning' : 'bg-secondary',
  },
];

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
        country: 'ru',
        user_secret_key: data.systemUserValue.secret_user_key,
        public_key: config.public_key,
      },
      true
    ),
  ]).then(() => (loading.value = false));
};

interface ProxyItemProps {
  item: ProxyItem;
}
</script>

<style lang="scss" scoped>
.z-absolute {
  z-index: 0;
}

.z-focus {
  z-index: 1;
}
</style>
