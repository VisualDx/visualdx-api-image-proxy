# VisualDx API Reverse Proxy Sample Application

The [VisualDx API](https://developers.visualdx.com/spec) provides the data and tools needed to create applications for both health care providers and patients.
This **Next.js sample application** is a reverse proxy for accessing the VisualDx API's extensive library of curated medical images. It features:

✅ **Automatic Token Management**: Fetches and refreshes tokens automatically.  
✅ **Configurable Settings**: Supports different environments (`sandbox`, `prod`) and audiences (`consumer`, `clinical`).  
✅ **Customizable Cache TTL**: Cache duration is now adjustable via `config.js`.  
✅ **SEO-Friendly URLs**: Supports `/images/:size/:imageId/:filename`.  
✅ **Error Handling**: `302` redirects are handled invisibly, and `4xx` errors bubble up and are returned.

---
## Libraries Used

The project includes the following dependencies:  

### **Core Dependencies:**  
- **Next.js (`15.1.6`)** - Used as the framework for API handling and server-side logic.  
- **React (`^19.0.0`)** & **React-DOM (`^19.0.0`)** - Required for Next.js applications.  
- **Axios (`^1.7.9`)** - Handles API requests and authentication.  
- **Node-Cache (`^5.1.2`)** - Implements in-memory caching for images.  

### **Development Dependencies:**  
- **ESLint (`^9`)** - Ensures code quality.  
- **ESLint Config for Next.js (`15.1.6`)** - Standard ESLint rules for Next.js.  
- **@eslint/eslintrc (`^3`)** - ESLint configuration management.  

---

## Minimum Next.js Version Required

- This project **requires at least Next.js v15.1.6** to ensure compatibility.  
- Older versions of Next.js **(below v15)** may not support some features used in this implementation.  

---

## Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (v14 or later).
2. **VisualDx API Access**: Obtain an API token and access credentials.
3. **Environment Variables**: Set up the required `.env.local` file (explained below).

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/visualdx-api-image-proxy.git
cd visualdx-api-image-proxy
```

### 2. Install Dependencies

```bash
npm install
```
### **Step 3: Configure Environment Variables**  
Create a `.env.local` file in the root directory and set up API credentials:

```plaintext
# VisualDx API Base URL
API_BASE_URL=https://api.visualdx.com/v1/libraries/images

# Token Endpoint for authentication
TOKEN_URL=https://api.visualdx.com/v1/auth/token

# Authentication Credentials
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret

# Environment Settings
ENVIRONMENT=sandbox # Options: sandbox, prod
AUDIENCE=consumer # Options: consumer, clinical

# Cache TTL (in seconds) - Default 72 hours (72 * 3600 = 259200 seconds)
CACHE_TTL=259200
```
> **Note**: If your `CLIENT_SECRET` contains special characters, **wrap it in double quotes**:
```plaintext
CLIENT_SECRET="P@ssw0rd!"
```

---

### 4. Run the Development Server

Start the server with:

```bash
npm run dev
```

The server will start at:
```
http://localhost:3000
```

---

## API Endpoints

### Reverse Proxy Endpoint

**Path**: `/api/images/:size?/:imageId/:filename?`

#### **Parameters**

- `size` (optional): The size of the image. Allowed values are `thumbnail`, `standard`, and `full`. Defaults to `standard`.
- `imageId` (required): The unique ID of the image.
- `filename` (optional): SEO-friendly filename for the image.

#### **Examples**

1. **With Size and Filename**:
   ```bash
   curl -X GET "http://localhost:3000/api/images/thumbnail/12345/sample-image.jpg" 
   ```

2. **Without Size**:
   ```bash
   curl -X GET "http://localhost:3000/api/images/12345/sample-image.jpg" 
   ```

3. **Without Filename**:
   ```bash
   curl -X GET "http://localhost:3000/api/images/12345" 
   ```

---

## Testing

### Test Scenarios

1. **Valid Image Request**:
   - Request an image ID that exists in the VisualDx API.
   - Ensure the image is returned and cached for subsequent requests.

2. **Invalid Image ID**:
   - Use an invalid image ID.
   - Confirm that the API responds with `404 Not Found`.

3. **Redirect Handling**:
   - Test with an image ID that triggers a `302` redirect.
   - Confirm that the final image is fetched correctly.

4. **Cache Validation**:
   - Request the same image multiple times.
   - Verify that subsequent requests are served from the cache.

---

## Deployment

### 1. Build for Production

To build the application for production, run:

```bash
npm run build
```

### 2. Start the Production Server

After building the application, start the production server with:

```bash
npm start
```

---

## Notes

1. **SEO-Friendly URLs**:
   - The application allows filenames in the URL for SEO purposes, but the filename is optional.

2. **Caching**:
   - Images are cached for 72 hours to reduce redundant API calls.


---

## Common Issues

### **🚨 Too Many Redirects**
- **Error:** `500 Too Many Redirects`
- **Solution:** Verify the API endpoint and ensure the redirect chain is valid.


---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [VisualDx API Documentation](https://developers.visualdx.com/spec)
