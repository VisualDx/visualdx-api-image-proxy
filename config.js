export default {
    API_BASE_URL: process.env.API_BASE_URL || "https://api-dev.visualdx.com/v1/libraries/images",
    TOKEN_URL: process.env.TOKEN_URL || "https://api-dev.visualdx.com/v1/oauth2/token",
    
    // Default environment: "sandbox" or "prod"
    ENVIRONMENT: process.env.ENVIRONMENT || "sandbox",
  
    // Audience setting: "consumer" or "clinical"
    AUDIENCE: process.env.AUDIENCE || "consumer",
  
    // Cache settings (time-to-live in seconds)
    CACHE_TTL: 72 * 3600, // Default: 72 hours (72 * 3600 seconds)
  
    /*
     * How to configure:
     * - Set CACHE_TTL in `.env.local` to change the cache duration.
     * - Example: CACHE_TTL=3600 (1 hour)
     */
  };
  