# Local.Windsurf Rules

This document outlines essential rules and best practices for the local development environment of the bndy platform. These rules focus on IDE workflow, development practices, and local environment management to ensure consistency and efficiency.

## Server Management

- **Always start a new server after making changes** to ensure they take effect properly
- **Always kill all existing related servers** that may have been created in previous testing before trying to start a new server
- **Use consistent ports** for each application to avoid conflicts (e.g., 3000 for landing, 3001 for live, 3002 for core)
- **Check terminal output for errors** immediately after starting servers
- **Use nodemon or similar tools** for automatic server restarts during development

## Code Development

- **Always look for existing code to iterate on** instead of creating new code
- **Do not drastically change the patterns** before trying to iterate on existing patterns
- **Focus on the areas of code relevant to the task**
- **Do not touch code that is unrelated to the task**
- **Be careful to only make changes that are requested** or you are confident are well understood
- **When fixing an issue or bug, do not introduce a new pattern or technology** without first exhausting all options for the existing implementation
- **If you introduce a new pattern, remove the old implementation** afterwards so we don't have duplicate logic
- **Always refer to the STYLEGUIDE.MD when creating or modifying any UI elements**

## UI Component Consistency

- **Study existing patterns first** before implementing a new feature or component
- **Reference the style guide** for color choices, UI components, and design patterns
- **Use shared components** from bndy-ui or the application's component library rather than creating new ones
- **Maintain layout consistency** by using appropriate layout components (e.g., MainLayout)
- **Follow type patterns** when creating new types, following existing structure
- **Ensure color consistency** by using brand colors defined in the style guide:
  - Primary: Orange (#f97316) for CTAs and primary actions
  - Secondary: Cyan (#06b6d4) for secondary elements
  - Dark slate and white for backgrounds and text
- **Support dark mode** in all UI components with proper transitions
- **Use consistent form controls** across the application (e.g., same style for multi-select)
- **Implement proper image handling** with upload options rather than just URL fields
- **Run a component checklist** before implementation:
  - Does a similar component already exist?
  - Does it follow the style guide?
  - Is it consistent with existing patterns?
  - Does it support dark mode?
  - Does it use the correct layout structure?

## Code Quality

- **Keep the codebase very clean and organized**
- **Avoid writing scripts in files if possible**, especially if the script is likely only to be run once
- **Avoid having files over 200-300 lines of code**. Refactor at that point
- **Write thorough tests for all major functionality**
- **Use consistent formatting** with Prettier or ESLint
- **Run linters before committing code**
- **Check for TypeScript errors** before finalizing any coding session

## Local Data Management

- **Mocking data is only needed for tests**, never mock data for dev or prod
- **Never add stubbing or fake data patterns** to code that affects the dev or prod environments
- **Use the Firebase emulator** for local development when possible
- **Seed local databases consistently** across the team
- **Never overwrite my .env file without first asking and confirming**

## IDE Setup Recommendations

- **Use VS Code** with consistent extensions across the team:
  - ESLint
  - Prettier
  - TypeScript support
  - Firebase extension
  - React Developer Tools
  - Jest Runner
- **Share and standardize workspace settings** in the repository (.vscode/settings.json)
- **Configure auto-formatting on save** for consistent code style
- **Use debugging configurations** in launch.json for efficient troubleshooting
- **Enable TypeScript error checking** in the editor
- **Configure terminal integration** within the IDE for server management

## Environment Configuration

- **Maintain separate .env files** for different environments (.env.development, .env.test)
- **Document required environment variables** in a .env.example file
- **Keep sensitive values out of source control**
- **Use consistent naming conventions** for environment variables
- **Validate required environment variables** on application startup
- **Configure proper CORS settings** for local development

## Cross-Application Development

- **Run required dependent services locally** when working on inter-connected features
- **Use consistent local URLs** for service communication
- **Test cross-app authentication flows** regularly during development
- **Use linked local packages** when developing shared components (e.g., npm link for bndy.ui)

## Local Performance Considerations

- **Disable unnecessary logging** in development to improve console readability
- **Use React DevTools profiler** to identify performance issues early
- **Implement lazy loading** for components not immediately visible
- **Be mindful of Firebase read/write operations** even in development
- **Use caching strategies** that can be tested locally

## Version Control for Local Development

- **Work in feature branches** for all development work
- **Make atomic, focused commits** with clear messages
- **Pull changes from main branch regularly** to avoid drift
- **Resolve merge conflicts locally** before pushing
- **Use git hooks** for pre-commit linting and testing

## Testing in Local Environment

- **Run tests locally before committing**
- **Use watch mode for tests** during active development
- **Maintain test database separation** from development data
- **Test mobile views using responsive design mode or device emulation**
- **Test both light and dark themes** in local development

## Local Build Optimization

- **Use the development build for local work** - never production build unless testing production issues
- **Monitor bundle size locally** using tools like webpack-bundle-analyzer
- **Configure source maps properly** for debugging
- **Implement fast refresh / hot reloading** for productivity
- **Consider implementing module/path aliases** for cleaner imports

## Local Security Practices

- **Never use production credentials in local development**
- **Set appropriate local Firebase security rules** that match production
- **Test authentication flows with test accounts only**
- **Don't store sensitive user data in local development databases**

## Authentication Rules

- **Single Auth Context Rule:** Only use the AuthProvider and useAuth exported from `bndy-ui/components/auth`. Never define or use a local AuthContext, AuthProvider, or useAuth in any consuming app.
- **No Local Auth Logic:** Do not duplicate authentication state, token decoding, or user state logic in the app. All such logic must reside in the shared bndy-ui context.
