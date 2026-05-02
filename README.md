# 🧠 DS&A Visual Lab

**An interactive, browser-based Data Structures & Algorithms learning platform** built with vanilla HTML, CSS, and JavaScript. Every concept comes alive through animated visualizations, live code panels, and hands-on operations — no installation required.

> **Group B DSA — "The Legends"**
> Makerere University · Algorithms Course Project
> Built by [mdavidjeremiah](https://github.com/mdavidjeremiah) & Litmus Tech Solutions

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Modules](#-live-modules)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Module Details](#-module-details)
- [Tech Stack](#-tech-stack)
- [Team](#-team)
- [License](#-license)

---

## 🔍 Overview

DS&A Visual Lab is a full-featured educational web application that makes classic computer science concepts tangible. Instead of reading about algorithms in textbooks, users can **interact with them in real time** — inserting nodes, triggering traversals, watching sort animations step by step, and reading the actual implementation code side by side.

The project covers **7 core DSA topics** through dedicated, styled pages — all connected by a unified navigation and design system.

---

## 🚀 Live Modules

| # | Module | Page | Key Concepts |
|---|--------|------|-------------|
| 01 | **Stack** | `stack.html` | Push, Pop, Peek — LIFO |
| 02 | **Queue** | `queue.html` | Enqueue, Dequeue — FIFO |
| 03 | **Linked List** | `linked-list.html` | Insert, Delete, Traverse — Singly Linked |
| 04 | **Binary Search Tree** | `tree.html` | Insert, Search, In/Pre/Post-order Traversal |
| 05 | **Graph** | `graph.html` | Add Vertex/Edge, BFS, DFS — Adjacency List |
| 06 | **Sorting Algorithms** | `sorting.html` | Bubble, Selection, Insertion, Merge, Quick Sort |
| 07 | **Searching Algorithms** | `searching.html` | Linear Search, Binary Search |

---

##  Features

- **Animated Visualizations** — Watch elements move through data structures in real time with color-coded states (comparing, swapping, sorted, visited)
- **Live Operation Panel** — Insert, delete, search, and traverse structures interactively via on-screen controls
- **Complexity Reference Cards** — Each module shows Big-O for best/average/worst time and space complexity at a glance
- **Syntax-Highlighted Code Panel** — The actual JavaScript implementation is displayed alongside every visualization
- **Sorting Stats Dashboard** — Track comparison count, swap count, and array size live during a sort
- **Graph Canvas** — Click to place vertices; click two vertices to create an edge; run BFS or DFS and watch the traversal log fill in
- **Speed & Size Controls** — Adjust animation speed (1×–10×) and array size (10–50 elements) for sorting visualizations
- **Responsive Design** — Built with a modern layout system using Space Mono + Syne typefaces and a dark-mode-friendly palette
- **No Dependencies** — Pure HTML/CSS/JS. No build tools, no npm install, no bundler required

---

## 📁 Project Structure

```
DSA-Implementations/
│
├── index.html           # Landing / home page (module hub)
├── stack.html           # Stack ADT module
├── queue.html           # Queue ADT module
├── linked-list.html     # Linked List module
├── tree.html            # Binary Search Tree module
├── graph.html           # Graph ADT module
├── sorting.html         # Sorting Algorithms module
├── searching.html       # Searching Algorithms module
│
├── scripts/             # JavaScript implementations
│   ├── sorting.js       # Bubble, Selection, Insertion, Merge, Quick Sort
│   ├── graph.js         # Graph class — BFS, DFS, canvas rendering
│   └── ...              # One script per module
│
├── styles/              # CSS stylesheets
│   ├── sorting.css
│   ├── graph.css
│   └── ...              # One stylesheet per module
│
└── .gitignore
```

---

## 🛠 Getting Started

Since this is a plain HTML project, there is **no build step**.

### Option 1 — Open directly

```bash
git clone https://github.com/mdavidjeremiah/DSA-Implementations.git
cd DSA-Implementations
# Open index.html in any modern browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Option 2 — Local dev server (recommended for correct asset paths)

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using VS Code
# Install the "Live Server" extension, then right-click index.html → "Open with Live Server"
```

Then navigate to `http://localhost:8080` in your browser.

> **Note:** Some asset paths use root-relative paths (`/styles/`, `/scripts/`). A local server ensures these resolve correctly.

---

## 📖 Module Details

### Sorting Algorithms
Five classic algorithms with a bar-chart animator. Each bar changes colour to reflect its state:
- 🟠 **Orange** — currently being compared
- 🔴 **Red** — actively swapping
- 🟢 **Green** — in its sorted final position

Algorithm complexity cards appear below the visualizer for instant reference.

### Graph ADT
An interactive canvas-based graph builder. Users can:
- Click anywhere on the canvas to place a named vertex
- Click two vertices in sequence to draw an undirected edge
- Run **BFS** (breadth-first, level-by-level) or **DFS** (depth-first, recursive) from any start vertex
- Read the traversal order in a live log panel
- Inspect the current adjacency list at any time

The implementation uses JavaScript's `Map` for the adjacency list, mirroring production-grade patterns.

### Binary Search Tree
Full BST operations with visual node rendering: insert values, search for a key, and trigger in-order, pre-order, or post-order traversals with animated highlighting.

### Stack & Queue
Classic LIFO and FIFO structures with push/pop and enqueue/dequeue animations, alongside a code panel showing the array-backed implementation.

### Searching Algorithms
Side-by-side comparison of Linear Search (O(n)) and Binary Search (O(log n)) on a randomly generated array, with the current probe index highlighted at each step.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (custom properties, flexbox, grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | [Space Mono](https://fonts.google.com/specimen/Space+Mono) · [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts |
| Icons | Font Awesome (CDN) |
| Rendering | HTML5 Canvas API (Graph module) |

No frameworks. No build pipeline. Maximum portability.

---

## 👥 Team

**Group B DSA — Makerere University**

| Role | Contact |
|------|---------|
| Lead Developer | [@mdavidjeremiah](https://github.com/mdavidjeremiah) |
| Organization | Litmus Tech Solutions |
| Email | litmustechsolutions@gmail.com |
| Location | Makerere University, Jinja Campus |

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-module`
3. Commit your changes: `git commit -m "Add Trie module with prefix search"`
4. Push to the branch: `git push origin feature/my-new-module`
5. Open a Pull Request

Ideas for future modules: **Heap**, **Hash Table**, **Trie**, **Dynamic Programming visualizer**.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by Group B DSA · Makerere University · © 2026 Litmus Tech Solutions

</div>
