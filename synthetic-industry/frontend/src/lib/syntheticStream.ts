// SSE Client for Synthetic Industry Stream

import { StreamEvent } from '../types';

type EventCallback = (data: StreamEvent) => void;

export class SyntheticStreamClient {
  private eventSource: EventSource | null = null;
  private callbacks: Map<string, EventCallback[]> = new Map();
  private baseUrl: string;
  
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Connect to the SSE stream
   */
  connect() {
    if (this.eventSource) {
      console.warn('Already connected to stream');
      return;
    }
    
    const streamUrl = `${this.baseUrl}/api/synthetic/stream`;
    console.log('Connecting to stream:', streamUrl);
    
    this.eventSource = new EventSource(streamUrl);
    
    this.eventSource.onmessage = (event) => {
      try {
        const data: StreamEvent = JSON.parse(event.data);
        this.handleEvent(data);
      } catch (error) {
        console.error('Error parsing stream event:', error);
      }
    };
    
    this.eventSource.onerror = (error) => {
      console.error('Stream error:', error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.disconnect();
        this.connect();
      }, 5000);
    };
    
    this.eventSource.onopen = () => {
      console.log('Stream connected successfully');
    };
  }
  
  /**
   * Register callback for specific event type
   */
  on(eventType: string, callback: EventCallback) {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
    }
    this.callbacks.get(eventType)!.push(callback);
  }
  
  /**
   * Unregister callback
   */
  off(eventType: string, callback: EventCallback) {
    const callbacks = this.callbacks.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  /**
   * Handle incoming event
   */
  private handleEvent(data: StreamEvent) {
    // Call specific event type callbacks
    const callbacks = this.callbacks.get(data.type) || [];
    callbacks.forEach(cb => cb(data));
    
    // Call wildcard callbacks
    const wildcardCallbacks = this.callbacks.get('*') || [];
    wildcardCallbacks.forEach(cb => cb(data));
  }
  
  /**
   * Start simulation
   */
  async start(duration: number = 24): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/synthetic/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to start simulation: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Stop simulation
   */
  async stop(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/synthetic/stop`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to stop simulation: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Pause simulation
   */
  async pause(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/synthetic/pause`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to pause simulation: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Resume simulation
   */
  async resume(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/synthetic/resume`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to resume simulation: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Get current statistics
   */
  async getStats(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/synthetic/stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to get stats: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Disconnect from stream
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('Stream disconnected');
    }
  }
}
