# Tic‑Tac‑Toe (Japanese theme)

A small React + Vite Tic‑Tac‑Toe app with a polished Japanese-inspired UI. Designed as a learning/demo project with a 3×3 board, win detection, restart flow, and accessible UI hooks.

## Features

- 3×3 Tic‑Tac‑Toe board with click-to-play interaction
- Win detection for X and O with an immediate game-over state
- Restart button and clear status message (winner emoji)
- Japanese-inspired styling using `Noto Sans JP` / `Noto Serif JP`
- Responsive layout and reduced-motion support

## Quick Start

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

- [src/main.jsx](src/main.jsx) — app entry
- [src/App.jsx](src/App.jsx) — app shell
- [src/TicTacToeGame/Board.jsx](src/TicTacToeGame/Board.jsx) — game logic and UI
- [src/TicTacToeGame/Square.jsx](src/TicTacToeGame/Square.jsx) — presentational cell component
- [src/TicTacToeGame/Board.css](src/TicTacToeGame/Board.css) — board and UI styles
- [src/index.css](src/index.css) — global theme tokens & fonts
- package.json — scripts and deps

## Component details

- `Board` (src/TicTacToeGame/Board.jsx)
  - Manages `state` (Array(9)) and `isXTurn` boolean.
  - `checkWinner(state)` returns the winning symbol (`"X"` or `"O"`) or `null`.
  - Prevents moves after a win; shows status message and `Restart Game` button.

- `Square` (src/TicTacToeGame/Square.jsx)
  - Dumb presentational component that accepts `value` and `onClick` props.

## Styling & UX

- Global palette and fonts are defined in [src/index.css](src/index.css).
- The board uses rounded cells, soft shadows, hover/active states, and a clear status area. Fonts: `Noto Sans JP` and `Noto Serif JP` are imported in CSS.

## Accessibility

- Add `role="button"`, `tabIndex=0`, and keyboard handlers to `Square` for keyboard navigation.
- Use `aria-live` on the status element to announce game results.

## Tests & Validation (suggested)

- Unit test `checkWinner` and `handleClick` using Vitest + @testing-library/react.
- Manual QA: ensure win, draw (if implemented), restart, and responsive UI all behave correctly.

## Extending the game

- Draw detection: detect full board with no winner and show a draw message.
- Highlight winning squares: return the winning line indices from `checkWinner` and apply a highlight class.
- AI opponent: add a simple Minimax or heuristic player and trigger it from `Board`.
- Persist scores to `localStorage` and render a small scoreboard.

## Contributing

Fork, branch, and open a PR. Keep UI and logic changes separated when possible.

---

If you'd like, I can add a `CONTRIBUTING.md`, automated tests, or implement draw detection and win-line highlighting next.
