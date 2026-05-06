<template>
  <q-dialog
    @hide="update"
    v-model="states.dialogs.view"
    position="bottom"
    persistent
  >
    <q-card class="rounded-top" flat bordered>
      <modal-top>
        <div class="row no-wrap items-center">
          <div>
            {{ version }} <span class="text-primary">{{ t('proxy') }}</span>
          </div>

          <q-badge
            outline
            :label="status.text"
            :color="status.color"
            class="q-px-sm q-py-xs text-weight-bold q-ml-sm rounded"
          />
        </div>
      </modal-top>

      <q-card-section class="q-pt-none q-pb-sm q-gutter-y-sm">
        <div class="rounded bordered q-pa-sm">
          <div class="row no-wrap items-end">
            <div class="">IP:{{ t('port') }}</div>

            <div class="col-grow q-mx-sm relative-position">
              <div class="dashed-line"></div>
            </div>

            <div class="q-mr-sm ellipsis" style="max-width: 100px">
              {{ data.selectedOrder.ip }}:{{ data.selectedOrder.port }}
            </div>

            <copy-button
              :text="data.selectedOrder.ip + ':' + data.selectedOrder.port"
            ></copy-button>
          </div>
        </div>

        <div
          class="rounded bordered q-pa-sm"
          v-if="data.selectedOrder.proxy !== '5'"
        >
          <div class="row no-wrap items-end">
            <div class="">{{ t('login') }}</div>

            <div class="col-grow q-mx-sm relative-position">
              <div class="dashed-line"></div>
            </div>

            <div class="q-mr-sm ellipsis" style="max-width: 100px">
              {{ data.selectedOrder.user }}
            </div>

            <copy-button :text="data.selectedOrder.user"></copy-button>
          </div>
        </div>

        <div class="rounded bordered q-pa-sm">
          <div class="row no-wrap items-end">
            <div class="">
              {{
                data.selectedOrder.proxy === '5'
                  ? t('secretKey')
                  : t('password')
              }}
            </div>

            <div class="col-grow q-mx-sm relative-position">
              <div class="dashed-line"></div>
            </div>

            <div class="q-mr-sm ellipsis" style="max-width: 100px">
              {{ data.selectedOrder.pass }}
            </div>

            <copy-button :text="data.selectedOrder.pass"></copy-button>
          </div>
        </div>

        <div
          class="rounded bordered q-pa-sm"
          v-if="data.selectedOrder.proxy !== '5'"
        >
          <div class="row no-wrap items-end">
            <div class="">IP</div>

            <div class="col-grow q-mx-sm relative-position">
              <div class="dashed-line"></div>
            </div>

            <div class="q-mr-sm ellipsis" style="max-width: 100px">
              {{ data.selectedOrder.ip }}
            </div>

            <copy-button :text="data.selectedOrder.ip"></copy-button>
          </div>
        </div>

        <div class="row no-wrap q-gutter-x-sm">
          <div class="col row items-center rounded bordered q-pa-xs">
            <q-avatar square class="rounded" size="24px">
              <country-flag
                squared
                :width="24"
                :height="24"
                :code="data.selectedOrder.country.org_id"
                :fallback-src="data.selectedOrder.country.image"
              />
            </q-avatar>

            <div class="text-weight-bold col text-center">{{ country }}</div>
          </div>

          <div
            class="col rounded bordered text-center text-weight-bold text-subtitle1 q-pa-xs"
          >
            {{ (data.selectedOrder.price / 100).toFixed(2) + ' ₽' }}
          </div>
        </div>

        <div class="rounded bordered q-pa-sm">
          <div class="row items-center justify-between q-pb-xs">
            {{ t('period') }}

            <q-badge
              outline
              :label="validityRemainingBadge.label"
              :color="validityRemainingBadge.color"
              class="q-px-sm text-weight-bold q-ml-sm rounded q-py-xs"
            />
          </div>

          <div
            class="row items-center justify-between text-primary text-weight-bold"
          >
            {{ createAt }}

            <q-icon name="arrow_forward" color="primary" size="24px" />

            {{ endAt }}
          </div>
        </div>
      </q-card-section>

      <div class="row q-gutter-y-sm q-px-md q-pb-sm">
        <q-btn
          v-if="data.selectedOrder.proxy === '5'"
          no-caps
          outline
          icon="launch"
          target="_blank"
          color="primary"
          class="rounded col-12 q-py-sm"
          :href="activateProxyHref"
          :label="t('activateProxy')"
        />

        <q-btn
          v-if="data.selectedOrder.proxy !== '5'"
          no-caps
          outline
          color="primary"
          class="rounded col-12 q-py-sm"
          :label="t('check')"
          :loading="loading.check"
          @click="checkProxy"
        />

        <q-btn
          no-caps
          unelevated
          color="primary"
          class="rounded col-12 q-py-sm"
          :loading="loading.prolong"
          :label="t('prolong_proxy')"
          @click="prolongProxy"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import config from 'src/config';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { date } from 'quasar';

