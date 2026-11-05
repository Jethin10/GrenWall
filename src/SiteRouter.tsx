import { lazy, Suspense } from "react";

const Craftflow = lazy(() => import("./pages/Craftflow"));
const App = lazy(() => import("./App"));

export default function SiteRouter() {
  const isCraftflow = /^\/craftflow(?:\/(?:index\.html)?)?$/.test(
    window.location.pathname,
  );
  return (
    <Suspense
      fallback={
        <div
          role="status"
          style={{
            minHeight: "100dvh",
            display: "grid",
            placeItems: "center",
            background: "#f7f8fa",
            color: "#20262f",
            fontSize: "24px",
            letterSpacing: "-1px",
          }}
        >
          {isCraftflow ? "craftflow" : "Grenwall"}
        </div>
      }
    >
      {isCraftflow ? <Craftflow /> : <App />}
    </Suspense>
  );
}
