export interface DataModel {
  proxiesValue: ProxyItem[];
  ordersValue: ProxyOrder[];

  userValue: ProxyUser;
  systemUserValue: SystemUser;

  selected: ProxyItem;
  selectedOrder: ProxyOrder;

  selectedCountry: ProxyCountry;
  selectedCount: number;
  selectedDate: number;

  range: {
    min: number;
    max: number;
  };

  payment: {
    price: number;
    period: number;
    count: number;
    price_single: number;
  };

  multiply: boolean;
  filterOrders: OrderFilter;
}

export interface OrderFilter {
  active: boolean;
  ended: boolean;
  ip: string;
  proxy: string;
  date: { from: number; to: number } | null;
}

export type OrderFilterOf<P extends keyof OrderFilter> = OrderFilter[P];