import { useStatesStore } from 'stores/states/statesStore';
import { useDataStore } from 'stores/data/dataStore';

import { fetchProxy } from 'boot/queries';

import CopyButton from 'components/CopyButton.vue';
import CountryFlag from 'components/CountryFlag.vue';
import ModalTop from 'components/ModalTop.vue';

const { t, locale } = useI18n();

const MS_DAY = 86400000;
const MS_HOUR = 3600000;

function ruPluralForms(
  n: number,
  one: string,
  few: string,
  many: string
): string {
  const nAbs = Math.abs(Math.floor(n)) % 100;
  const n1 = nAbs % 10;
  if (nAbs > 10 && nAbs < 20) return `${n} ${many}`;
  if (n1 > 1 && n1 < 5) return `${n} ${few}`;
  if (n1 === 1) return `${n} ${one}`;
  return `${n} ${many}`;
}

function enPluralWord(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

const validityRemainingBadge = computed(() => {
  const diff = Number(data.selectedOrder.end_time) * 1000 - Date.now();

  if (diff <= 0) {
    return { label: t('order_remaining_expired'), color: 'warning' as const };
  }

  if (diff >= MS_DAY) {
    const days = Math.floor(diff / MS_DAY);
    const label =
      locale.value === 'ru'
        ? ruPluralForms(days, 'день', 'дня', 'дней')
        : enPluralWord(days, 'day', 'days');
    return { label, color: 'green' as const };
  }

  const hours = Math.max(1, Math.ceil(diff / MS_HOUR));
  const label =
    locale.value === 'ru'
      ? ruPluralForms(hours, 'час', 'часа', 'часов')
      : enPluralWord(hours, 'hour', 'hours');
  return { label, color: 'orange' as const };
});
const states = useStatesStore();
const data = useDataStore();

const loading = ref({
  check: false,
  prolong: false,
});

const status = computed(() =>
  data.selectedOrder.status_org === '1'
    ? {
        text: t('order_active'),
        color: 'green',
      }
    : data.selectedOrder.status_org === '2'
    ? {
        text: t('order_ended'),
        color: 'warning',
      }
    : {
        text: t('order_delete'),
        color: 'red',
      }
);

const version = computed(() =>
  data.selectedOrder.proxy === '3'
    ? 'IPv4 Shared'
    : data.selectedOrder.proxy === '4'
    ? 'IPv4'
    : data.selectedOrder.proxy === '6'
    ? 'IPv6'
    : 'MTProto'
);

const country = computed(
  () =>
    data.selectedOrder.country[
      data.userValue.language === 'ru' ? 'name_ru' : 'name_en'
    ]
);

const createAt = computed(() =>
  date.formatDate(data.selectedOrder.start_time * 1000, 'DD-MM-YYYY')
);

const endAt = computed(() =>
  date.formatDate(data.selectedOrder.end_time * 1000, 'DD-MM-YYYY')
);

const activateProxyHref = computed(() => {
  const server = encodeURIComponent(data.selectedOrder.ip || '');
  const port = encodeURIComponent(String(data.selectedOrder.port || ''));
  const secret = encodeURIComponent(data.selectedOrder.pass || '');

  return `https://t.me/proxy?server=${server}&port=${port}&secret=${secret}`;
});

const prolongProxy = () => {
  loading.value.prolong = true;

  fetchProxy(
    'getPrice',
    {
      version: data.selectedOrder.proxy,
      period: '30',
      count: '1',
      public_key: config.public_key,
    },
    true
  ).then(() => (loading.value.prolong = false));
};

const checkProxy = () => {
  loading.value.check = true;

  fetchProxy('checkWork', {
    order_org_id: data.selectedOrder.order_org_id,
    user_id: data.user.id,
    user_secret_key: data.systemUserValue.secret_user_key,
    public_key: config.public_key,
  }).then(() => (loading.value.check = false));
};

const update = () => {
  fetchProxy('getOrders', {
    user_id: data.userValue.id,
    public_key: config.public_key,
    user_secret_key: data.systemUserValue.secret_user_key,
  });
};
</script>
