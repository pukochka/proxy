<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent z-header">
      <q-tabs
        inline-label
        align="justify"
        class="bg-transparent"
        :class="[config.dark ? ' text-secondary' : ' text-primary']"
        v-model="states.tab"
      >
        <q-tab
          no-caps
          class="text-weight-bold q-px-none"
          :key="index"
          :name="tab.name"
          :icon="tab.icon"
          :label="tab.label"
          v-for="(tab, index) in headerTabs"
        >
        </q-tab>
      </q-tabs>
    </q-header>

    <q-page-container class="z-page relative-position">
      <router-view />
    </q-page-container>

    <div class="relative-position absolute-full">
      <proxy-stars></proxy-stars>
    </div>

    <q-inner-loading :showing="states.loadings.init" class="z-marginals">
      <q-spinner-rings class="" color="primary" size="180px" />

      <div class="text-body1">{{ t('loading') }}</div>
    </q-inner-loading>

    <count-menu></count-menu>

    <country-menu></country-menu>

    <date-menu></date-menu>

    <prolong-menu></prolong-menu>

    <building-order></building-order>

    <view-order></view-order>

    <type-menu></type-menu>

    <date-filter></date-filter>

    <ip-filter></ip-filter>

    <type-filter></type-filter>
  </q-layout>
</template>

<script setup lang="ts">
import config from 'src/config';
import { headerTabs } from 'assets/content';

import { useI18n } from 'vue-i18n';

import { useStatesStore } from 'stores/states/statesStore';

import ProxyStars from 'components/ProxyStars.vue';

import CountMenu from 'components/menu/CountMenu.vue';
import CountryMenu from 'components/menu/CountryMenu.vue';
import DateMenu from 'components/menu/DateMenu.vue';
import TypeMenu from 'components/menu/TypeMenu.vue';
import ProlongMenu from 'components/menu/ProlongMenu.vue';

import BuildingOrder from 'components/order/BuildingOrder.vue';
import ViewOrder from 'components/order/ViewOrder.vue';

import DateFilter from 'components/filters/DateFilter.vue';
import IpFilter from 'components/filters/IpFilter.vue';
import TypeFilter from 'components/filters/TypeFilter.vue';

const { t } = useI18n();
const states = useStatesStore();
</script>

<style lang="scss">
.z-header {
  z-index: 3;
}
.z-page {
  z-index: 2;
}
</style>
