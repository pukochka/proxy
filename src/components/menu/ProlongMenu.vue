<template>
  <q-dialog v-model="states.dialogs.prolong_menu">
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-bold text-center">
          {{ lang.select_prolog }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-pt-none">
        <q-list separator dense bordered class="rounded-10 overflow-hidden">
          <q-item
            tag="label"
            v-for="([key, value], index) of data.prolongRange"
            :key="index"
            @click="select(key)"
          >
            <q-item-section avatar>
              <q-radio
                v-model="selected"
                :val="key"
                color="secondary"
                @click="select(key)"
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

      <q-card-section class="q-pt-none">
        <div class="row no-wrap items-end text-size-16">
          <div class="text-size-16 text-weight-bold">{{ lang.result }}</div>

          <div class="col-grow q-mx-sm relative-position">
            <div class="dashed-line"></div>
          </div>

          <div class="text-size-16 text-weight-bold">{{ price }} ₽</div>
        </div>

        <div class="row no-wrap q-pt-sm">
          <q-btn
            dense
            unelevated
            no-caps
            class="rounded-10 col"
            color="secondary"
            :label="lang.prolong"
            :loading="loading.prolong"
            @click="prolong"
          />
        </div>

        <q-inner-loading :showing="loading.price">
          <q-spinner size="32px" color="secondary" />
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

import { fetchProxy } from 'boot/queries';
import { useLang } from 'src/utils/useLang';

const states = useStatesStore();
const data = useDataStore();
const lang = computed(() => useLang());

const selected = ref('30');
const loading = ref({
  prolong: false,
  price: false,
});

const price = computed(() => (data.payment.price / 100).toFixed(2));

const select = (date: string) => {
  loading.value.price = true;
  selected.value = date;

  fetchProxy('getPrice', {
    version: data.selectedOrder.proxy,
    period: selected.value,
    count: '1',
    public_key: config.public_key,
  }).then(() => (loading.value.price = false));
};

const prolong = () => {
  loading.value.prolong = true;

  fetchProxy('prolongProxy', {
    order_org_id: data.selectedOrder.order_org_id,
    user_id: data.user.id,
    user_secret_key: data.systemUserValue.secret_user_key,
    public_key: config.public_key,
    period: selected.value,
    enter_amount: data.payment.price,
  }).then(() => {
    loading.value.prolong = false;
    states.closeDialog('prolong_menu');
  });
};
</script>

<style lang="scss" scoped></style>