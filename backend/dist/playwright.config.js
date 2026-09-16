"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    testDir: './test/e2e',
    timeout: 30_000,
    use: {
        baseURL: 'http://localhost:3000',
        headless: true,
    },
});
//# sourceMappingURL=playwright.config.js.map