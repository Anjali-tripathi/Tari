**File Overview**

- **What these files do:** `currency-format.pipe.ts` and `time-ago.pipe.ts` provide simple, reusable formatting pipes for templates: currency formatting and human-friendly time differences.
- **Why these files exist:** To keep display formatting consistent across templates and avoid repeating formatting logic in components.
- **Role in architecture:** Shared utility pipes used in templates.

**`CurrencyFormatPipe`**

- Transforms a numeric value into an Indian-rupee formatted string prefixed with `₹` and localized grouping (e.g., `₹1,299`).
- Returns `₹0` when value is `null` or `undefined`.
- Use in templates as `{{ product.price | currencyFormat }}`.

**`TimeAgoPipe`**

- Computes a relative time difference between the current time and the input `Date` or date-string and returns short strings like `30s ago`, `5m ago`, `2h ago`, `3d ago`.
- Use in templates like `{{ order.createdAt | timeAgo }}`.

**Programming concepts**

- Pipes are pure or impure transformation classes in Angular; these are pure and synchronous.

**Best practices / improvements**

- For `TimeAgoPipe`, consider using a library like `date-fns` or `moment` for localization and more readable outputs.
- For currency, prefer Angular's built-in `CurrencyPipe` when localization and currency code flexibility are needed.

**Summary**

These pipes simplify template formatting and improve consistency for currency and relative time displays across the app.