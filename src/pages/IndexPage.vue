<template>
  <div class="flex flex-center" style="height: calc(100vh - 48px)">
    <q-tab-panels
      v-model="states.tab"
      animated
      class="fit bg-transparent"
      swipeable
    >
      <q-tab-panel name="payment" class="row flex-center">
        <payment-panel></payment-panel>
      </q-tab-panel>

      <q-tab-panel name="orders" class="row flex-center">
        <orders-panel></orders-panel>
      </q-tab-panel>

      <q-tab-panel name="profile" class="row flex-center">
        <profile-panel></profile-panel>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts" setup>
import { useStatesStore } from 'stores/states/statesStore';
import PaymentPanel from 'src/panels/PaymentPanel.vue';
import OrdersPanel from 'src/panels/OrdersPanel.vue';
import ProfilePanel from 'src/panels/ProfilePanel.vue';

const states = useStatesStore();
</script>
