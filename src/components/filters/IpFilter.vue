<template>
  <q-dialog @before-show="update" v-model="states.dialogs.ip_filter">
    <q-card style="width: 100%" class="rounded" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-bold">
          {{ t('search_ip') }}
        </q-toolbar-title>

        <q-btn
          flat
          class="rounded"
          size="md"
          color="secondary"
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="q-pt-none">
        <q-input
          autofocus
          dense
          no-caps
          v-model="filterIp"
          class="rounded q-px-md"
          :class="[states.itemBackgroundClass]"
          placeholder="IP Proxy"
          borderless
        />
      </q-card-section>

      <div class="row q-px-md q-pb-md">
        <q-btn
          unelevated
          dense
          class="rounded col"
          color="secondary"
          :label="t('find')"
          @click="findOrder"
          v-close-popup
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

const { t } = useI18n();
const states = useStatesStore();
const data = useDataStore();

const filterIp = ref('');

const findOrder = () => {
  if (filterIp.value === '') return;

  data.findOrders('ip', filterIp.value);
};

const update = () => {
  if (data.filterOrders.ip !== '') return;

  filterIp.value = '';
};
</script>


