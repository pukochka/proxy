<template>
  <div class="q-gutter-y-md col relative-position">
    <div class="text-h6">
      {{ t('orders') }}
    </div>

    <div
      class="text-center text-size-20 q-pt-xl"
      v-if="data.orders.length === 0 && filtered === false"
    >
      {{ t('order_warning') }}
    </div>

    <div class="" v-else>
      <q-tabs
        dense
        no-caps
        align="justify"
        active-color="primary"
        class="rounded bordered q-mb-sm bg-blur"
        v-model="tab"
      >
        <div class="row full-width">
          <div class="col">
            <q-tab name="all" content-class="col" :label="t('all')" />
          </div>
          <div class="col">
            <q-tab name="active" content-class="col" :label="t('active')" />
          </div>
          <div class="col">
            <q-tab name="noActive" content-class="col" :label="t('noActive')" />
          </div>
        </div>
      </q-tabs>

      <choose-item
        :key="tab"
        stable-height
        search=""
        type="order"
        :elHeight="120"
        :visible-items="3"
        :current-items="ordersForTab"
      ></choose-item>
    </div>

    <q-inner-loading :showing="states.loadings.deleteProxy">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useDataStore } from 'stores/data/dataStore';
import { useStatesStore } from 'stores/states/statesStore';

import ChooseItem from 'components/menu/ChooseItem.vue';

import { mdiCalendarClockOutline } from '@quasar/extras/mdi-v7';
import { DefaultFilter } from 'stores/defaults';

const { t } = useI18n();
const data = useDataStore();
const states = useStatesStore();

const tab = ref('all');

/** Список из стора уже с учётом filterOrders; вкладки режут по status_org. */
const ordersForTab = computed(() => {
  const list = data.orders;
  if (tab.value === 'active') {
    return list.filter((o) => o.status_org === '1');
  }
  if (tab.value === 'noActive') {
    return list.filter((o) => o.status_org !== '1');
  }
  return list;
});

const filtered = computed(
  () =>
    JSON.stringify(data.filterOrders) !== JSON.stringify(new DefaultFilter())
);

const filtersMenu = computed(() => [
  {
    label: t('search_active'),
    action: () => data.findOrders('active', true),
    icon: 'notifications_active',
    close: true,
  },
  {
    label: t('search_end'),
    action: () => data.findOrders('ended', true),
    icon: mdiCalendarClockOutline,
    close: true,
  },
  {
    label: 'Proxy',
    action: () => states.openDialog('type_filter'),
    icon: 'rss_feed',
    close: true,
  },
]);
</script>
