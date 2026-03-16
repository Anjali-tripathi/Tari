**File Overview**

- **What this file does:** `LoaderComponent` displays a centered Material spinner used as a global loading overlay.
- **Why this file exists:** To provide a simple visual indicator while the app performs background tasks (HTTP requests, navigation, etc.).
- **Role in architecture:** Shared UI component, typically shown/hidden by a top-level component that subscribes to `LoadingService.loading$`.

**Template**

- `loader.component.html` contains a `<mat-spinner>` inside an overlay div.

**Programming concepts**

- Presentational component with no inputs/outputs.

**Best practices / improvements**

- The global loader display should be toggled by a host (e.g., `AppComponent`) subscribing to `LoadingService.loading$`.
- Add ARIA attributes for accessibility.

**Summary**

`LoaderComponent` is a minimal spinner component for global loading states.