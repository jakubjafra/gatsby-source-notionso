"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(imageNodes) {
    return {
        publicUrl(imageUrl) {
            const node = imageNodes.find(i => i.imageUrl === imageUrl);
            if (!node) {
                return null;
            }
            return node.localFile && node.localFile.publicURL;
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=renderUtils.js.map