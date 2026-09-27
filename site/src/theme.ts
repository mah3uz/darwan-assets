import { ref, watch } from "vue";

export type Choice = "system" | "light" | "dark";

// Keep in step with the inline script in index.html, which applies the same choice before first paint.
const key = "darwan-theme";

function read(): Choice {
  try {
    const v = localStorage.getItem(key);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export const choice = ref<Choice>(read());
const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

function apply() {
  const light = choice.value === "light" || (choice.value === "system" && prefersLight.matches);
  document.documentElement.dataset.theme = light ? "light" : "dark";
}

prefersLight.addEventListener("change", apply);
watch(choice, (c) => {
  try {
    if (c === "system") localStorage.removeItem(key);
    else localStorage.setItem(key, c);
  } catch {
    // Without storage the choice lasts until the page closes.
  }
  apply();
});
apply();
