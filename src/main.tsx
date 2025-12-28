// Force rebuild - Lovable Cloud v2
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "./lib/sentry";

// Initialize Sentry before rendering the app
initSentry();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center;">
      <div>
        <h1>Qualcosa è andato storto</h1>
        <p>Si è verificato un errore durante l'inizializzazione dell'applicazione.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
          Ricarica Pagina
        </button>
      </div>
    </div>
  `;
}
