**File Overview**

- **What this file does:** `notification.service.ts` wraps Angular Material's `MatSnackBar` to provide simple `success`, `error`, and `info` notification helpers used across the app.
- **Why this file exists:** To centralize UX messaging and standardize appearance/duration of snackbars.
- **Role in architecture:** UI helper service used by components and interceptors to display messages.

**API**

- `success(msg: string)`: shows a green-style snack for 3s.
- `error(msg: string)`: shows a red-style snack for 4s.
- `info(msg: string)`: shows default snack for 3s.

**Best practices / improvements**

- Consider adding configurable positions or action callbacks if needed.
- Use centralized CSS classes in `styles.scss` for consistent theming.

**Summary**

`NotificationService` provides a thin, consistent wrapper around `MatSnackBar` for uniform notifications.