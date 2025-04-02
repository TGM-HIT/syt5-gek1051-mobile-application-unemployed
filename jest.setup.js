const { TextEncoder, TextDecoder } = require("util");

require("@testing-library/jest-dom");

// Polyfill for Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
