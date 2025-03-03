# esmLS
A simple library to use localStorage

## Installation
```bash
npm install esmls
```

## Basic Usage
```javascript
import { get, set, has, del } from "esmls";

set("isLoaded", false);

window.addEventListener("DOMContentLoaded", () => {
    set("isLoaded", true);
});

document.addEventListener("click", (e) => {
    if (!get("isLoaded")) {
        alert("wait to load the page");
    }
});
```

### Type Parsing Examples
The library automatically handles type conversion for common data types:

```javascript
// Strings
set("username", "john_doe");
const username = get("username"); // returns "john_doe" as string

// Numbers
set("age", 25);
const age = get("age"); // returns 25 as number

// Booleans
set("isAdmin", true);
const isAdmin = get("isAdmin"); // returns true as boolean

// Dates
set("lastLogin", new Date());
const lastLogin = get("lastLogin"); // returns Date object

// Objects
set("user", { id: 1, name: "John" });
const user = get("user"); // returns { id: 1, name: "John" } as object

// Arrays
set("permissions", ["read", "write"]);
const permissions = get("permissions"); // returns ["read", "write"] as array

// Complex nested structures
set("config", {
    theme: "dark",
    notifications: {
        email: true,
        push: false
    },
    lastUpdated: new Date()
});
const config = get("config"); // returns object with preserved types
```

All values are automatically serialized when stored and deserialized when retrieved, maintaining their original type.

## API

### `get(key: string, options?: Object)`
Gets a value from localStorage. Supports two usage patterns:

```javascript
// Simple usage
const theme = get("theme");

// With options
const theme = get("theme", {
    default: "light",    // Default value if key doesn't exist
    set: true,          // Whether to save default value to storage [set:true (default)]
    withSetter: true    // Return [value, setter] tuple
});

// With setter pattern
const [theme, setTheme] = get("theme", { withSetter: true });

// With default value and setter
const [count, setCount] = get("counter", {
    default: 0,
    withSetter: true
});

// Increment counter using callback
setCount(prev => prev + 1);
```

### `set(key: string, value: any)`
Saves a value to localStorage.

```javascript
set("theme", "dark");
```

### `onChange(key: string, callback: (newValue: any) => void): () => void`
Listens for changes to a localStorage key, even across browser tabs. Returns a cleanup function.

```javascript
import { get, set, onChange } from "esmls";

// Initialize theme with default
const theme = get("theme", {
    default: "light",
    set: true
});

// Listen for theme changes
const cleanup = onChange("theme", (newTheme) => {
    document.body.classList.toggle("dark-mode", newTheme === "dark");
});

// Toggle theme
document.getElementById("toggle-theme").addEventListener("click", () => {
    const currentTheme = get("theme");
    set("theme", currentTheme === "light" ? "dark" : "light");
});

// Clean up listener when needed
cleanup();
```

### React Example
```jsx
import { useState, useEffect } from 'react';
import { get, set, onChange } from 'esmls';

function ThemeToggler() {
    const [theme, setLocalTheme] = useState(() =>
        get("theme", { default: "light", set: true })
    );

    useEffect(() => {
        // Listen for theme changes from other tabs/windows
        const cleanup = onChange("theme", (newTheme) => {
            setLocalTheme(newTheme);
        });

        // Clean up listener on unmount
        return cleanup;
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        set("theme", newTheme);
    };

    return (
        <div className={`app ${theme}`}>
            <button onClick={toggleTheme}>
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
            <p>Current theme: {theme}</p>
        </div>
    );
}

export default ThemeToggler;
```

Note: Remember to add your CSS styles for light and dark themes:
```css
.app {
    padding: 1rem;
    transition: background-color 0.3s, color 0.3s;
}

.app.light {
    background-color: #ffffff;
    color: #1f1f1f;
}

.app.dark {
    background-color: #1f1f1f;
    color: #ffffff;
}
```
