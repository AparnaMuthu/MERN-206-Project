import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { ToastProvider } from './components/Toast.tsx';
import AppRouter from './routes/AppRouter.tsx';

/**
 * App is the root component. It sets up three wrappers:
 *
 * 1. <Provider store={store}> — Makes Redux accessible everywhere
 * 2. <ToastProvider> — Makes toast notifications accessible everywhere
 * 3. <AppRouter /> — Handles routing
 */
function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </Provider>
  );
}

export default App;
