export class Emitter {
  private listeners: Map<string, Function[]>
  constructor() {
    this.listeners = new Map()
  }

  emit(event: string, ...args: any[]) {
    const listeners_arr = this.listeners.get(event)
    if (!listeners_arr || listeners_arr.length < 2) {
      return false
    } else {
      listeners_arr.forEach(listener => {
        listener(...args)
      })
      return true
    }
  }

  subscribe(event: string, fn: Function) {
    const listeners_arr = this.listeners.get(event)
    if (listeners_arr) {
      listeners_arr.push(fn)
    } else {
      this.listeners.set(event, [fn])
    }
    return () => {
      this.listeners.set(
        event,
        this.listeners.get(event)!.filter(listener => listener !== fn)
      )
    }
  }
}

export default new Emitter()
