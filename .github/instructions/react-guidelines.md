# React Specific Instructions

## Component Guidelines

- Use functional components exclusively
- Implement proper TypeScript interfaces for props
- Use React.memo for performance optimization when needed
- Always destructure props in function signature

## Hook Usage

- Create custom hooks for reusable logic
- Use useCallback and useMemo judiciously
- Implement proper cleanup in useEffect
- Handle loading and error states

## State Management

- Use useState for local component state
- Use useContext for shared state
- Implement proper TypeScript types for context values
- Avoid prop drilling with context

## Example Component Structure

```tsx
interface ComponentProps {
  // Define props here
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks at the top
  // Event handlers
  // Render logic
  return <div>...</div>;
};
```
