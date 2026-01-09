# Create ChatGPT App

You are an expert at building ChatGPT applications using the OpenAI Apps SDK. Your goal is to create fully functional apps in one shot that work with ChatGPT.

## Important: Check Latest Documentation First

Before building any app, **you MUST check the latest documentation and updates** from these official sources:

1. **Primary Documentation**: https://developers.openai.com/llms.txt
2. **Apps SDK Quickstart**: https://developers.openai.com/apps-sdk/quickstart
3. **Apps SDK Main Docs**: https://developers.openai.com/apps-sdk
4. **Example Apps Repository**: https://github.com/openai/openai-apps-sdk-examples
5. **ChatKit Starter App**: https://github.com/openai/openai-chatkit-starter-app
6. **Model Context Protocol**: https://modelcontextprotocol.io/docs/sdk

Always fetch the latest information from these URLs before starting to ensure you're using current patterns and APIs.

## Project Structure

This repository builds ChatGPT app UIs with the following structure:

```
src/apps/<appname>/
  index.tsx       # App entry point with React component
  styles.css      # App styles (Tailwind + OpenAI SDK UI)
```

## Build System

- **Build**: `node build.js <appname>`
- **Output**: `dist/<appname>.js` (minified ESM bundle ~320KB)
- **Serve**: `node server.js` (serves at `http://localhost:3000/<appname>`)
- **Distribution**: Built apps are committed to dist/ for static hosting via raw GitHub URLs

## Required App Structure

### 1. index.tsx Template

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useToolOutput } from '../../lib/hooks'
// Import OpenAI SDK UI components as needed:
// import { Button } from '@openai/apps-sdk-ui/components/Button'
// import { Alert } from '@openai/apps-sdk-ui/components/Alert'
// import { Textarea } from '@openai/apps-sdk-ui/components/Textarea'

interface ToolData {
  // Define your data structure that ChatGPT will send
  message?: string
  items?: string[]
}

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

### 2. styles.css Template

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

Use components from `@openai/apps-sdk-ui/components/`:

- **Button** - Primary, secondary, soft variants with colors
- **Alert** - Info, warning, error alerts with actions
- **Textarea** - Auto-resizing text input
- **Input** - Text inputs with validation
- **Select** - Dropdown selections
- **Checkbox** - Boolean inputs
- **Card** - Container components
- **Badge** - Status indicators
- **Spinner** - Loading states

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

1. **Keep bundles small**: Only import components you use
2. **Type safety**: Define clear interfaces for tool data
3. **Responsive design**: Use Tailwind classes for mobile/desktop
4. **Error handling**: Check if data exists before rendering
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Performance**: Avoid unnecessary re-renders
7. **State management**: Use useWidgetState for cross-turn persistence
8. **Display modes**: Respect theme and displayMode from context

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
