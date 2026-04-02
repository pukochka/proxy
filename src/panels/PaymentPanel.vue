<template>
  <div class="q-gutter-y-md col" v-if="states.loadings.init === false">
    <div class="text-center text-size-30 text-weight-bold">Proxy</div>

    <div class="text-center" v-if="data.proxies.length === 0"></div>

    <proxy-item
      v-else
      v-for="(item, index) of data.proxies"
      :key="item"
      :item="item"
      :gradient-variant="index % 4"
    />
  </div>
</template>

<script lang="ts" setup>
import { useDataStore } from 'stores/data/dataStore';
import { useStatesStore } from 'stores/states/statesStore';

import ProxyItem from 'components/items/ProxyItem.vue';

const data = useDataStore();
const states = useStatesStore();
</script>
