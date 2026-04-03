<template>
  <q-dialog
    @hide="update"
    v-model="states.dialogs.view"
    position="bottom"
    persistent
  >
    <q-card style="width: 100%" class="rounded" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="row text-weight-bold items-center">
          <div>{{ version }}</div>

          <q-badge
            :label="status.text"
            :color="status.color"
            text-color="white"
            class="q-pa-sm text-weight-bold q-ml-sm rounded"
          />
        </q-toolbar-title>

        <q-btn
          flat
          icon="close"
          class="rounded"
          color="secondary"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="q-pt-none q-gutter-y-sm">
        <div
          class="row no-wrap items-end"
          :key="index"
          v-for="(item, index) in info"
        >
          <div class="">{{ item.label }}</div>

          <div class="col-grow q-mx-sm relative-position">
            <div class="dashed-line"></div>
          </div>

          <div class="q-mr-sm" v-if="item.countryCode || item.image">
            <country-flag
              v-if="item.countryCode"
              :code="item.countryCode"
              :fallback-src="item.image"
              :width="24"
              :height="18"
            />
            <q-img
              v-else-if="item.image"
              class="rounded"
              :src="item.image"
              spinner-color="secondary"
              style="height: 24px; width: 24px"
            />
          </div>

          <div class="ellipsis">{{ item.value }}</div>

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
          class="rounded col-12"
          unelevated
          color="secondary"
          :loading="loading.check"
          :label="t('check')"
          @click="checkProxy"
        />

        <q-btn
          dense
          no-caps
          class="rounded col-12"
          unelevated
          color="primary"
          :loading="loading.prolong"
          :label="t('prolong_proxy')"
          @click="prolongProxy"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { date } from 'quasar';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

import { fetchProxy } from 'boot/queries';

import CopyButton from 'components/CopyButton.vue';
import CountryFlag from 'components/CountryFlag.vue';

const { t } = useI18n();
const states = useStatesStore();
const data = useDataStore();

const loading = ref({
  check: false,
  prolong: false,
});

const status = computed(() =>
  data.selectedOrder.status_org === '1'
    ? {
        text: t('order_active'),
        color: 'green',
      }
    : data.selectedOrder.status_org === '2'
    ? {
        text: t('order_ended'),
        color: 'warning',
      }
    : {
        text: t('order_delete'),
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
    : 'MTProto'
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
    label: t('login'),
    value: data.selectedOrder.user,
    copy: true,
  },
  {
    label: t('password'),
    value: data.selectedOrder.pass,
    copy: true,
  },
  {
    label: 'IP',
    value: data.selectedOrder.ip,
    copy: true,
  },
  {
    label: t('country'),
    value: country.value,
    countryCode: data.selectedOrder.country.org_id,
    image: data.selectedOrder.country.image,
  },
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
    value: (data.selectedOrder.price / 100).toFixed(2) + ' ₽',
  },
]);

interface InfoProps {
  label: string;
  value: any;
  copy?: boolean;
  image?: string;
  countryCode?: string;
  change?: boolean;
}
</script>
