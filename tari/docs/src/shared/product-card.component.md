**File Overview**

- **What this file does:** `ProductCardComponent` is a presentational component that displays product details (image, name, price, meta) and emits an event when the user clicks "Add to Cart".
- **Why this file exists:** To encapsulate product display and action UI so pages can reuse it for lists and grids.
- **Role in architecture:** Shared presentational component used by menu and other listing components.

**Inputs / Outputs**

- `@Input() product: Product` — the product object to render (required).
- `@Output() addToCart = new EventEmitter<Product>()` — emitted when the user clicks the Add to Cart button.

**Template highlights (`product-card.component.html`)**

- Uses Angular Material `mat-card` with `mat-card-image` for the product image.
- Displays name, formatted price, description, availability chip, rating, and preparation time.
- The Add to Cart button is disabled when `product.availability` is false and triggers `addToCart.emit(product)` on click.

**Programming concepts**

- Input binding allows parent components to pass `product` to the card.
- Output `EventEmitter` provides a simple event API for parent components to handle cart actions.
- Pipes: uses Angular `number` pipe to format rating.

**Best practices / improvements**

- Consider using the `currencyFormat` pipe for price display (project defines a pipe) to keep formatting consistent.
- Add `ChangeDetectionStrategy.OnPush` for better performance in large lists.

**Summary**

`ProductCardComponent` is a reusable UI piece for product listings that emits user actions to parent components.