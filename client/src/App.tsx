import "./index.css";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmailProvider } from "@/contexts/EmailContext";
import { PersonalizeProvider } from "@/contexts/PersonalizeContext";
import AppRoutes from "@/routes/AppRoutes";
import { FilterProvider } from "./contexts/FilterSearch";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initialOptions } from "./contexts/PaypalContext";
// import { SocketProvider } from "./Contexts/Socket";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { getConfig } from "./api/getConfig";
import Loader from "@/components/Loader/Loader";

const queryClient = new QueryClient();

const App = () => {
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);

  useEffect(() => {
    getConfig()
      .then((config) => setGoogleClientId(config.googleClientId))
      .catch((err) => console.error("Failed to load config:", err));
  }, []);

  if (!googleClientId) {
    return <Loader hSize="100" useSmallLoading={true} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GoogleOAuthProvider clientId={googleClientId}>
              <EmailProvider>
                <FilterProvider>
                  <PersonalizeProvider>
                    <PayPalScriptProvider options={initialOptions}>
                      <AppRoutes />
                    </PayPalScriptProvider>
                  </PersonalizeProvider>
                </FilterProvider>
              </EmailProvider>
            </GoogleOAuthProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
