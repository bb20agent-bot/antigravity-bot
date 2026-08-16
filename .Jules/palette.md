## 2024-05-18 - [Accessibility Refactor]
**Learning:** Adding new hooks like `useRef` directly inside a file when implementing UX features like clipboard copying requires explicitly verifying and updating the file imports. `CheckCircle` was properly exported by lucide-react, but `useRef` was missing from React.
**Action:** Next time when extracting components, ensure all hooks (e.g. `useState`, `useEffect`, `useRef`) and components (e.g. `CheckCircle`, `Copy`) used are explicitly imported at the top of the file.
