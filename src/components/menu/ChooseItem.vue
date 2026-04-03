<template>
  <div class="rounded relative-position overflow-hidden">
    <div
      :style="{ height: height }"
      v-if="currentItems.length === 0 && searching"
    >
      <div
        class="absolute-full q-pa-md column flex-center text-center rounded q-gutter-y-sm"
      >
        <q-icon color="secondary" name="search" size="32px" />

        <div>{{ t('search_not_found') }}</div>
      </div>
    </div>

    <q-tab-panels
      v-else
      animated
      class="bg-transparent"
      v-model="panels"
      :transition-duration="100"
      :transition-next="transition"
      :transition-prev="transition"
      :style="{ height: height }"
    >
      <q-tab-panel name="0" class="q-pa-none">
        <q-list class="rounded overflow-hidden" bordered separator>
          <component
            v-for="(item, index) of items"
            :key="index"
            :is="RenderItem"
            :item="item"
            @select="emit('select', item)"
          ></component>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="1" class="q-pa-none">
        <q-list class="rounded overflow-hidden" bordered separator>
          <component
            v-for="(item, index) of items"
            :key="index"
            :is="RenderItem"
            :item="item"
            @select="emit('select', item)"
          ></component>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <div
    class="row items-center relative-position rounded overflow-hidden non-selectable q-mt-sm"
    style="height: 36px"
    v-if="hiddenButtons === false || pageCount > 1"
  >
    <q-btn
      unelevated
      no-caps
      class="absolute-left"
      color="secondary"
      padding="4px 8px"
      icon="navigate_before"
      v-if="currentStartIndex > 0"
      :label="labelPrev"
      @click="prev"
    />

    <div
      class="absolute-center text-size-20 text-weight-bold"
      v-if="pageCount > 1"
    >
      {{ currentPage }} {{ t('from') }} {{ pageCount }}
    </div>

    <q-btn
      unelevated
      no-caps
      class="absolute-right"
      color="secondary"
      padding="4px 8px"
      icon-right="navigate_next"
      v-if="
        items.length >= visibleItems &&
        currentItems.length >= currentEndIndex + 1
      "
      :label="labelNext"
      @click="next"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, withDefaults } from 'vue';
import { useI18n } from 'vue-i18n';

import { useQuasar } from 'quasar';

import OrderItem from '../items/OrderItem.vue';
import CountryItem from '../items/CountryItem.vue';

const props = withDefaults(defineProps<Props>(), {
  currentItems: () => [],
  search: () => '',
  type: () => 'order',
  visibleItems: () => 7,
  hiddenButtons: () => false,
  elHeight: () => 52,
  stableHeight: () => false,
  searching: () => true,
});

const emit = defineEmits<{
  (e: 'select', value: ProxyCountry): void;
}>();

const { t } = useI18n();
const quasar = useQuasar();

const panels = ref('0');
const transition = ref('slide-left');

const startIndex = ref(0);
const endIndex = ref(props.visibleItems);

const searchStartIndex = ref(0);
const searchEndIndex = ref(props.visibleItems);

const currentPage = ref(1);

const RenderItem = computed(() => {
  if (props.type === 'order') return OrderItem;
  else if (props.type === 'country') return CountryItem;
  else return '';
});

const height = computed(() =>
  items.value.length <= props.visibleItems && props.stableHeight === false
    ? items.value.length * props.elHeight + 2 + 'px'
    : props.visibleItems * props.elHeight + 2 + 'px'
);

const labelNext = computed(() => (quasar.screen.width < 350 ? '' : t('next')));
const labelPrev = computed(() => (quasar.screen.width < 350 ? '' : t('prev')));

const pageCount = computed(() =>
  Math.ceil(props.currentItems.length / props.visibleItems)
);

const currentSearch = computed(() => props.search === '');

const currentStartIndex = computed(() =>
  currentSearch.value ? startIndex.value : searchStartIndex.value
);

const currentEndIndex = computed(() =>
  currentSearch.value ? endIndex.value : searchEndIndex.value
);

const items = computed(() =>
  props.currentItems.filter(
    (_, index: number) =>
      index >= currentStartIndex.value && index < currentEndIndex.value
  )
);

watch(currentSearch, (val) => {
  if (val) {
    searchEndIndex.value = props.visibleItems;
    searchStartIndex.value = 0;
  } else {
    currentPage.value = currentEndIndex.value / props.visibleItems;
  }
});

watch(currentEndIndex, (val) => {
  currentPage.value = val / props.visibleItems;
});

const next = () => {
  if (currentSearch.value) {
    startIndex.value += props.visibleItems;
    endIndex.value += props.visibleItems;
  } else {
    searchStartIndex.value += props.visibleItems;
    searchEndIndex.value += props.visibleItems;
  }

  slide('next');
};
const prev = () => {
  if (currentSearch.value) {
    startIndex.value -= props.visibleItems;
    endIndex.value -= props.visibleItems;
  } else {
    searchStartIndex.value -= props.visibleItems;
    searchEndIndex.value -= props.visibleItems;
  }

  slide('prev');
};

const slide = (side: 'prev' | 'next') => {
  transition.value = side === 'prev' ? 'slide-right' : 'slide-left';

  panels.value =
    panels.value === '0' ? (panels.value = '1') : (panels.value = '0');
};

interface Props {
  currentItems: (ProxyCountry | ProxyOrder)[];
  search: string;
  type: 'country' | 'order';
  visibleItems?: number;
  hiddenButtons?: boolean;
  elHeight?: number;
  stableHeight?: boolean;
  searching?: boolean;
}
</script>
