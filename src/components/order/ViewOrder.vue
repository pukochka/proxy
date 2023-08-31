<template>
  <q-dialog
    @hide="update"
    v-model="states.dialogs.view"
    position="bottom"
    persistent
  >
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="row text-weight-bold items-center">
          <div class="">{{ version }}</div>

          <q-badge
            class="q-pa-sm text-weight-bold q-ml-sm rounded-10"
            :color="status.color"
            text-color="white"
            :label="status.text"
          />
        </q-toolbar-title>

        <q-btn
          flat
          class="rounded-10"
          size="md"
          color="secondary"
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="q-pt-none q-gutter-y-sm">
        <div
          class="row no-wrap items-end"
          v-for="(item, index) in info"
          :key="index"
        >
          <div class="">{{ item.label }}</div>

          <div class="col-grow q-mx-sm relative-position">
            <div class="dashed-line"></div>
          </div>

          <div class="q-mr-sm" v-if="item.image">
            <q-img
              class="rounded-10"
              :src="item.image"
              spinner-color="secondary"
              style="height: 24px; width: 24px"
            />
          </div>

          <div class="ellipsis">{{ item.value }}</div>

          <q-btn
            v-if="item.change"
            no-caps
            unelevated
            class="rounded-10 q-ml-sm"
            padding="4px"
            color="secondary"
            :loading="states.loadings.updateType"
            :label="lang.change"
            @click="states.openDialog('type_menu')"
          />

          <copy-button
            class="q-ml-sm"
            v-if="item.copy"
            :text="item.value"
          ></copy-button>
        </div>
      </q-card-section>

      <div class="row q-gutter-y-sm q-px-md q-pb-md">
        <q-btn
          dense
          no-caps
          class="rounded-10 col-12"
          unelevated
          size="md"
          color="secondary"
          :loading="loading.check"
          :label="lang.check"
          @click="checkProxy"
        />

        <q-btn
          dense
          no-caps
          class="rounded-10 col-12"
          unelevated
          size="md"
          color="primary"
          :loading="loading.prolong"
          :label="lang.prolong_proxy"
          @click="prolongProxy"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';
import { date } from 'quasar';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';
import { useLang } from 'src/utils/useLang';

import { fetchProxy } from 'boot/queries';

import CopyButton from 'components/CopyButton.vue';

const states = useStatesStore();
const data = useDataStore();
const lang = computed(() => useLang());

const loading = ref({
  check: false,
  prolong: false,
});

const status = computed(() =>
  data.selectedOrder.status_org === '1'
    ? {
        text: lang.value.order_active,
        color: 'green',
      }
    : data.selectedOrder.status_org === '2'
    ? {
        text: lang.value.order_ended,
        color: 'warning',
      }
    : {
        text: lang.value.order_delete,
        color: 'red',
      }
);

const version = computed(() =>
  data.selectedOrder.proxy === '3'
    ? 'IPv4 Shared'
    : data.selectedOrder.proxy === '4'
    ? 'IPv4'
    : data.selectedOrder.proxy === '6'
    ? 'IPv6'
    : ''
);

const type = computed(() =>
  data.selectedOrder.type === 'http' ? 'HTTPs' : 'SOCKS5'
);

const country = computed(
  () =>
    data.selectedOrder.country[
      data.userValue.language === 'ru' ? 'name_ru' : 'name_en'
    ]
);

const createAt = computed(() =>
  date.formatDate(data.selectedOrder.start_time * 1000, 'DD-MM-YYYY HH:mm')
);

const endAt = computed(() =>
  date.formatDate(data.selectedOrder.end_time * 1000, 'DD-MM-YYYY HH:mm')
);

const prolongProxy = () => {
  loading.value.prolong = true;

  fetchProxy(
    'getPrice',
    {
      version: data.selectedOrder.proxy,
      period: '30',
      count: '1',
      public_key: config.public_key,
    },
    true
  ).then(() => (loading.value.prolong = false));
};

const checkProxy = () => {
  loading.value.check = true;

  fetchProxy('checkWork', {
    order_org_id: data.selectedOrder.order_org_id,
    user_id: data.user.id,
    user_secret_key: data.systemUserValue.secret_user_key,
    public_key: config.public_key,
  }).then(() => (loading.value.check = false));
};

const update = () => {
  fetchProxy('getOrders', {
    user_id: data.userValue.id,
    public_key: config.public_key,
    user_secret_key: data.systemUserValue.secret_user_key,
  });
};

const info = computed((): InfoProps[] => [
  {
    label: 'Proxy',
    value: data.selectedOrder.host + ':' + data.selectedOrder.port,
    copy: true,
  },
  {
    label: lang.value.login,
    value: data.selectedOrder.user,
    copy: true,
  },
  {
    label: lang.value.password,
    value: data.selectedOrder.pass,
    copy: true,
  },
  {
    label: 'IP',
    value: data.selectedOrder.ip,
    copy: true,
  },
  {
    label: lang.value.type,
    value: type.value,
    change: true,
  },
  {
    label: lang.value.country,
    value: country.value,
    image: data.selectedOrder.country.image,
  },
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
    value: (data.selectedOrder.price / 100).toFixed(2) + ' ₽',
  },
]);

interface InfoProps {
  label: string;
  value: any;
  copy?: boolean;
  image?: string;
  change?: boolean;
}
</script>

<style lang="scss" scoped></style>
