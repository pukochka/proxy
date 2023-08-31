<template>
  <q-dialog @before-show="update" v-model="states.dialogs.type_filter">
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-card-section>
        <q-list separator dense bordered class="rounded-10 overflow-hidden">
          <q-item
            tag="label"
            v-for="(item, index) of proxy"
            :key="index"
            @click="selected = item.value"
          >
            <q-item-section avatar>
              <q-radio
                v-model="selected"
                :val="item.value"
                color="secondary"
                @click="selected = item.value"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-size-16 text-center">
                {{ item.label }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <div class="row q-px-md q-pb-md">
        <q-btn
          unelevated
          dense
          no-caps
          class="rounded-10 col"
          color="secondary"
          :label="lang.find"
          @click="data.findOrders('proxy', selected)"
          v-close-popup
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStatesStore } from 'stores/states/statesStore';
import { useLang } from 'src/utils/useLang';
import { useDataStore } from 'stores/data/dataStore';

const states = useStatesStore();
const data = useDataStore();
const lang = computed(() => useLang());

const selected = ref('');

const update = () => {
  if (data.filterOrders.proxy !== '') return;

  selected.value = '';
};

const proxy = [
  {
    label: 'IPv4 Shared',
    value: '3',
  },
  {
    label: 'IPv4',
    value: '4',
  },
  {
    label: 'IPv6',
    value: '6',
  },
];
</script>

<style lang="scss" scoped></style>
