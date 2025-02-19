# esmLS
a simple library to use localStorage

# Installation
```
npm install esmls
```

```js
import {get, set, has, del} from "esmls";
set("isLoaded", false);

window.addEventListener("DOMContentLoaded", () => {
    set("isLoaded", true);
});

document.addEventListener("click", (e)=>{
    if(!get("isLoaded")){
        alert("wait to load the page");
    }
});
```

### `onChange(key: string, callback: (newValue: any) => void)`
Listens for changes to a `localStorage` key, even across browser tabs. The `callback` is triggered whenever the value changes.

```javascript
import { get, set, onChange } from "esmls";

// Initialize theme
if (!get("theme")) {
    set("theme", "light");
}

// or
get("theme", "light")

// Listen for theme changes
onChange("theme", (newTheme) => {
    document.body.classList.toggle("dark-mode", newTheme === "dark");
});

// Toggle theme
document.getElementById("toggle-theme").addEventListener("click", () => {
    const currentTheme = get("theme");
    set("theme", currentTheme === "light" ? "dark" : "light");
});
```

### React Example
```jsx
import { useState, useEffect } from 'react';
import { get, set, onChange } from 'esmls';

function ThemeToggler() {
    const [theme, setTheme] = useState(() => get('theme', 'light'));

    useEffect(() => {
        // Listen for theme changes from other tabs/windows
        return onChange('theme', (newTheme) => {
            setTheme(newTheme);
        });
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set('theme', newTheme);
    };

    return (
        <div className={`app ${theme}`}>
            <button onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
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
