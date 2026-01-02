import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "./lib/sentry";
import { validateProductionEnv } from "./lib/production-check";

// Validate production environment variables (throws if missing in production)
validateProductionEnv();

// Initialize Sentry before rendering the app
initSentry();

// Mark HTML as loaded to prevent FOUC
// Use requestAnimationFrame to ensure DOM is ready
requestAnimationFrame(() => {
  document.documentElement.classList.add("loaded");
});

// Fallback: ensure page is visible even if CSS fails to load
setTimeout(() => {
  document.documentElement.classList.add("loaded");
}, 100);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  // Always log critical errors, even in production
  console.error("Failed to render app:", error);
  
  // Security: Use safe DOM manipulation instead of innerHTML
  const container = document.createElement("div");
  container.style.cssText = "display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center;";
  
  const content = document.createElement("div");
  
  const heading = document.createElement("h1");
  heading.textContent = "Qualcosa è andato storto";
  content.appendChild(heading);
  
  const paragraph = document.createElement("p");
  paragraph.textContent = "Si è verificato un errore durante l'inizializzazione dell'applicazione.";
  content.appendChild(paragraph);
  
  const button = document.createElement("button");
  button.textContent = "Ricarica Pagina";
  button.style.cssText = "margin-top: 20px; padding: 10px 20px; cursor: pointer;";
  button.addEventListener("click", () => window.location.reload());
  content.appendChild(button);
  
  container.appendChild(content);
  rootElement.appendChild(container);
}
