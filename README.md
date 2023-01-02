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