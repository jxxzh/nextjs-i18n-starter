export enum EventKey {
  SEARCH_OPEN = 'search:open',
  // 可以继续添加其他事件类型
}

// key 为 EventKey 类型，value 为触发事件时传递的数据类型
export interface EventTypes {
  [EventKey.SEARCH_OPEN]: void
  // ... 可以继续添加其他事件类型
}

// 事件默认值的类型
export type EventDefaults = {
  [K in EventKey]?: EventTypes[K]
}

// 事件默认值
export const EVENT_DEFAULTS: EventDefaults = {
  [EventKey.SEARCH_OPEN]: undefined,
}
