// In-Memory Asynchronous Event Broker (replaces Redis Streams for local/embedded execution)
const EventEmitter = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.history = [];
  }

  publish(topic, payload) {
    const event = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      topic,
      payload,
      timestamp: new Date().toISOString()
    };
    this.history.push(event);
    if (this.history.length > 500) this.history.shift();
    console.log(`[EventBus] 🚀 Event published [${topic}] -> ID: ${event.id}`);
    this.emit(topic, event);
    this.emit('*', event);
    return event;
  }

  subscribe(topic, handler) {
    console.log(`[EventBus] 📡 Subscribed to [${topic}]`);
    this.on(topic, handler);
  }

  getHistory(topic) {
    if (!topic) return this.history;
    return this.history.filter(e => e.topic === topic);
  }
}

const sharedEventBus = new EventBus();
module.exports = sharedEventBus;

