# Vanilla JS Pokédex Coding Style Guide

This guide outlines the specific patterns and conventions used in this codebase, focusing on vanilla JavaScript implementations of modern features and project-specific logic.

## 1. Asynchronous Data Handling
*   **Fetch-then-Render:** Always use `async/await` for API interactions.
*   **Global Smart Caching:** Implement a simple object-based cache (`globalCache`) to store API responses. Check the cache before making any network requests to improve performance and reduce API load.
    ```javascript
    async function fetchData(url) {
        if (globalCache[url]) return globalCache[url];
        // ... fetch and then store in globalCache[url]
    }
    ```
*   **Loading States:** Explicitly wrap asynchronous operations in a `toggleLoading(true/false)` pattern to manage UI feedback.

## 2. DOM Manipulation & Templating
*   **Template Strings:** Use backticks for HTML generation.
*   **Incremental Rendering:** For lists, use `innerHTML +=` within loops to render items one by one rather than building a massive string first. This supports the "Lazy-Loading" feel.
*   **ID-based Selectors:** Prefer `document.getElementById` for primary UI hooks over `querySelector`.

## 3. Search & Filtering Logic
*   **Bi-directional Mapping:** Use local dictionaries (e.g., `germanToEnglish`) to support multi-language search in a client-side environment.
*   **Polymorphic Search:** Search functions should handle strings (names) and numbers (IDs) simultaneously. Use `isNaN()` checks to determine the search intent.
*   **Input Validation:** Implement a minimum character threshold (e.g., `< 3`) for string-based live searches to prevent excessive rendering on short, non-specific terms.

## 4. Function Design
*   **Single Responsibility:** Separate data fetching logic (in `api.js`) from UI rendering logic (in `script.js` or `overlay.js`).
*   **Url-to-ID Parsing:** When dealing with RESTful APIs like PokéAPI, extract IDs from URLs using path slicing: 
    ```javascript
    let id = p.url.split('/').slice(-2, -1)[0];
    ```
*   **Atomic Rendering:** Create "Single" render functions (e.g., `loadAndRenderSinglePokemon`) that can be reused by both the initial load and the search results.

## 5. State Management
*   **Offset-based Pagination:** Use global variables (e.g., `currentOffset`) to track the application state for "Load More" functionality.
*   **Reset Patterns:** Provide a `resetApp()` function to restore the UI to its initial state when search inputs are cleared.

## 6. Naming Conventions
*   **Iterators:** Traditional `for` loops with `i` are preferred for sequential asynchronous processing of arrays.
*   **Helper Prefixes:**
    *   `fetch...`: Functions that primarily perform network requests.
    *   `generate...HTML`: Functions returning template strings.
    *   `perform...`: High-level functions triggered by UI events.
    *   `toggle...`: Functions switching UI states (loading, overlays).