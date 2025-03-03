# TinyQuoteBlock Development Guide

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler then Vite)
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Code Style
- Use TypeScript with strict type checking
- Prefer functional components with hooks
- Define explicit interfaces for component props
- No unused variables or parameters
- Consistent import ordering (React first, then libraries, then local)
- Use ES modules syntax
- Descriptive, camelCase variable names
- PascalCase for component names
- Inline styles for simplicity in this project
- Prefer early returns for error handling
- Add JSDoc comments for non-obvious functions

## Project Structure
- Vite-based React application
- TinyMCE integration for rich text editing
- Uses react-beautiful-dnd for drag-and-drop functionality