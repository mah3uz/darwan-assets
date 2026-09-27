import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./analytics";
import "./style.css";

const app = createApp(App).use(router);
// Mount once the first page's code has loaded, so the header and footer never show around an empty page.
router.isReady().then(() => app.mount("#app"));
