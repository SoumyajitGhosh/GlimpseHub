import { useRegisterSW } from "virtual:pwa-register/react";

import TextButton from "../Button/TextButton/TextButton";

/**
 * Service-worker lifecycle toast. Rendered once, globally (from App).
 *
 * - `offlineReady` — the app shell has been cached and works offline now.
 * - `needRefresh`  — a new version was precached; the user chooses when to
 *   activate it (the plugin is registered with `registerType: 'prompt'`).
 *
 * In dev there is no service worker (`devOptions` is not enabled), so
 * `useRegisterSW` simply never flips either flag and nothing renders.
 */
const PWABadge = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="pwa-badge" role="status" aria-live="polite">
      <p className="pwa-badge__message">
        {needRefresh
          ? "A new version is available."
          : "GlimpseHub is ready to work offline."}
      </p>
      <div className="pwa-badge__actions">
        {needRefresh && (
          <TextButton onClick={() => updateServiceWorker(true)} blue bold>
            Reload
          </TextButton>
        )}
        <TextButton onClick={close} bold>
          Dismiss
        </TextButton>
      </div>
    </div>
  );
};

export default PWABadge;
