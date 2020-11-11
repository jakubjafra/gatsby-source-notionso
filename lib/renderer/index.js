"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderNotionBlocks_1 = require("./renderNotionBlocks");
const renderer = ({ notionPage, debug }) => {
    return {
        render: (renderFuncs) => {
            const pageId = notionPage.pageId;
            const blocks = notionPage.blocks;
            const imageNodes = notionPage.imageNodes;
            const result = renderNotionBlocks_1.default(pageId, blocks, imageNodes, renderFuncs, !!debug);
            return result;
        },
    };
};
exports.default = renderer;
//# sourceMappingURL=index.js.map