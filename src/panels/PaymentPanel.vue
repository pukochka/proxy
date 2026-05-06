<template>
  <div class="q-gutter-y-md col" v-if="states.loadings.init === false">
    <div class="text-h6">Выберите тип прокси</div>

    <proxy-item
      :key="item"
      :item="item"
      :gradient-variant="index % 4"
      v-for="(item, index) of data.proxies"
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
