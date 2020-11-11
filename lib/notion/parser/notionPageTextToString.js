"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function notionPageTextToString(text) {
    const parts = [];
    text.forEach(t => {
        parts.push(t.text);
    });
    return parts.join('');
}
exports.default = notionPageTextToString;
//# sourceMappingURL=notionPageTextToString.js.map