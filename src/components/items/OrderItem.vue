<template>
  <q-item
    style="height: 120px"
    :class="[states.itemBackgroundClass]"
    class="column"
  >
    <div class="row no-wrap col-grow">
      <q-item-section class="items-center" avatar>
        <q-avatar size="md" square class="rounded-10">
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
        class="rounded-10"
        color="red"
        :label="lang.delete"
        @click="data.deleteProxy(item.order_org_id)"
      />

      <q-btn
        no-caps
        unelevated
        class="rounded-10"
        size="md"
        color="secondary"
        :label="lang.details"
        @click="openDetails"
      />
    </div>
  </q-item>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { defaultProxyOrder } from 'stores/defaults';
import { date } from 'quasar';

import { useStatesStore } from 'stores/states/statesStore';
import { useDialog } from 'src/utils/useDialog';
import { fetchProxy } from 'boot/queries';
import { useDataStore } from 'stores/data/dataStore';
import { useLang } from 'src/utils/useLang';

const props = withDefaults(defineProps<OrderItemProps>(), {
  item: () => defaultProxyOrder,
});

const states = useStatesStore();
const data = useDataStore();
const lang = computed(() => useLang());

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
    label: lang.value.date,
    value: createAt.value,
  },

  {
    label: lang.value.end,
    value: endAt.value,
  },

  {
    label: lang.value.price,
    value: (props.item.price / 100).toFixed(2) + ' ₽',
  },
]);

interface OrderItemProps {
  item: ProxyOrder;
}
</script>

<style lang="scss" scoped></style>
