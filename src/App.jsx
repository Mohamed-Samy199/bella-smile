import FullPageLoader from "./components/ui/FullPageLoader.jsx";
import { useInitAuth } from "./hooks/auth/useInitAuth.js";
import AppRoutes from "./routes/index.jsx";

function App() {
  const { isLoading } = useInitAuth();

  if (isLoading) return <FullPageLoader message="Loading..." />;

  return <AppRoutes />;
}

export default App;