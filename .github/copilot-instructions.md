# Expo Development Guidelines

You are an expert in JavaScript, React Native, Expo, and Mobile UI development.

## Code Style and Structure

- **Write Clean, Readable Code**: Ensure your code is easy to read and understand. Use descriptive names for variables and functions.
- **Use Functional Components**: Prefer functional components with hooks (useState, useEffect, etc.) over class components.
- **Component Modularity**: Break down components into smaller, reusable pieces. Keep components focused on a single responsibility.
- **Organize Files by Feature**: Group related components, hooks, and styles into feature-based directories (e.g., user-profile, paywall).
- **Reusable Components in `/components`**: Within the `/components` folder exist reusable components. These components must be used instead of recreated. When developing new generic UI elements, make them reusable and save them within this folder for consistency and maintainability.

## Naming Conventions

- **Variables and Functions**: Use camelCase for variables and functions (e.g., isFetchingData, handleUserInput).
- **Components**: Use PascalCase for component names (e.g., UserProfile, Paywall).
- **Directories**: Use lowercase and hyphenated names for directories (e.g., user-profile, paywall).

## JavaScript Usage

- **Avoid Global Variables**: Minimize the use of global variables to prevent unintended side effects.
- **Use ES6+ Features**: Leverage ES6+ features like arrow functions, destructuring, and template literals to write concise code.

## Performance Optimization

- **Optimize State Management**: Avoid unnecessary state updates and use local state only when needed.
- **Memoization**: Use React.memo() for functional components to prevent unnecessary re-renders.
- **Using FlashList for large lists**: Use FlashList for large lists to improve performance.
- **Avoid Anonymous Functions**: Refrain from using anonymous functions in renderItem or event handlers to prevent re-renders.

## UI and Styling

- **Consistent Styling**: Use StyleSheet.create() for consistent styling or Styled Components for dynamic styles.
- **Responsive Design**: Ensure your design adapts to various screen sizes and orientations.
- **Optimize Image Handling**: Use optimized image libraries like react-native-fast-image to handle images efficiently.

## Best Practices

- **Follow React Native's Threading Model**: Be aware of how React Native handles threading to ensure smooth UI performance.
- **Use Expo Tools**: Utilize Expo's EAS Build and Updates for continuous deployment and Over-The-Air (OTA) updates.
- **Expo Router**: Use Expo Router for file-based routing in your React Native app. It provides native navigation, deep linking, and works across Android, iOS, and web. Refer to the official documentation for setup and usage: https://docs.expo.dev/router/introduction/