"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
const loadPage_1 = require("../notion/loadPage");
function findSignedUrlFromResult(imageUrl, result) {
    const item = result.find(r => r.imageUrl === imageUrl);
    if (!item) {
        return null;
    }
    return item.signedImageUrl;
}
async function createNodeForPage(pageId, rootPageId, title, index, notionLoader, createNodeId, createNode, createContentDigest, store, cache, pluginConfig, reporter) {
    try {
        const debug = pluginConfig.debug || false;
        // loading page
        const item = await loadPage_1.default(pageId, rootPageId, index, notionLoader, reporter, debug);
        const imagesToDownload = [];
        // we retrieve the list of iamges to download for the page
        for (const image of item.images) {
            imagesToDownload.push({
                imageUrl: image.notionUrl,
                contentId: image.contentId,
            });
        }
        const imagesResult = await notionLoader.downloadImages(imagesToDownload);
        if (debug) {
            reporter.info(`Images for notion source: ${JSON.stringify(imagesResult)}`);
        }
        const imageNodeIds = [];
        // we build a node per image
        for (const image of item.images) {
            // we find the signed url for that image
            const signedUrl = findSignedUrlFromResult(image.notionUrl, imagesResult);
            if (!signedUrl) {
                reporter.error(`cound not find signed URL for ${JSON.stringify(image)}`);
            }
            else {
                const fileNode = await gatsby_source_filesystem_1.createRemoteFileNode({
                    url: signedUrl,
                    store,
                    cache,
                    createNode,
                    createNodeId,
                    reporter,
                });
                const imageItem = {
                    imageUrl: image.notionUrl,
                    contentId: image.contentId,
                    pageId: image.pageId,
                };
                const imageNodeId = createNodeId(image.notionUrl);
                const imageNode = Object.assign(Object.assign({}, imageItem), { 
                    // check:
                    // https://www.gatsbyjs.org/docs/node-creation/#foreign-key-reference-___node
                    // https://www.gatsbyjs.org/docs/schema-gql-type#foreign-key-reference-___node
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    localFile___NODE: fileNode.id, id: imageNodeId, _id: imageNodeId, parent: undefined, children: [], internal: {
                        contentDigest: createContentDigest(imageItem),
                        type: `NotionPageImage${pluginConfig.name}`,
                    } });
                // we keep a reference on that nodeId
                imageNodeIds.push(imageNodeId);
                await createNode(imageNode);
            }
        }
        const nodeId = createNodeId(pageId);
        // we delete the images property because
        // we want to use the reference to the actual nodes
        delete item.images;
        const node = Object.assign(Object.assign({}, item), { imageNodeIds, indexPage: index, id: nodeId, _id: nodeId, title, parent: undefined, 
            // eslint-disable-next-line @typescript-eslint/camelcase
            imageNodes___NODE: imageNodeIds, children: [], internal: {
                contentDigest: createContentDigest(item),
                type: `NotionPage${pluginConfig.name}`,
            } });
        await createNode(node);
        return node;
    }
    catch (err) {
        reporter.error(`Error loading page: ${pageId} - error is: ${err.message}`);
        return null;
    }
}
exports.default = createNodeForPage;
//# sourceMappingURL=createNodeForPage.js.map