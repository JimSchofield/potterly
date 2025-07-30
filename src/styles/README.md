# Styles Directory

This directory contains global CSS modules that are shared across the application.

## Structure

- `index.css` - Main entry point for all global styles
- `button.css` - Global button system with variants, sizes, and layouts

## Usage

Global styles are imported in `main.tsx`:
```typescript
import "./styles/index.css";
```

For component-specific imports, use:
```css
@import './styles/button.css';
```

## Button System

The button system provides consistent styling across the application:

### Base Classes
- `.btn` - Base button styles

### Variants
- `.btn-primary` - Primary action (clay brown)
- `.btn-secondary` - Secondary action (outlined)
- `.btn-danger` - Destructive action (red)
- `.btn-success` - Success action (green)
- `.btn-outline` - Outlined button for dark backgrounds

### Sizes
- `.btn-sm` - Small button
- `.btn-lg` - Large button
- `.btn-xl` - Extra large button

### Layout
- `.btn-block` - Full width button
- `.btn-group` - Button group container
- `.btn-group-center` - Centered button group
- `.btn-group-end` - Right-aligned button group

### Special
- `.action-btn` - Table action buttons

## Future Modules

Planned style modules:
- `forms.css` - Form input styling
- `cards.css` - Card component styles
- `layout.css` - Layout utilities
- `typography.css` - Text styling utilities