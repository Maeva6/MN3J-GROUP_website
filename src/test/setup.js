import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom n'implémente pas IntersectionObserver, utilisé par framer-motion
// (whileInView, animations au scroll) sur beaucoup de pages du site — sans
// ce stub, tout composant animé fait planter son rendu en test.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
window.IntersectionObserver = IntersectionObserverStub;
global.IntersectionObserver = IntersectionObserverStub;

// jsdom n'implémente pas non plus window.scrollTo (utilisé par
// App.jsx > ScrollToTop à chaque changement de route) — sans stub, chaque
// navigation en test logue un avertissement "Not implemented" dans la console.
window.scrollTo = () => {};
