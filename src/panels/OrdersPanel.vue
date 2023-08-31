<template>
  <div class="q-gutter-y-md col relative-position">
    <div class="text-center text-size-30 text-weight-bold">
      {{ lang.orders }}
    </div>

    <div
      class="text-center text-size-20 q-pt-xl"
      v-if="data.orders.length === 0 && filtered === false"
    >
      {{ lang.order_warning }}
    </div>

    <div class="" v-else>
      <div class="row justify-between q-py-sm">
        <q-btn
          dense
          unelevated
          no-caps
          icon="tune"
          class="rounded-10"
          color="secondary"
          :label="lang.filter"
        >
          <q-menu class="no-shadow q-list--bordered non-selectable">
            <q-list dense separator style="max-width: 200px">
              <q-item
                clickable
                v-close-popup="filter.close"
                v-for="(filter, index) in filtersMenu"
                :key="index"
                @click="filter.action"
              >
                <q-item-section avatar>
                  <q-icon :name="filter.icon" color="secondary" size="22px" />
                </q-item-section>

                <q-item-section>{{ filter.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          dense
          unelevated
          no-caps
          v-if="filtered"
          icon="close"
          class="rounded-10"
          color="secondary"
          :label="lang.clear"
          @click="data.nullifyFilter"
        />
      </div>

      <choose-item
        :elHeight="120"
        :visible-items="3"
        search=""
        stable-height
        type="order"
        :current-items="data.orders"
      ></choose-item>
    </div>

    <q-inner-loading :showing="states.loadings.deleteProxy">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useLang } from 'src/utils/useLang';
import { useDataStore } from 'stores/data/dataStore';
import { useStatesStore } from 'stores/states/statesStore';

import ChooseItem from 'components/menu/ChooseItem.vue';

import { mdiCalendarClockOutline } from '@quasar/extras/mdi-v7';
import { DefaultFilter } from 'stores/defaults';

const lang = computed(() => useLang());
const data = useDataStore();
const states = useStatesStore();

const filtered = computed(
  () =>
    JSON.stringify(data.filterOrders) !== JSON.stringify(new DefaultFilter())
);

const filtersMenu = computed(() => [
  {
    label: lang.value.search_ip,
    action: () => states.openDialog('ip_filter'),
    icon: 'alternate_email',
    close: true,
  },
  {
    label: lang.value.search_date,
    action: () => states.openDialog('date_filter'),
    icon: 'calendar_month',
    close: true,
  },
  {
    label: lang.value.search_active,
    action: () => data.findOrders('active', true),
    icon: 'notifications_active',
    close: true,
  },
  {
    label: lang.value.search_end,
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

  {
    label: lang.value.multiply,
    action: () => (data.multiply = !data.multiply),
    icon: data.multiply ? 'check_box' : 'check_box_outline_blank',
    close: false,
  },
]);
</script>

<style lang="scss" scoped></style>
