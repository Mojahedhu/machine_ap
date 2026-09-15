# ImageCombiner Architecture

This document describes the refactored architecture of the `ImageCombiner` component. The original `index.tsx` was a robust but monolithic file of nearly 2800 lines. The new architecture focuses on a separation of concerns, dividing logic into smaller, maintainable pieces: Custom Hooks, Constants, Icons, and UI Tab Components.

## Directory Structure

```text
src/components/image-combiner/
├── index.tsx                         // Main orchestrator component
├── index.original.tsx                // Backup of the monolithic original code
├── architecture.md                   // This documentation file
├── icons.tsx                         // All SVG icons used within the components
├── constants/
│   └── ai-models.ts                  // AI model and provider configurations
├── hooks/
│   ├── use-code-generation.ts        // Logic for code generation and language conversion
│   ├── use-text-generation.ts        // Logic for text chat generation and auto-scrolling
│   ├── use-global-shortcuts.ts       // Global keyboard shortcuts and clipboard paste listeners
│   ├── use-drag-drop.ts              // Drag and drop event listeners
│   ├── use-image-actions.ts          // Fullscreen, copy, download, and open image actions
│   ├── use-image-upload.ts           // [Pre-existing] Image upload logic
│   ├── use-aspect-ration.ts          // [Pre-existing] Aspect ratio logic
│   ├── use-persistent-history.ts     // [Pre-existing] LocalStorage history logic
│   └── use-image-generation-props.ts // [Pre-existing] Image generation orchestrator
├── tabs/
│   ├── text-generation-tab.tsx       // UI for the Text chat interface
│   ├── code-generation-tab.tsx       // UI for Code editing, generation, and language selection
│   ├── image-generation-tab.tsx      // UI for Image combination and history (derived from main component sections)
│   └── other-generation-tab.tsx      // UI for AI tools like audio, video, strings, etc.
└── modals/
    ├── ai-model-selector-modal.tsx   // Modal for selecting LLM provider and model
    └── language-conversion-modal.tsx // Modal confirming code language translation
```

## Guiding Principles

1. **Separation of UI and Logic:** The state (useState, useCallback, useEffect) for specific features is extracted into dedicated hooks, keeping the UI components declarative.
2. **Modularity:** Isolated components limit side effects and improve ease of testing or replacement.
3. **Scalability:** Adding new AI tabs (e.g., Audio, Video) or new features doesn't clutter the main file and can be developed independently.
4. **Performance:** By using smaller sub-components and extracting logic into specialized hooks, we reduce unnecessary re-renders of the entire `ImageCombiner` orchestration when unrelated state (like the code window) updates.
