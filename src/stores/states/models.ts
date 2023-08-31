export interface StatesModel {
  tab: 'payment' | 'profile' | 'orders';

  dialogs: Record<DialogNames, boolean>;

  loadings: Record<LoadingNames, boolean>;
}

export type DialogNames =
  | 'count_menu'
  | 'country_menu'
  | 'date_menu'
  | 'type_menu'
  | 'prolong_menu'
  | 'type_filter'
  | 'date_filter'
  | 'ip_filter'
  | 'build'
  | 'view';

export type LoadingNames =
  | 'getPrice'
  | 'getProxy'
  | 'getCount'
  | 'deleteProxy'
  | 'updateType'
  | 'init';

export type TabNames = 'payment' | 'profile' | 'orders';
