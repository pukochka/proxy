<template>
  <q-dialog
    v-model="states.dialogs.build"
    position="bottom"
    persistent
    @before-show="update"
    @hide="update"
  >
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-bold">
          {{ data.selected.title }}
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

      <q-card-section class="q-py-none q-gutter-y-sm">
        <setting-item
          v-for="(item, index) in setting"
          :key="index"
          :item="item"
        ></setting-item>
      </q-card-section>

      <q-card-section class="q-py-sm">
        <div class="text-size-16 q-py-sm">{{ lang.type }}</div>

        <div class="row">
          <q-item tag="label" dense class="col rounded-10">
            <q-radio
              v-model="type"
              color="secondary"
              val="http"
              label="HTTPs"
            />
          </q-item>

          <q-item tag="label" dense class="col rounded-10">
            <q-radio
              v-model="type"
              color="secondary"
              val="socks"
              label="SOCKS5"
            />
          </q-item>
        </div>
      </q-card-section>

      <div class="relative-position">
        <q-card-section class="q-py-sm">
          <div class="" v-if="data.range.max > 0">
            <div class="row no-wrap items-end text-size-16">
              <div class="text-size-16 text-weight-bold">{{ lang.result }}</div>

              <div class="col-grow q-mx-sm relative-position">
                <div class="dashed-line"></div>
              </div>

              <div class="text-size-16 text-weight-bold">{{ price }} ₽</div>
            </div>
          </div>

          <div class="text-center" v-else>
            {{ lang.range_warning }}
          </div>
        </q-card-section>

        <div class="row q-px-md q-pb-md">
          <q-btn
            unelevated
            no-caps
            class="col rounded-10"
            size="md"
            :disable="states.loadings.getPrice || data.range.max <= 0"
            :label="lang.create_order"
            :loading="loading"
            color="secondary"
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

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';
import { useLang } from 'src/utils/useLang';

import { fetchProxy } from 'boot/queries';

import { russiaCountry } from 'stores/defaults';

import SettingItem from 'components/SettingItem.vue';

const states = useStatesStore();
const data = useDataStore();
const lang = computed(() => useLang());

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
    label: lang.value.country,
    value:
      data.userValue.language === 'ru'
        ? data.selectedCountry.name_ru
        : data.selectedCountry.name_en,
    menu: 'country_menu',
    icon: data.selectedCountry?.image,
  },
  {
    label: lang.value.quantity,
    value: data.selectedCount,
    menu: 'count_menu',
  },
  {
    label: lang.value.period,
    value: Object.fromEntries(data.dateRange)?.[data.selectedDate],
    menu: 'date_menu',
  },
]);
</script>

<style lang="scss" scoped></style>
