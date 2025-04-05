
import { createRoot } from 'react-dom/client'
import RootLayout from './app/layout'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <RootLayout>
    <App />
  </RootLayout>
);
