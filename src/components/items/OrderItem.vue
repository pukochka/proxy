<template>
  <q-item
    style="height: 120px"
    :class="[states.itemBackgroundClass]"
    class="column"
  >
    <div class="row no-wrap col-grow">
      <q-item-section class="items-center" avatar>
        <q-avatar square class="rounded">
          <q-img :src="item.country.image" spinner-color="primary" />
        </q-avatar>

        <q-badge
          class="full-width text-center"
          color="orange"
          text-color="black"
          :label="version"
        />
      </q-item-section>

      <q-item-section>
        <div
          class="row no-wrap items-end"
          v-for="(item, index) in info"
          :key="index"
        >
          <div class="">{{ item.label }}</div>

          <div class="col-grow q-mx-sm relative-position">
            <div class="dashed-line"></div>
          </div>

          <div class="ellipsis">{{ item.value }}</div>
        </div>
      </q-item-section>
    </div>

    <div class="row justify-end q-gutter-x-sm q-pt-xs">
      <q-btn
        no-caps
        unelevated
        class="rounded"
        color="red"
        :label="t('delete')"
        @click="data.deleteProxy(item.order_org_id)"
      />

      <q-btn
        no-caps
        unelevated
        class="rounded"
        color="secondary"
        :label="t('details')"
        @click="openDetails"
      />
    </div>
  </q-item>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import { defaultProxyOrder } from 'stores/defaults';
import { date } from 'quasar';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

const props = withDefaults(defineProps<OrderItemProps>(), {
  item: () => defaultProxyOrder,
});

const { t } = useI18n();
const states = useStatesStore();
const data = useDataStore();

const version = computed(() =>
  props.item.proxy === '3'
    ? 'IPv4 Shared'
    : props.item.proxy === '4'
    ? 'IPv4'
    : props.item.proxy === '6'
    ? 'IPv6'
    : ''
);

const createAt = computed(() =>
  date.formatDate(props.item.start_time * 1000, 'DD-MM-YYYY HH:mm')
);

const endAt = computed(() =>
  date.formatDate(props.item.end_time * 1000, 'DD-MM-YYYY HH:mm')
);

const openDetails = () => {
  data.selectedOrder = props.item;

  states.openDialog('view');
};

const info = computed(() => [
  {
    label: t('date'),
    value: createAt.value,
  },

  {
    label: t('end'),
    value: endAt.value,
  },

  {
    label: t('price'),
    value: (props.item.price / 100).toFixed(2) + ' ₽',
  },
]);

interface OrderItemProps {
  item: ProxyOrder;
}
</script>
