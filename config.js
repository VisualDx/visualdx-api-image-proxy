export default {
    API_BASE_URL: process.env.API_BASE_URL || "https://api-dev.visualdx.com/v1/libraries/images",
    TOKEN_URL: process.env.TOKEN_URL || "https://api-dev.visualdx.com/v1/oauth2/token",
  
    // Audience setting: "consumer" or "clinical"
    AUDIENCE: process.env.AUDIENCE || "consumer",
  
    // Cache settings (time-to-live in seconds)
    CACHE_TTL: process.env.CACHE_TTL || 259200,
  
  };
  
