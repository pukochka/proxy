<template>
  <q-dialog
    v-model="states.dialogs.build"
    position="bottom"
    persistent
    @before-show="update"
    @hide="update"
  >
    <q-card style="width: 100%" class="rounded" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-bold">
          {{ data.selected.title }}
        </q-toolbar-title>

        <q-btn
          flat
          v-close-popup
          icon="close"
          class="rounded"
          color="secondary"
        />
      </q-toolbar>

      <q-card-section class="q-py-none q-gutter-y-md">
        <setting-item
          :key="index"
          :item="item"
          v-for="(item, index) in setting"
        ></setting-item>
      </q-card-section>

      <q-card-section class="q-py-sm" v-if="data.selected.version !== 5">
        <div class="text-size-16 text-center text-weight-bold">
          {{ t('typeOfProxy') }}
        </div>
      </q-card-section>

      <div class="relative-position">
        <q-card-section class="q-py-sm">
          <div class="" v-if="data.range.max > 0">
            <div class="row no-wrap items-end text-size-16">
              <div class="text-size-16 text-weight-bold">{{ t('result') }}</div>

              <div class="col-grow q-mx-sm relative-position">
                <div class="dashed-line"></div>
              </div>

              <div class="text-size-16 text-weight-bold">{{ price }} ₽</div>
            </div>
          </div>

          <div class="text-center" v-else>
            {{ t('range_warning') }}
          </div>
        </q-card-section>

        <div class="row q-px-md q-pb-md">
          <q-btn
            no-caps
            unelevated
            color="secondary"
            class="col rounded"
            :label="t('create_order')"
            :loading="loading"
            :disable="states.loadings.getPrice || data.range.max <= 0"
            @click="createOrder"
          />
        </div>

        <q-inner-loading
          :showing="states.loadings.getPrice || states.loadings.getCount"
        >
          <q-spinner size="30px" color="primary" />
        </q-inner-loading>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

import { fetchProxy } from 'boot/queries';

import { russiaCountry } from 'stores/defaults';

import SettingItem from 'components/SettingItem.vue';

const { t } = useI18n();
const states = useStatesStore();
const data = useDataStore();

const type = ref('http');
const loading = ref(false);

const price = computed(() => (data.payment.price / 100).toFixed(2));

const update = () => {
  data.selectedCountry = russiaCountry;
  data.selectedCount = 1;
  data.selectedDate = 30;
};

const createOrder = () => {
  loading.value = true;

  fetchProxy('buyProxy', {
    count: data.selectedCount.toString(),
    country: data.selectedCountry.org_id,
    period: data.selectedDate.toString(),
    version: data.selected.version,
    type: type.value,
    user_id: data.user.id,
    user_secret_key: data.systemUserValue.secret_user_key,
    public_key: config.public_key,
  }).then(() => (loading.value = false));
};

const setting = computed(() => [
  {
    label: t('country'),
    value:
      data.userValue.language === 'ru'
        ? data.selectedCountry.name_ru
        : data.selectedCountry.name_en,
    menu: 'country_menu',
    icon: data.selectedCountry?.image,
  },
  {
    label: t('quantity'),
    value: data.selectedCount,
    menu: 'count_menu',
  },
  {
    label: t('period'),
    value: Object.fromEntries(data.dateRange)?.[data.selectedDate],
    menu: 'date_menu',
  },
]);
</script>
