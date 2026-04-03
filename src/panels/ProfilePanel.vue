<template>
  <div class="q-gutter-y-md col">
    <div class="text-center text-size-30 text-weight-bold">
      {{ t('profile') }}
    </div>

    <div class="q-gutter-y-sm" v-if="data.systemUserValue.id !== 0">
      <q-list
        bordered
        separator
        class="rounded overflow-hidden"
        :id="item.id"
        v-for="(item, index) in content"
        :key="index"
      >
        <q-item :class="[states.itemBackgroundClass]" :clickable="!!item.id">
          <q-item-section avatar>
            <q-avatar
              class="rounded"
              size="50px"
              font-size="32px"
              color="secondary"
              text-color="white"
              :icon="item.icon"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label caption class="text-size-14">
              {{ item.label }}
            </q-item-label>

            <q-item-label class="text-size-20">{{ item.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-menu
        fit
        target="#lang-menu"
        class="no-shadow q-list--bordered rounded"
        transition-hide="jump-up"
        transition-show="jump-down"
      >
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup @click="changeLanguage('ru')">
            <q-item-section avatar>
              <q-avatar rounded>
                <q-img
                  spinner-size="82px"
                  spinner-color="primary"
                  src="https://avatars.mds.yandex.net/get-entity_search/118194/224019704/S600xU_2x"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>Русский</q-item-section>

            <q-item-section side v-if="data.userValue.language === 'ru'">
              <q-icon name="check" color="secondary" size="32px" />
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="changeLanguage('eng')">
            <q-item-section avatar>
              <q-avatar rounded>
                <q-img
                  spinner-color="primary"
                  spinner-size="82px"
                  src="https://avatars.mds.yandex.net/get-entity_search/5488405/551775463/S600xU_2x"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>English</q-item-section>

            <q-item-section side v-if="data.userValue.language === 'eng'">
              <q-icon name="check" color="secondary" size="32px" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiWallet } from '@quasar/extras/mdi-v7';

import { fetchProxy } from 'boot/queries';

import { useDataStore } from 'stores/data/dataStore';
import { useStatesStore } from 'stores/states/statesStore';

const { t } = useI18n();
const data = useDataStore();
const states = useStatesStore();

const languageText = computed(() =>
  data.userValue.language === 'ru' ? 'Русский' : 'English'
);

const changeLanguage = (lang: 'ru' | 'eng') => {
  fetchProxy('setLanguage', {
    user_id: data.user.id,
    language: lang,
    user_secret_key: data.systemUser.secret_user_key,
  });
};

const content = computed(() => [
  {
    label: t('user'),
    icon: 'person',
    value:
      data.systemUserValue.user.first_name +
      ' ' +
      data.systemUserValue.user.last_name,
    id: null,
  },
  {
    label: t('wallet'),
    icon: mdiWallet,
    value: (data.systemUserValue.money / 100).toFixed(2) + ' ₽',
    id: null,
  },
  {
    label: t('language'),
    icon: 'language',
    value: languageText.value,
    id: 'lang-menu',
  },
]);
</script>
