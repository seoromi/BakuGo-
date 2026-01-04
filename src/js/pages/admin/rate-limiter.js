// Security: Rate Limiter class to prevent abuse
export class RateLimiter {
    constructor(maxCalls, timeWindow) {
        this.maxCalls = maxCalls;
        this.timeWindow = timeWindow; // in milliseconds
        this.calls = [];
    }
    
    attempt() {
        const now = Date.now();
        // Remove calls outside the time window
        this.calls = this.calls.filter(time => now - time < this.timeWindow);
        
        if (this.calls.length >= this.maxCalls) {
            return false;
        }
        
        this.calls.push(now);
        return true;
    }
    
    reset() {
        this.calls = [];
    }
}

