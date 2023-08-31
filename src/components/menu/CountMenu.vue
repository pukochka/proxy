<template>
  <q-dialog @before-show="update" v-model="states.dialogs.count_menu">
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-bold text-center">
          {{ data.selected.title }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-pt-none" style="min-height: 150px">
        <div class="" v-if="data.range.max >= 1 && loading === false">
          <q-item-label header class="text-center text-size-16">
            {{ lang.quantity }}
          </q-item-label>

          <q-slider
            v-model="count"
            :min="data.range.min"
            :max="data.range.max"
            color="secondary"
            track-size="14px"
            thumb-color="primary"
          />

          <div class="row no-wrap justify-between items-center">
            <q-btn
              v-touch-repeat:0:200.mouse.enter.space="decrease"
              flat
              size="lg"
              class="rounded-10"
              color="secondary"
              icon="remove"
              @click="decrease"
            />

            <div class="text-size-20">{{ count }}</div>

            <q-btn
              v-touch-repeat:0:200.mouse.enter.space="increase"
              flat
              size="lg"
              class="rounded-10"
              color="secondary"
              icon="add"
              @click="increase"
            />
          </div>
        </div>

        <div
          class="q-py-xl text-center"
          v-if="loading === false && data.range.max < 1"
        >
          {{ lang.range_warning }}
        </div>

        <q-inner-loading :showing="loading" class="z-max">
          <q-spinner size="50px" color="secondary" />
        </q-inner-loading>
      </q-card-section>

      <div class="row q-px-md q-pb-md">
        <q-btn
          v-if="data.range.max >= 1 && loading === false"
          no-caps
          unelevated
          class="col rounded-10"
          size="md"
          color="secondary"
          :label="lang.apply"
          @click="select"
          v-close-popup
        />

        <q-btn
          v-if="data.range.max < 1 && loading === false"
          no-caps
          unelevated
          class="col rounded-10"
          size="md"
          color="secondary"
          :label="lang.close"
          v-close-popup
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';

import { fetchProxy } from 'boot/queries';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';
import { useLang } from 'src/utils/useLang';

const states = useStatesStore();
const data = useDataStore();
const lang = computed(() => useLang());

const count = ref(1);
const loading = ref(false);

const increase = () => {
  if (count.value >= data.range.max) return;
  count.value++;
};

const decrease = () => {
  if (count.value <= data.range.min) return;
  count.value--;
};

const select = () => {
  data.selectedCount = count.value;

  fetchProxy('getPrice', {
    version: data.selected.version,
    period: data.selectedDate.toString(),
    count: data.selectedCount.toString(),
    public_key: config.public_key,
  }).then();
};

const update = () => {
  loading.value = true;

  fetchProxy('getCount', {
    version: data.selected.version,
    country: data.selectedCountry.org_id,
    user_secret_key: data.systemUserValue.secret_user_key,
    public_key: config.public_key,
  }).then(() => {
    loading.value = false;
    count.value = data.range.min;
  });
};
</script>

<style lang="scss" scoped></style>
