import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/Layout';
import { SWRConfig } from 'swr';
import { Provider } from 'jotai'; // Import the Jotai provider
import RouteGuard from '../components/RouteGuard'; // Import the RouteGuard

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <SWRConfig
        value={{
          fetcher: async (url) => {
            const res = await fetch(url);
            if (!res.ok) {
              const error = new Error('An error occurred while fetching the data.');
              error.info = await res.json();
              error.status = res.status;
              throw error;
            }
            return res.json();
          },
        }}
      >
        <RouteGuard>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RouteGuard>
      </SWRConfig>
    </Provider>
  );
}

export default MyApp;
