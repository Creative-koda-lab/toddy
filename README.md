# Toddy 📝

**A beautiful, privacy-first task manager built with modern web technologies**

Toddy is a cross-platform desktop application that helps you organize your tasks with a clean, intuitive interface. All your data stays on your device - no cloud, no tracking, just pure productivity.

## ✨ Features

- **🔒 Privacy First**: All data stored locally on your device via localStorage
- **🎨 Beautiful UI**: Clean, modern interface with smooth animations
- **🏷️ Smart Categories**: Organize tasks with color-coded tags (Work, Study, Entertainment, Family)
- **⚡ Fast & Lightweight**: Built with Tauri for native performance
- **🌐 Cross-Platform**: Works on Windows, macOS, and Linux
- **📱 Responsive**: Adapts beautifully to any screen size
- **🎯 Focused Experience**: Distraction-free task management
- **✏️ Full CRUD Operations**: Create, read, update, and delete tasks
- **🔍 Smart Filtering**: Filter by category and hide completed tasks

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0
- [Rust](https://rustup.rs/) (for Tauri desktop app)
- [Tauri Prerequisites](https://tauri.app/start/prerequisites/) for your operating system

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/toddy.git
   cd toddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**

   For the desktop app:
   ```bash
   npm run dev:desktop
   ```

   For the landing page:
   ```bash
   npm run dev:landing
   ```

   To run both concurrently:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

This is a monorepo containing multiple applications:

```
toddy/
├── apps/
│   ├── desktop/              # Tauri desktop application
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   │   ├── AddTodoModal.tsx
│   │   │   │   ├── EditTodoModal.tsx
│   │   │   │   ├── Onboarding.tsx
│   │   │   │   ├── SidebarCharacter.tsx
│   │   │   │   ├── TodoCard.tsx
│   │   │   │   └── TodoList.tsx
│   │   │   ├── constants/    # Shared constants (tags, colors)
│   │   │   ├── lib/          # Utility functions and storage
│   │   │   ├── types/        # TypeScript type definitions
│   │   │   ├── App.tsx       # Main app component
│   │   │   └── main.tsx      # Entry point
│   │   ├── src-tauri/        # Tauri (Rust) backend
│   │   └── package.json
│   └── landing/              # Astro landing page
│       ├── src/
│       │   ├── components/   # Landing page components
│       │   ├── pages/        # Astro pages
│       │   └── styles/       # Global styles
│       └── package.json
├── packages/                 # Shared packages (if any)
├── package.json              # Root workspace configuration
└── README.md
```

## 🛠️ Tech Stack

### Desktop App
- **Framework**: [Tauri](https://tauri.app/) v2 - Build smaller, faster, and more secure desktop applications
- **Frontend**: [React](https://react.dev/) 19 - Modern UI library with latest features
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 - Utility-first CSS framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) ~5.6 - Type-safe JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/) 6 - Next generation frontend tooling
- **Storage**: Browser localStorage API for data persistence

### Landing Page
- **Framework**: [Astro](https://astro.build/) 5 - Modern static site builder
- **UI**: React components with Astro integration
- **Styling**: Tailwind CSS 4
- **TypeScript**: Full type safety

## 📦 Available Scripts

### Root Level
- `npm run dev:landing` - Start landing page dev server (port 4321)
- `npm run dev:desktop` - Start desktop app in dev mode with hot reload
- `npm run dev` - Start both apps concurrently
- `npm run build:landing` - Build landing page for production
- `npm run build:desktop` - Build desktop app for production
- `npm install` - Install all dependencies for the monorepo

### Desktop App (`apps/desktop`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build the frontend with TypeScript check
- `npm run tauri dev` - Run Tauri in development mode
- `npm run tauri build` - Build production desktop app with installers

### Landing Page (`apps/landing`)
- `npm run dev` - Start Astro dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎨 Features in Detail

### Task Management
- ✅ Create new tasks with title and description
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ Mark tasks as complete/incomplete
- ✅ Attach multiple category tags to each task

### Categories
Tasks can be organized with four pre-defined categories:

- **Work** (Purple `bg-purple-200`) - Professional and work-related tasks
- **Study** (Blue `bg-blue-200`) - Learning, education, and skill development
- **Entertainment** (Red `bg-red-200`) - Leisure activities and hobbies
- **Family** (Green `bg-green-200`) - Family-related tasks and events

### Smart Filters
- **Filter by Category**: Click on a category to show only tasks with that tag
- **Hide Completed**: Toggle to hide finished tasks for a cleaner view
- **Empty State Messages**: Helpful guidance when no tasks match filters

### User Experience
- **Onboarding Screen**: Beautiful welcome screen for first-time users
- **Responsive Design**: Mobile-friendly with horizontal scrolling tags
- **Desktop Sidebar**: Vertical category navigation on larger screens
- **Context Menus**: Right-click style menu for edit/delete actions
- **Keyboard Accessible**: Proper labels and ARIA attributes
- **Character Illustrations**: Friendly visual elements throughout the app

## 🔧 Development

### Code Structure

The codebase follows modern React best practices:

#### Component Architecture
- **Modular Components**: Each component has a single responsibility
- **Reusable Elements**: Character illustrations, modals, and cards
- **Shared Constants**: Centralized tag colors and labels in `constants/tags.ts`
- **Type Safety**: Full TypeScript coverage with strict mode

#### Key Components

**App.tsx**
- Main application component
- Manages onboarding flow
- Routes between Onboarding and TodoList views

**TodoList.tsx**
- Primary interface for task management
- Handles CRUD operations
- Manages filtering and state
- Responsive layout with mobile/desktop variants

**TodoCard.tsx**
- Individual task display
- Context menu for actions
- Visual feedback for completed state

**AddTodoModal.tsx / EditTodoModal.tsx**
- Full-screen modals for task creation/editing
- Form validation
- Tag selection interface

**Onboarding.tsx**
- Welcome screen with branding
- Character illustrations
- Smooth transition to main app

#### Storage Layer
The `lib/storage.ts` module provides a clean API over localStorage:

```typescript
storage.getTodos()           // Retrieve all todos
storage.addTodo(todo)        // Add new todo
storage.updateTodo(id, data) // Update existing todo
storage.deleteTodo(id)       // Delete todo
storage.toggleTodo(id)       // Toggle completion status
```

#### Type Definitions
All types are defined in `types/todo.ts`:

```typescript
type TodoTag = "work" | "study" | "entertainment" | "family"

interface Todo {
  id: string
  title: string
  description: string
  tags: TodoTag[]
  completed: boolean
  createdAt: number
}
```

### Best Practices Implemented

- ✅ **JSDoc Comments**: Comprehensive documentation for all functions and components
- ✅ **TypeScript**: Full type safety with no `any` types
- ✅ **Component Composition**: Small, focused components
- ✅ **Consistent Naming**: Clear, descriptive names following conventions
- ✅ **Error Handling**: Try-catch blocks in storage operations
- ✅ **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- ✅ **CSS Organization**: Tailwind utility classes with logical grouping
- ✅ **State Management**: React hooks with proper dependency arrays
- ✅ **Code Reusability**: Shared constants and utility functions

### Adding New Features

1. **New Component**: Create in `apps/desktop/src/components/`
2. **New Type**: Add to `apps/desktop/src/types/todo.ts`
3. **New Constant**: Add to `apps/desktop/src/constants/tags.ts`
4. **New Storage Method**: Extend `apps/desktop/src/lib/storage.ts`

## 🚢 Building for Production

### Desktop App

Build for your current platform:
```bash
cd apps/desktop
npm run tauri build
```

This creates:
- **macOS**: `.dmg` installer in `src-tauri/target/release/bundle/dmg/`
- **Windows**: `.msi` installer in `src-tauri/target/release/bundle/msi/`
- **Linux**: `.deb`, `.AppImage` in `src-tauri/target/release/bundle/`

### Landing Page

Build the static site:
```bash
cd apps/landing
npm run build
```

Output directory: `apps/landing/dist/`

Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 🎯 Roadmap

Potential future enhancements:

- [ ] Due dates and reminders
- [ ] Search functionality
- [ ] Task priorities
- [ ] Dark mode toggle
- [ ] Export/import data (JSON, CSV)
- [ ] Custom categories
- [ ] Task notes with markdown support
- [ ] Keyboard shortcuts
- [ ] Task statistics and insights
- [ ] Multiple task lists

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Write clear, descriptive commit messages
- Add JSDoc comments to new functions
- Maintain TypeScript strict mode compliance
- Follow existing code style and patterns
- Test on multiple platforms when possible

## 🐛 Troubleshooting

### Tauri Build Issues

**Problem**: "Missing dependencies" error
**Solution**: Install Tauri prerequisites for your OS:
- **macOS**: `xcode-select --install`
- **Linux**: `sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`
- **Windows**: Install Microsoft C++ Build Tools and WebView2

### TypeScript Errors

**Problem**: Path aliases not resolving
**Solution**: Restart your IDE's TypeScript server:
- VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

### Storage Issues

**Problem**: Data not persisting
**Solution**: Check browser localStorage limits (usually 5-10MB) and ensure localStorage is enabled

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [Tauri](https://tauri.app/) - Secure, lightweight desktop apps
- [React](https://react.dev/) - Component-based UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Astro](https://astro.build/) - Static site generation
- [Vite](https://vitejs.dev/) - Lightning-fast build tool
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## 📧 Contact & Links

- **GitHub**: [https://github.com/yourusername/toddy](https://github.com/yourusername/toddy)
- **Issues**: [Report a bug or request a feature](https://github.com/yourusername/toddy/issues)
- **Website**: [Landing Page](https://toddy.app)

---

**Made with ❤️ by the Toddy team**

*Toddy - Simple, beautiful, private task management*
