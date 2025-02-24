import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>VisualDx API Image Proxy</title>
        <meta
          name="description"
          content="A Next.js sample app implementing a reverse image proxy for the VisualDx API."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          <h1>VisualDx API Image Proxy</h1>
          <p>
            This sample application provides a reverse proxy for accessing
            images from the VisualDx API while handling authentication, caching, and
            SEO-friendly URLs.
          </p>

          <h2>Getting Started</h2>
          <ol>
            <li>Clone this repository and install dependencies:</li>
            <pre>
              <code>git clone https://github.com/VisualDx/visualdx-api-image-proxy.git</code>
              <br />
              <code>cd visualdx-api-image-proxy</code>
              <br />
              <code>npm install</code>
            </pre>

            <li>Set up your <code>.env.local</code> file:</li>
            <pre>
              <code>
                API_BASE_URL=https://api.visualdx.com/v1/libraries/images{"\n"}
                TOKEN_URL=https://api.visualdx.com/v1/v1/auth/token{"\n"}
                CLIENT_ID=your_client_id{"\n"}
                CLIENT_SECRET=your_client_secret{"\n"}
                AUDIENCE=consumer{"\n"}
                CACHE_TTL=259200{"\n"}
              </code>
            </pre>

            <li>Start the development server:</li>
            <pre>
              <code>npm run dev</code>
            </pre>

            <li>Test the API with a sample request:</li>
            <pre>
              <code>
                curl -X GET "http://localhost:3000/api/images/thumbnail/12345/sample.jpg"
              </code>
            </pre>
          </ol>

          <h2>Resources</h2>
          <ul>
            <li>
              <a
                href="https://developers.visualdx.com/spec"
                target="_blank"
                rel="noopener noreferrer"
              >
                VisualDx API Documentation
              </a>
            </li>
            <li>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js Documentation
              </a>
            </li>
            <li>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy on Vercel
              </a>
            </li>
          </ul>
        </main>

        <footer className={styles.footer}>
          <p>Powered by Next.js | VisualDx API Integration</p>
        </footer>
      </div>
    </>
  );
}
