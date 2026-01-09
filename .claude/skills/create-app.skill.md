# Create ChatGPT App

You are an expert at building ChatGPT applications using the OpenAI Apps SDK. Your goal is to create fully functional apps in one shot that work with ChatGPT.

## Important: Check Latest SDK UI Components

Before building any app, **you MUST fetch the latest SDK UI component documentation** from this Storybook:

**https://openai.github.io/apps-sdk-ui/?path=/docs/overview-introduction--docs**

Always fetch this URL first to get the current list of available components, their props, variants, and usage examples. The component library may have been updated since your training data.

## Project Structure

This repository builds ChatGPT app UIs with the following structure:

```
src/apps/<appname>/
  index.tsx       # App entry point with React component
  styles.css      # App styles (Tailwind + OpenAI SDK UI)
  types.ts        # TypeScript types for the app
  helpers.ts      # Helper/utility functions
```

## Build System

- **Build**: `node build.js <appname>`
- **Output**: `dist/<appname>.js` (minified ESM bundle ~320KB)
- **Serve**: `node server.js` (serves at `http://localhost:3000/<appname>`)
- **Distribution**: Built apps are committed to dist/ for static hosting via raw GitHub URLs

## Required App Structure

### 1. types.ts Template

```ts
// Always use `type` instead of `interface` for type definitions
export type ToolData = {
  // Define your data structure that ChatGPT will send
  message?: string
  items?: string[]
}
```

### 2. helpers.ts Template

```ts
// Helper/utility functions for the app
export function formatValue(value: string): string {
  return value.trim()
}
```

### 3. index.tsx Template

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useToolOutput } from '../../lib/hooks'
import { ToolData } from './types'
// Import helpers as needed:
// import { formatValue } from './helpers'
// Import OpenAI SDK UI components as needed:
// import { Button } from '@openai/apps-sdk-ui/components/Button'
// import { Alert } from '@openai/apps-sdk-ui/components/Alert'
// import { Textarea } from '@openai/apps-sdk-ui/components/Textarea'

