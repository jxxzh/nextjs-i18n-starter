type Listener<T = void> = (data?: T) => void
type Unsubscribe = () => void

export class EventEmitter<T = void> {
  private listeners: Set<Listener<T>> = new Set()

  /**
   * 订阅事件
   * @param listener 监听函数
   * @returns 取消订阅的函数
   */
  subscribe(listener: Listener<T>): Unsubscribe {
    this.listeners.add(listener)
    return () => this.unsubscribe(listener)
  }

  /**
   * 取消订阅
   * @param listener 要取消的监听函数
   */
  unsubscribe(listener: Listener<T>): void {
    this.listeners.delete(listener)
  }

  /**
   * 触发事件
   * @param data 可选的事件数据
   */
  emit(data?: T): void {
    this.listeners.forEach(listener => listener(data))
  }

  /**
   * 清除所有监听器
   */
  clear(): void {
    this.listeners.clear()
  }

  /**
   * 获取当前监听器数量
   */
  get size(): number {
    return this.listeners.size
  }
}
