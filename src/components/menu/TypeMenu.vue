<template>
  <q-dialog @before-show="update" v-model="states.dialogs.type_menu">
    <q-card style="width: 100%" class="rounded-10" flat bordered>
      <q-card-section>
        <q-list separator dense bordered class="rounded-10 overflow-hidden">
          <q-item
            tag="label"
            v-for="(item, index) of types"
            :key="index"
            @click="select(item.value)"
            v-close-popup
          >
            <q-item-section avatar>
              <q-radio
                v-model="selected"
                :val="item.value"
                color="secondary"
                @click="select(item.value)"
                v-close-popup
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

const selected = ref('');

const update = () => {
  selected.value = data.selectedOrder.type;
};

const select = (type: string) => {
  selected.value = type;

  if (selected.value === data.selectedOrder.type || states.loadings.updateType)
    return;

  fetchProxy('updateType', {
    type: type,
    order_org_id: data.selectedOrder.order_org_id,
    user_id: data.user.id,
    user_secret_key: data.systemUserValue.secret_user_key,
    public_key: config.public_key,
  });
};

const types = [
  {
    label: 'HTTPs',
    value: 'http',
  },
  {
    label: 'SOCKS5',
    value: 'socks',
  },
];
</script>

<style lang="scss" scoped></style>
