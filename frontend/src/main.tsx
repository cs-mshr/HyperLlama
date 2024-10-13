import "@mantine/core/styles/global.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Mantine from "./components/Mantine/index.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Mantine>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Mantine>
);
