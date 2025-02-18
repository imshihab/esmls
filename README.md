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
