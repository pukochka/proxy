<template>
  <q-dialog
    @before-show="update"
    v-model="states.dialogs.date_filter"
    :full-height="height"
  >
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-card-section class="q-pb-none">
        <q-date
          :subtitle="lang.selectRange"
          flat
          color="secondary"
          class="fit rounded-10"
          v-model="model"
          range
        />
      </q-card-section>

      <div class="row q-px-md q-pb-md">
        <q-btn
          unelevated
          dense
          no-caps
          class="rounded-10 col"
          color="secondary"
          :label="lang.findDate"
          @click="findOrders"
          v-close-popup
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useStatesStore } from 'stores/states/statesStore';
import { useQuasar } from 'quasar';
import { useLang } from 'src/utils/useLang';
import { useDataStore } from 'stores/data/dataStore';

const states = useStatesStore();
const data = useDataStore();
const lang = computed(() => useLang());
const quasar = useQuasar();

const model = ref<{ from: number; to: number } | null>(null);

const height = computed(() => quasar.screen.height < 550);

const findOrders = () => {
  const value = { from: 0, to: 0 };

  value.from = new Date(model.value?.from ?? 0).getTime() / 1000;
  value.to = new Date(model.value?.to ?? 0).getTime() / 1000;

  if (value.from === 0 || value.to === 0) return;

  data.findOrders('date', value);
};

const update = () => {
  if (data.filterOrders.date !== null) return;

  model.value = null;
};
</script>

<style lang="scss" scoped></style>
