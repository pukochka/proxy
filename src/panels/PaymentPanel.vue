<template>
  <div class="q-gutter-y-md col" v-if="states.loadings.init === false">
    <div class="text-center text-size-30 text-weight-bold">Proxy</div>

    <div class="text-center" v-if="data.proxies.length === 0"></div>

    <proxy-item
      v-else
      class="col-10"
      v-for="item of data.proxies"
      :key="item"
      :item="item"
    ></proxy-item>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useDataStore } from 'stores/data/dataStore';
import { useStatesStore } from 'stores/states/statesStore';
import { useLang } from 'src/utils/useLang';

import ProxyItem from 'components/items/ProxyItem.vue';

const data = useDataStore();
const states = useStatesStore();
const lang = computed(() => useLang());
</script>

<style lang="scss" scoped></style>
