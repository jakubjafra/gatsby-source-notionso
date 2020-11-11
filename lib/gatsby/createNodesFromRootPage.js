"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notionLoader_1 = require("../notion/notionLoader");
const loadPage_1 = require("../notion/loadPage");
const createNodeForPage_1 = require("./createNodeForPage");
async function createNodesFromRootPage(rootPageId, createNodeId, createNode, createParentChildLink, createContentDigest, getNodes, store, cache, pluginConfig, reporter) {
    try {
        const debug = pluginConfig.debug || false;
        const loader = notionLoader_1.default(reporter, debug);
        // loading the root page
        const item = await loadPage_1.default(rootPageId, '', 0, loader, reporter, debug);
        // we are interested only by the linked pages from the root page
        let index = 0;
        for (const linkedPage of item.linkedPages) {
            index += 1;
            const { pageId, title } = linkedPage;
            // we reset data before we load a new page
            // (to avoid keeping around too many blocks)
            loader.reset();
            await createNodeForPage_1.default(pageId, rootPageId, title, index, loader, createNodeId, createNode, createContentDigest, store, cache, pluginConfig, reporter);
        }
    }
    catch (err) {
        console.log(err);
        reporter.error(`Error loading root page: ${rootPageId} - error is: ${err.message}`);
    }
}
exports.default = createNodesFromRootPage;
//# sourceMappingURL=createNodesFromRootPage.js.map