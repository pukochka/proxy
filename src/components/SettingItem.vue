<template>
  <div class="row no-wrap items-end text-size-16">
    <div class="">{{ item.label }}</div>

    <div class="col-grow q-mx-sm relative-position">
      <div class="dashed-line"></div>
    </div>

    <div class="q-mr-sm" v-if="item.icon">
      <q-img
        class="rounded-10"
        :src="item.icon"
        spinner-color="primary"
        style="height: 24px; width: 24px"
      />
    </div>

    <div class="">{{ item.value }}</div>
  </div>

  <div class="row">
    <q-btn
      dense
      no-caps
      unelevated
      class="rounded-10 q-ml-sm col"
      color="secondary"
      :label="lang.change"
      @click="open"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { defaultSettingsItem } from 'src/stores/defaults';
import { useStatesStore } from 'stores/states/statesStore';
import { useLang } from 'src/utils/useLang';

const props = withDefaults(defineProps<SettingItemProps>(), {
  item: () => defaultSettingsItem,
});

const states = useStatesStore();
const lang = computed(() => useLang());

const open = () => {
  if (props.item.menu === '') return;

  states.openDialog(props.item.menu);
};

interface SettingItemProps {
  item: SettingItemInstance;
}
</script>

<style lang="scss" scoped></style>
