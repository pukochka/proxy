<template>
  <div class="row no-wrap items-end text-size-16">
    <div class="text-weight-bold">{{ item.label }}</div>

    <div class="col-grow q-mx-sm relative-position">
      <div class="dashed-line"></div>
    </div>

    <div class="q-mr-sm" v-if="item.countryCode || item.icon">
      <country-flag
        v-if="item.countryCode"
        :code="item.countryCode"
        :fallback-src="item.icon"
        :width="24"
        :height="18"
      />
      <q-img
        v-else-if="item.icon"
        class="rounded"
        :src="item.icon"
        spinner-color="primary"
        style="height: 24px; width: 24px"
      />
    </div>

    <div class="text-weight-bold">{{ item.value }}</div>
  </div>

  <div class="row">
    <q-btn
      dense
      no-caps
      outline
      class="rounded col"
      color="secondary"
      :label="t('change')"
      @click="open"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import CountryFlag from 'components/CountryFlag.vue';
import { defaultSettingsItem } from 'src/stores/defaults';
import { useStatesStore } from 'stores/states/statesStore';

const props = withDefaults(defineProps<SettingItemProps>(), {
  item: () => defaultSettingsItem,
});

const { t } = useI18n();
const states = useStatesStore();

const open = () => {
  if (props.item.menu === '') return;

  states.openDialog(props.item.menu);
};

interface SettingItemProps {
  item: SettingItemInstance;
}
</script>
