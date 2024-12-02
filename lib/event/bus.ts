import type { EventKey, EventTypes } from './constants'
import logger from '../logger'
import { EVENT_DEFAULTS } from './constants'
import { EventEmitter } from './emitter'

class EventBus {
  private static instance: EventBus
  private emitters: Map<EventKey, EventEmitter<any>> = new Map()

  private constructor() {
    logger.info({ msg: 'EventBus constructor' })
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  /**
   * 订阅事件
   */
  public on<K extends EventKey>(
    event: K,
    listener: (data: EventTypes[K]) => void,
  ) {
    if (!this.emitters.has(event)) {
      this.emitters.set(event, new EventEmitter<EventTypes[K]>())
    }
    return this.emitters.get(event)!.subscribe(listener)
  }

  /**
   * 触发事件的具体实现
   */
  public emit<K extends EventKey>(event: K, data?: EventTypes[K]) {
    const eventData = data ?? EVENT_DEFAULTS[event]
    this.emitters.get(event)?.emit(eventData as EventTypes[K])
  }

  /**
   * 清除特定事件的所有监听器
   */
  public clear(event: EventKey) {
    this.emitters.get(event)?.clear()
  }

  /**
   * 清除所有事件的监听器
   */
  public clearAll() {
    this.emitters.forEach(emitter => emitter.clear())
    this.emitters.clear()
  }
}

// 导出单例
export const eventBus = EventBus.getInstance()
