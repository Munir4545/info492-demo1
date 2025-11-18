const EventSource = require('eventsource');
const EventEmitter = require('events');
const fetch = (...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

class SyntheticClient extends EventEmitter {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.eventSource = null;
    this.connected = false;
    this.waiters = [];
  }

  async connect() {
    if (this.eventSource) {
      return;
    }
    const streamUrl = `${this.baseUrl}/api/synthetic/stream`;
    await new Promise((resolve, reject) => {
      const es = new EventSource(streamUrl);
      let settled = false;
      es.onopen = () => {
        this.connected = true;
        settled = true;
        resolve();
      };
      es.onerror = (err) => {
        if (!settled) {
          settled = true;
          reject(new Error(`Synthetic stream connection failed: ${err?.message || err}`));
        } else {
          console.warn('[SyntheticClient] Stream error, attempting reconnect...');
          this._scheduleReconnect();
        }
      };
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this._handleEvent(data);
        } catch (error) {
          console.error('[SyntheticClient] Failed to parse event:', error);
        }
      };
      this.eventSource = es;
    });
  }

  _scheduleReconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.connected = false;
    }
    setTimeout(() => this.connect().catch(err => {
      console.error('[SyntheticClient] Reconnect failed:', err.message);
    }), 3000);
  }

  _handleEvent(event) {
    this.emit('event', event);
    if (event?.type) {
      this.emit(event.type, event);
    }
    if (this.waiters.length) {
      this.waiters = this.waiters.filter(waiter => {
        if (waiter.type !== '*' && waiter.type !== event.type) {
          return true;
        }
        if (waiter.predicate && !waiter.predicate(event)) {
          return true;
        }
        clearTimeout(waiter.timer);
        waiter.resolve(event);
        return false;
      });
    }
  }

  waitForEvent(type, predicate = () => true, timeoutMs = 60000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.waiters = this.waiters.filter(waiter => waiter.timer !== timer);
        reject(new Error(`Timed out waiting for event ${type}`));
      }, timeoutMs);
      this.waiters.push({
        type,
        predicate,
        resolve,
        reject,
        timer
      });
    });
  }

  async triggerGpsSpoof({ lat, lng, durationMs, message }) {
    const response = await fetch(`${this.baseUrl}/api/synthetic/attack/gps-spoof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, durationMs, message })
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Synthetic GPS spoof failed (${response.status}): ${text}`);
    }
    return response.json();
  }

  async pushApiAlerts(alerts) {
    const response = await fetch(`${this.baseUrl}/api/synthetic/attack/api-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alerts })
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Synthetic API alert injection failed (${response.status}): ${text}`);
    }
    return response.json();
  }

  async close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connected = false;
    this.waiters.forEach(waiter => {
      clearTimeout(waiter.timer);
      if (waiter.reject) {
        waiter.reject(new Error('Synthetic client closed'));
      }
    });
    this.waiters = [];
  }
}

module.exports = SyntheticClient;

