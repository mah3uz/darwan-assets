import { init, track as send } from "@plausible-analytics/tracker";

// Set at build time (site/.env.production); without it, as in local dev or a fork, the site sends nothing.
const endpoint = import.meta.env.VITE_PLAUSIBLE_ENDPOINT;

// Page views, including vue-router's navigations, are captured on their own; outbound links cover GitHub and the AUR.
if (endpoint) init({ domain: "darwan.dev", endpoint, outboundLinks: true });

export function track(event: string, props: Record<string, string>) {
  if (endpoint) send(event, { props });
}
