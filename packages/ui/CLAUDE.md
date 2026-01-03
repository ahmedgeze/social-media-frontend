# @repo/ui - Shared UI Components

## Overview

Tüm micro-frontend uygulamaları tarafından kullanılan paylaşılan UI component kütüphanesi.

## Package Info

```json
{
  "name": "@repo/ui",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   └── index.ts          # Re-exports all components
├── package.json
└── tsconfig.json
```

## Components

### Button
```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Card
```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}
```

### Input
```typescript
interface InputProps {
  label?: string;
  error?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
```

### Textarea
```typescript
interface TextareaProps {
  label?: string;
  error?: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
```

### Avatar
```typescript
interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;  // Falls back to initials
}
```

### Modal
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

### Spinner
```typescript
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}
```

## Usage

```typescript
import { Button, Card, Input, Avatar } from "@repo/ui";

function MyComponent() {
  return (
    <Card title="User Profile">
      <Avatar name="John Doe" size="lg" />
      <Input label="Username" value={username} onChange={setUsername} />
      <Button variant="primary" onClick={handleSubmit}>
        Save
      </Button>
    </Card>
  );
}
```

## Styling

- Tailwind CSS kullanılır
- Her component kendi style'ını içerir
- `className` prop ile extend edilebilir
- Dark mode ready (Tailwind dark: prefix)

## Design Tokens

```typescript
// Colors (Tailwind)
primary: "bg-blue-600 hover:bg-blue-700"
secondary: "bg-gray-200 hover:bg-gray-300"
danger: "bg-red-600 hover:bg-red-700"

// Sizes
sm: "px-2 py-1 text-sm"
md: "px-4 py-2 text-base"
lg: "px-6 py-3 text-lg"
```

## Dependencies

```json
{
  "react": "^19.0.0",
  "@repo/typescript-config": "workspace:*"
}
```

## Adding New Component

1. Create component file: `src/components/NewComponent.tsx`
2. Add `"use client"` directive if interactive
3. Define props interface
4. Implement with Tailwind styling
5. Export from `src/index.ts`

```typescript
// src/components/Badge.tsx
"use client";

interface BadgeProps {
  variant: "success" | "warning" | "error";
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${variants[variant]}`}>
      {children}
    </span>
  );
}

// src/index.ts
export { Badge } from "./components/Badge";
```

## Code Conventions

- Component'lar PascalCase
- Props interface'leri component ile aynı dosyada
- `"use client"` interactive component'lar için zorunlu
- Tailwind class'ları inline, değişkenler object olarak
- Default prop değerleri destructuring'de