function App() {
  // Access data from ChatGPT tool calls
  const data = useToolOutput<ToolData>()

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Your App Title</h1>
      {/* Your app UI here */}
    </div>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
```

### 4. styles.css Template

```css
@import 'tailwindcss';
@import '../../../node_modules/@openai/apps-sdk-ui/dist/es/styles/index.css';
@source '../../../node_modules/@openai/apps-sdk-ui';
```

## Available Hooks

The project includes custom hooks in `src/lib/hooks/`:

### useToolOutput<T>()
Access data from ChatGPT tool responses:
```tsx
const data = useToolOutput<MyDataType>()
// Returns window.openai.toolOutput with type safety
```

### useWidgetState<T>(initialState)
Persist state across conversation turns:
```tsx
const [state, setState] = useWidgetState<{ count: number }>({ count: 0 })
// Uses window.openai.setWidgetState for persistence
```

### useOpenAiGlobal(key)
Access ChatGPT context properties:
```tsx
const theme = useOpenAiGlobal('theme') // 'light' | 'dark' | 'auto'
const locale = useOpenAiGlobal('locale')
const displayMode = useOpenAiGlobal('displayMode') // 'inline' | 'pip' | 'fullscreen'
const view = useOpenAiGlobal('view') // 'mobile' | 'desktop'
const maxHeight = useOpenAiGlobal('maxHeight')
```

## window.openai API

Your app runs in a ChatGPT iframe with access to:

```typescript
window.openai = {
  // Data from ChatGPT
  toolOutput: unknown,           // Latest tool response data
  toolInput: unknown,            // Tool input parameters
  widgetState: unknown,          // Persisted widget state

  // Context properties
  theme: 'light' | 'dark' | 'auto',
  displayMode: 'inline' | 'pip' | 'fullscreen',
  view: 'mobile' | 'desktop',
  locale: string,
  maxHeight: number,
  safeArea: { top, right, bottom, left },
  userAgent: string,

  // Methods
  setWidgetState: (state: unknown) => void,
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>,
  sendFollowUpMessage: (options: { prompt: string }) => Promise<void>,
  uploadFile: (file: File) => Promise<{ fileId: string }>,
  getFileDownloadUrl: (options: { fileId: string }) => Promise<{ downloadUrl: string }>,
  requestDisplayMode: (options: { mode: 'inline' | 'pip' | 'fullscreen' }) => Promise<void>,
  requestModal: (options: unknown) => Promise<void>,
  notifyIntrinsicHeight: (height: number) => void,
  openExternal: (options: { href: string }) => void,
  setOpenInAppUrl: (options: { href: string }) => void,
  requestClose: () => void,
}
```

## OpenAI Apps SDK UI Components

**IMPORTANT**: Extensively use the ChatGPT SDK UI components. These components are designed to look native in ChatGPT and provide a consistent user experience. Always prefer SDK components over custom HTML elements.

Documentation: https://openai.github.io/apps-sdk-ui/?path=/docs/overview-introduction--docs

### Available Components

Import from `@openai/apps-sdk-ui/components/<ComponentName>`:

- **Alert** - Info, warning, error alerts with actions
- **AppsSDKUIProvider** - Provider for router configuration
- **Avatar** - User/entity avatars
- **Badge** - Status indicators and labels
- **Button** - Primary, secondary, soft, outline variants with colors (primary, secondary, danger, warning, success, info)
- **Checkbox** - Boolean inputs
- **CodeBlock** - Syntax-highlighted code display
- **DatePicker** - Date selection
- **DateRangePicker** - Date range selection
- **EmptyMessage** - Empty state placeholder with title and description
- **Icon** - Extensive icon library (see below)
- **Image** - Optimized image display
- **Indicator** - Status dots/indicators
- **Input** - Text inputs with validation
- **Markdown** - Markdown content renderer
- **Menu** - Dropdown menus
- **Popover** - Popup content
- **RadioGroup** - Radio button groups
- **SegmentedControl** - Tab-like segmented controls
- **Select** - Dropdown selections
- **SelectControl** - Advanced select controls
- **ShimmerText** - Loading text placeholders
- **Slider** - Range sliders
- **Switch** - Toggle switches
- **TagInput** - Tag/chip inputs
- **TextLink** - Styled links
- **Textarea** - Auto-resizing text input
- **Tooltip** - Hover tooltips
- **Transition** - Animation wrappers

### Icons

Import icons from `@openai/apps-sdk-ui/components/Icon`:

```tsx
import { Clock, Sparkles, DollarCircle, ChevronDown, ChevronRight } from '@openai/apps-sdk-ui/components/Icon'
```

Common icons: Calendar, Clock, Check, ChevronDown, ChevronRight, ChevronUp, ChevronLeft, DollarCircle, Download, Edit, ExternalLink, Eye, Heart, Info, Link, Lock, Mail, Maps, Members, Phone, Plus, Search, Settings, Sparkles, Star, Trash, Warning, and many more.

### Design Tokens & Tailwind Classes

Use SDK design tokens for consistent styling:

- **Colors**: `text-primary`, `text-secondary`, `text-success`, `text-warning`, `text-danger`, `text-link`
- **Backgrounds**: `bg-surface`, `bg-surface-secondary`
- **Borders**: `border-default`, `border-subtle`
- **Typography**: `heading-lg`, `heading-md`, `heading-sm`

Example card pattern:
```tsx
<div className="rounded-2xl border border-default bg-surface shadow-lg p-4">
  <h2 className="heading-lg">Title</h2>
  <p className="text-secondary text-sm">Description</p>
</div>
```

See existing apps in `src/apps/` for usage examples.

## MCP Server Integration

Your app works with an MCP server that:

1. **Registers the widget resource**: Serves your app bundle URL
2. **Defines tools**: JSON Schema contracts for ChatGPT to call
3. **Returns responses**: Text content + `structuredContent` for your app
4. **Manages state**: Uses `_meta["widgetSessionId"]` for persistence

Example MCP server pattern:
```javascript
// Register resource
{
  uri: "widget://myapp",
  name: "My App Widget",
  mimeType: "text/html",
  text: `<script type="module" src="${widgetUrl}"></script>`
}

// Tool definition
{
  name: "my_tool",
  description: "Does something",
  inputSchema: { /* JSON Schema */ }
}

// Tool response with structured content
{
  content: [
    { type: "text", text: "Response message" }
  ],
  _meta: {
    structuredContent: { /* data for your app */ },
    widgetSessionId: "unique-id"
  }
}
```

## One-Shot App Creation Workflow

When creating an app, follow this complete workflow:

1. **Understand the requirement**: Clarify what the app should do
2. **Check latest docs**: Fetch updates from official sources listed above
3. **Plan the structure**:
   - What data will ChatGPT send? (define ToolData interface)
   - What UI components are needed?
   - Does it need persistent state?
4. **Create the directory**: `src/apps/<appname>/`
5. **Write index.tsx**: Complete React component with proper imports
6. **Write styles.css**: Include Tailwind and OpenAI SDK UI styles
7. **Build the app**: Run `node build.js <appname>`
8. **Verify output**: Check `dist/<appname>.js` exists
9. **Document usage**: Explain how to integrate with MCP server

## Example Apps Reference

Study these existing examples:
- `src/apps/hello/` - Basic UI with OpenAI components
- `src/apps/counter/` - Simple state management
- `src/apps/example/` - Complete hook demonstrations

## Testing Locally

1. Build: `node build.js myapp`
2. Serve: `node server.js`
3. Open: `http://localhost:3000/myapp`
4. The app runs standalone (window.openai will be undefined until integrated with ChatGPT)

## Integration with ChatGPT

1. Create MCP server that serves your widget URL
2. Define tools that return structured content
3. Use ngrok or similar to expose locally: `ngrok http 3000`
4. Configure ChatGPT with your MCP server endpoint
5. Test in ChatGPT conversations

## Best Practices

1. **Use SDK UI components extensively**: Always prefer components from `@openai/apps-sdk-ui` over custom HTML elements. See docs: https://openai.github.io/apps-sdk-ui/?path=/docs/overview-introduction--docs
2. **Design for dark mode and light mode**: Use SDK design tokens (`text-primary`, `text-secondary`, `bg-surface`, etc.) which automatically adapt to the theme. Never hardcode colors like `text-gray-500` or `bg-white`.
3. **Never use empty lines in JSX**: Keep JSX compact without blank lines between elements.
4. **Keep bundles small**: Only import components you use
5. **Type safety**: Define clear types for tool data (always use `type` instead of `interface`)
6. **File organization**: Put types in `types.ts` and helper functions in `helpers.ts`
7. **Responsive design**: Use Tailwind classes for mobile/desktop
8. **Error handling**: Check if data exists before rendering
9. **Accessibility**: Use semantic HTML and ARIA labels
10. **Performance**: Avoid unnecessary re-renders
11. **State management**: Use useWidgetState for cross-turn persistence

## Common Patterns

### Conditional Rendering
```tsx
{data?.items ? (
  <ul>
    {data.items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
) : (
  <p>No items available</p>
)}
```

### State Persistence
```tsx
const [state, setState] = useWidgetState<MyState>({ initialized: false })

useEffect(() => {
  if (!state?.initialized) {
    setState({ initialized: true, data: [] })
  }
}, [state, setState])
```

### Tool Calling from UI
```tsx
const handleAction = async () => {
  if (window.openai?.callTool) {
    const result = await window.openai.callTool('my_tool', { param: value })
    // Handle result
  }
}
```

### Follow-up Messages
```tsx
const askQuestion = async () => {
  if (window.openai?.sendFollowUpMessage) {
    await window.openai.sendFollowUpMessage({
      prompt: 'Show me more details'
    })
  }
}
```

## Troubleshooting

- **Import errors**: Ensure `@openai/apps-sdk-ui` is installed
- **Build fails**: Check TypeScript errors and import paths
- **Styles not working**: Verify styles.css has correct @import statements
- **Data not showing**: Confirm MCP server returns structuredContent
- **State not persisting**: Check widgetSessionId is included in _meta

## Key Reminders

- Always check documentation links for latest updates before building
- Apps are React components that mount to `root` element
- Use provided hooks for ChatGPT integration
- Bundle size ~320KB includes React, ReactDOM, OpenAI SDK UI, Tailwind
- Built apps work in ChatGPT iframe sandbox
- Test locally first, then integrate with MCP server
- Commit built files to dist/ for static hosting

## Your Task

Create a complete, working ChatGPT app that:
1. Has proper structure (index.tsx + styles.css)
2. Uses appropriate OpenAI SDK UI components
3. Integrates with ChatGPT via useToolOutput or other hooks
4. Builds successfully without errors
5. Is ready to deploy and use immediately

Make it functional, beautiful, and production-ready in one shot.
