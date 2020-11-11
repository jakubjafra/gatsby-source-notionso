"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractPageIdFromPublicUrl(url) {
    const len = url.length;
    if (len < 32) {
        return null;
    }
    // we first take the last 32 digits
    const id = url.substring(len - 32);
    // then we need to format as:
    // xxxxxxxx-yyyy-yyyy-yyyy-zzzzzzzzzzzz
    const sliceLengths = [8, 4, 4, 4, 12];
    const slices = [];
    let previous = 0;
    sliceLengths.forEach(slen => {
        slices.push(id.substring(previous, previous + slen));
        previous += slen;
    });
    return slices.join('-');
}
exports.default = extractPageIdFromPublicUrl;
//# sourceMappingURL=extractPageIdFromPublicUrl.js.map