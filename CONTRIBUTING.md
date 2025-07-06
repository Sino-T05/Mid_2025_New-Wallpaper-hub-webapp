# Contributing to WallpaperHub

First off, thank you for considering contributing to WallpaperHub! It's people like you that make WallpaperHub such a great tool for wallpaper enthusiasts.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Inclusive**: Welcome newcomers and help them learn
- **Be Collaborative**: Work together towards common goals
- **Be Patient**: Remember that everyone has different skill levels

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (free)
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Quick Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/wallpaper-hub.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see README.md)
5. Start development server: `npm run dev`

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title** and description
- **Step-by-step description** of the suggested enhancement
- **Explain why** this enhancement would be useful
- **Include mockups** or examples if applicable

### 🔧 Code Contributions

#### Good First Issues

Look for issues labeled `good first issue` - these are perfect for newcomers:

- UI improvements
- Documentation updates
- Small bug fixes
- Adding tests
- Performance optimizations

#### Areas We Need Help

- **Frontend Components**: New UI components and improvements
- **Backend Features**: Supabase functions and database optimizations
- **Testing**: Unit tests and integration tests
- **Documentation**: Code comments, README improvements
- **Accessibility**: Making the app more accessible
- **Performance**: Optimizations and best practices
- **Mobile Experience**: Responsive design improvements

## 🛠️ Development Setup

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/yourusername/wallpaper-hub.git
cd wallpaper-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 4. Database Setup

- Create a Supabase project
- Run migrations from `supabase/migrations/`
- Set up storage bucket
- Configure authentication

### 5. Start Development

```bash
npm run dev
```

### 6. Verify Setup

- Open `http://localhost:5173`
- Test authentication
- Try uploading an image
- Verify all features work

## 📝 Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow the style guidelines
- Add tests for new features
- Update documentation
- Ensure all tests pass

### 3. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add image compression feature"
git commit -m "fix: resolve upload modal close issue"
git commit -m "docs: update installation instructions"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** for UI changes
- **Testing instructions** for reviewers
- **Link to related issues**

### 5. Code Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## 🎨 Style Guidelines

### TypeScript/React

```typescript
// Use TypeScript interfaces for props
interface ComponentProps {
  title: string
  isVisible?: boolean
  onClose: () => void
}

// Use functional components with hooks
export function Component({ title, isVisible = false, onClose }: ComponentProps) {
  const [loading, setLoading] = useState(false)
  
  // Early returns for conditional rendering
  if (!isVisible) return null
  
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  )
}
```

### CSS/Tailwind

```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
  
// Group related classes
<button className="
  flex items-center gap-2 
  px-4 py-2 
  bg-blue-600 hover:bg-blue-700 
  text-white font-medium 
  rounded-lg transition-colors
">
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── hooks/               # Custom hooks
├── lib/                 # Utilities and config
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

### Naming Conventions

- **Components**: PascalCase (`ImageModal.tsx`)
- **Hooks**: camelCase starting with 'use' (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **CSS Classes**: kebab-case (follow Tailwind conventions)

### Code Quality

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Format code (if using Prettier)
npm run format
```

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// Component tests
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageModal } from './ImageModal'

describe('ImageModal', () => {
  it('should close when X button is clicked', () => {
    const onClose = jest.fn()
    render(<ImageModal isOpen={true} onClose={onClose} />)
    
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
```

### Test Coverage

- **Components**: Test user interactions and edge cases
- **Hooks**: Test state changes and side effects
- **Utilities**: Test input/output and error handling
- **Integration**: Test component interactions

## 📚 Documentation

### Code Comments

```typescript
/**
 * Uploads an image to Supabase storage and creates a database record
 * @param file - The image file to upload
 * @param metadata - Image metadata (title, description, tags)
 * @returns Promise resolving to the created image record
 */
export async function uploadImage(file: File, metadata: ImageMetadata) {
  // Implementation
}
```

### README Updates

When adding features:
- Update feature list
- Add configuration instructions
- Include usage examples
- Update screenshots if needed

## 🌟 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

## 💬 Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Discord**: [Join our Discord](https://discord.gg/wallpaperhub) (coming soon)

### Communication Guidelines

- **Be Clear**: Provide context and details
- **Be Patient**: Maintainers are volunteers
- **Be Helpful**: Help others when you can
- **Search First**: Check existing issues and discussions

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Schedule

- **Patch releases**: As needed for critical bugs
- **Minor releases**: Monthly feature releases
- **Major releases**: Quarterly with breaking changes

## 📋 Checklist for Contributors

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR description is clear and complete
- [ ] Screenshots included for UI changes
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] Accessibility considered

## 🎯 Project Goals

Help us achieve these goals:

- **User Experience**: Intuitive and beautiful interface
- **Performance**: Fast loading and smooth interactions
- **Accessibility**: Usable by everyone
- **Security**: Protect user data and privacy
- **Scalability**: Handle growth gracefully
- **Community**: Foster a welcoming environment

---

Thank you for contributing to WallpaperHub! Your efforts help make this project better for everyone. 🎉