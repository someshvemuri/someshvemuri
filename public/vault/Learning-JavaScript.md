---
tags: [learning, programming, javascript]
date: 2026-01-15
---

# Learning JavaScript

This is where I track my learning journey with JavaScript.

## Key Concepts

### Variables & Types
- `let` and `const` for variable declaration
- Dynamic typing in JavaScript
- Primitive types: string, number, boolean, null, undefined

### Functions
JavaScript has multiple ways to define functions:

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function
const add = (a, b) => a + b;
```

### Async/Await
Modern way to handle asynchronous operations:

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [[Learning Node.js]] - Node.js specific concepts
- [[Web Development]] - General web development notes

## Progress

- [x] Variables and types
- [x] Functions
- [x] Promises and async/await
- [ ] Design patterns
- [ ] Testing frameworks
