<template>
  <q-dialog
    @before-show="update"
    v-model="states.dialogs.country_menu"
    persistent
  >
    <q-card style="width: 100%" class="rounded" flat bordered>
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="text-weight-bold row items-center no-wrap">
          <country-flag
            class="q-mr-sm"
            style="flex-shrink: 0"
            :code="data.selectedCountry.org_id"
            :fallback-src="data.selectedCountry.image"
            :width="22"
            :height="16"
          />
          <span class="ellipsis">{{ data.selected.title }}</span>
        </q-toolbar-title>

        <q-btn
          flat
          class="rounded"
          color="primary"
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          class="rounded q-px-md q-my-sm"
          :class="[states.itemBackgroundClass]"
          v-model="search"
          :placeholder="t('search')"
          borderless
        />

        <choose-item
          type="country"
          stable-height
          searching
          :search="search"
          :visible-items="3"
          :currentItems="filteredCountries"
          @select="selectCountry"
        ></choose-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

import CountryFlag from 'components/CountryFlag.vue';
import ChooseItem from 'components/menu/ChooseItem.vue';
import { fetchProxy } from 'boot/queries';
import config from 'src/config';

const { t } = useI18n();
const data = useDataStore();
const states = useStatesStore();

const search = ref('');
const country = ref<ProxyCountry>(data.selectedCountry);

const filteredCountries = computed(() =>
  data.selected.countries?.filter((item) =>
    (data.user.language === 'ru' ? item.name_ru : item.name_en)
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
);

const selectCountry = (value: ProxyCountry) => {
  data.selectedCountry = value;

  fetchProxy('getCount', {
    version: data.selected.version,
    country: data.selectedCountry.org_id,
    user_secret_key: data.systemUserValue.secret_user_key,
    public_key: config.public_key,
  }).then();
};

const update = () => {
  country.value = data.selectedCountry;
};
</script>
