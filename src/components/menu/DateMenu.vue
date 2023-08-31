<template>
  <q-dialog @before-show="update" v-model="states.dialogs.date_menu">
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-bold text-center">
          {{ data.selected.title }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-pt-none">
        <q-list separator dense bordered class="rounded-10 overflow-hidden">
          <q-item
            tag="label"
            v-for="([key, value], index) of data.dateRange"
            :key="index"
            @click="select(key)"
            v-close-popup
          >
            <q-item-section avatar>
              <q-radio
                v-model="selected"
                :val="key"
                color="secondary"
                @click="select(key)"
                v-close-popup
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-size-16 text-center">
                {{ value }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { ref } from 'vue';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

import { fetchProxy } from 'boot/queries';

const states = useStatesStore();
const data = useDataStore();

const selected = ref('30');

const select = (date: string) => {
  if (
    selected.value === data.selectedDate.toString() ||
    states.loadings.getPrice
  )
    return;

  selected.value = date;
  data.selectedDate = Number(date);

  fetchProxy('getPrice', {
    version: data.selected.version,
    period: data.selectedDate.toString(),
    count: data.selectedCount.toString(),
    public_key: config.public_key,
  }).then();
};

const update = () => {
  Object.fromEntries(data.dateRange)[data.selectedDate] === void 0
    ? (selected.value = '30')
    : (selected.value = data.selectedDate.toString());
};
</script>

<style lang="scss" scoped></style>
