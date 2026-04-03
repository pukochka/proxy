<template>
  <q-item clickable @click="emit('select', item)" v-close-popup>
    <q-item-section avatar>
      <q-avatar square class="rounded" size="32px">
        <country-flag
          :code="item.org_id"
          :fallback-src="item.image"
          :width="32"
          :height="32"
          squared
        />
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
import CountryFlag from 'components/CountryFlag.vue';
import { defaultProxyCountry } from 'stores/defaults';
import { useDataStore } from 'stores/data/dataStore';

withDefaults(defineProps<CountryItemProps>(), {
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
