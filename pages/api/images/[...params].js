import axios from "axios";
import NodeCache from "node-cache";
import config from "../../../config";

// Initialize cache with configurable TTL
const cache = new NodeCache({ stdTTL: config.CACHE_TTL });

let apiToken = null;
let tokenExpiration = null;

// Function to fetch a new API token
async function fetchToken() {
  try {
    console.log("Fetching new API token...");

    const response = await axios.post(config.TOKEN_URL, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: config.AUDIENCE,
      grant_type: "client_credentials",
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")}`
      }
    });

    const { access_token, expires_in } = response.data;
    
    apiToken = access_token;
    tokenExpiration = Date.now() + expires_in * 1000; // Convert expiration to timestamp
    console.log("Token obtained successfully: " + apiToken);
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw error.response || error;
  }
}

// Middleware to ensure a valid token
async function ensureToken() {
  if (!apiToken || Date.now() >= tokenExpiration) {
    await fetchToken();
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" }); // Only allow GET requests
  }
  const validSizes = ["thumbnail", "standard", "full"];
  const { params } = req.query;

  if (!params || params.length < 1) {
    return res.status(400).json({ error: "Image ID is required" });
  }

  // Parse size, imageId, and filename from params
  let size = "standard"; // Default size
  let imageId, filename;
  // Case: /api/images/:imageId
  if (params.length === 1){
    size = "standard"; // Default size
    imageId = params[0]; // First param is imageId
    filename = ""; // No filename provided
  } else if (params.length === 2) {
    // Case: /api/images/:size/:imageId or /api/images/:imageId/:filename
    if (!isNaN(params[0])) {
        // First param is numeric, so it's the imageId
        size = "standard"; // Default size
        imageId = params[0];
        filename = ""; // No filename provided
      } else {
        // First param is size, second is imageId
        size = validSizes.includes(params[0]) ? params[0] : "standard";
        imageId = params[1];
        filename = ""; // No filename provided
      }
  } else if (params.length === 3) {
    // Case: /api/images/:size/:imageId/:filename
    [size, imageId, filename] = params;
  }

  const imageSize = validSizes.includes(size) ? size : "standard"; // Validate size
  const apiUrl = `${config.API_BASE_URL}/${imageId}?size=${imageSize}`;
  const cacheKey = `image:${imageSize}:${imageId}`;

  try {
    await ensureToken(); // Ensure token is valid

    // Serve from cache if available
    const cachedImage = cache.get(cacheKey);
    if (cachedImage) {
      console.log("Serving from cache");
      res.setHeader("Content-Type", cachedImage.contentType);
      return res.status(200).send(cachedImage.data);
    }

    console.log(`Fetching image (${cacheKey}) from API...(${apiUrl})`);
    let apiUrlToFetch = apiUrl; // Start with the initial API URL
    let maxRedirects = 5; // Limit to avoid infinite loops
    let attempts = 0;

    while (attempts < maxRedirects) {
      const response = await axios.get(apiUrlToFetch, {
        headers: { Authorization: `Bearer ${apiToken}` },
        responseType: "arraybuffer",
      });
      console.log(`Response status: ${response.status}`);

      if (response.status === 200) {
        // Cache and serve the image
        cache.set(cacheKey, { data: response.data, contentType: response.headers["content-type"] });
        res.setHeader("Content-Type", response.headers["content-type"]);
        return res.status(200).send(response.data);
      } else if (response.status === 302) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        console.log(`Redirecting to: ${redirectUrl}`);
        apiUrlToFetch = redirectUrl; // Update the URL to follow the redirect
      } else if (response.status === 401) {
        console.log("Token expired, fetching new token...");
        await fetchToken();
      } else {
        // Handle unexpected status codes
        return res.status(response.status).send(response.data);
      }

      attempts++;
    }

    // If we exceed maxRedirects, return an error
    console.error("Too many redirects");
    return res.status(500).json({ error: "Too many redirects" });
  } catch (err) {
    if (err.response) {
      console.error(`Error fetching image: ${err.response.status} - ${err.response.data}`);
      return res.status(err.response.status).send(err.response.data);
    }
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
