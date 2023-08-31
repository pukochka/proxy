<template>
  <q-item clickable @click="emit('select', item)" v-close-popup>
    <q-item-section avatar>
      <q-avatar size="md" text-color="white">
        <q-img :src="item.image" spinner-color="primary" spinner-size="82px" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ data.user.language === 'ru' ? item.name_ru : item.name_en }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { defaultProxyCountry } from 'stores/defaults';
import { useDataStore } from 'stores/data/dataStore';

const props = withDefaults(defineProps<CountryItemProps>(), {
  item: () => defaultProxyCountry,
});

const emit = defineEmits<{
  (e: 'select', value: ProxyCountry): void;
}>();

const data = useDataStore();

interface CountryItemProps {
  item: ProxyCountry;
}
</script>

<style lang="scss" scoped></style>
