"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderNotionText_1 = require("./renderNotionText");
const renderUtils_1 = require("./renderUtils");
const notionPageTextToString_1 = require("../notion/parser/notionPageTextToString");
function addPropertiesToDict(block, dict) {
    block.properties.forEach(p => {
        // TODO: check overwrite
        dict[p.propName] = notionPageTextToString_1.default(p.value);
    });
}
function addAttributesToDict(block, dict) {
    block.attributes.forEach(a => {
        dict[a.att] = `${a.value}` || '';
    });
}
function findTextProperty(block, propName) {
    const prop = block.properties.find(p => p.propName === propName);
    if (!prop) {
        throw new Error(`cannot find prop: ${propName} on ${JSON.stringify(block)}`);
    }
    return prop.value;
}
function hasProperty(block, propName) {
    const prop = block.properties.find(p => p.propName === propName);
    return !!prop;
}
function findBlockById(id, blocks) {
    const block = blocks.find(b => b.blockId === id);
    return block;
}
function isListItemsBlockType(type) {
    return ['bulleted_list', 'numbered_list'].indexOf(type) >= 0;
}
function mkEmptyBlock(type) {
    return {
        type,
        blockId: '',
        attributes: [],
        properties: [],
        _subBlocks: [],
        blockIds: [],
    };
}
// iterate through the list and merge together
// blocks belonging to the same list
function mergeListBlocks(blocks) {
    const result = [];
    let mergingBlock = mkEmptyBlock('');
    blocks.forEach(block => {
        const type = block.type;
        if (type === mergingBlock.type) {
            // we are in a list of items to be merged
            // we change the type of the subnode to 'item'
            block.type = `${type}__item`;
            mergingBlock._subBlocks.push(block);
            mergingBlock.blockIds.push(block.blockId);
        }
        else {
            // we are leaving the sequence of nodes to merge
            // we push that block if it had subblocks
            if (mergingBlock._subBlocks.length > 0) {
                result.push(mergingBlock);
            }
            if (isListItemsBlockType(type)) {
                // we change the type of the subnode to 'item'
                block.type = `${type}__item`;
                mergingBlock = mkEmptyBlock(type);
                mergingBlock.blockId = block.blockId;
                mergingBlock._subBlocks = [block];
                mergingBlock.blockIds = [block.blockId];
                mergingBlock.attributes = [];
                mergingBlock.properties = [];
            }
            else {
                mergingBlock = mkEmptyBlock('');
                // non list item block, we push it as is
                result.push(block);
            }
        }
    });
    // flush last block if needed
    if (mergingBlock._subBlocks.length > 0) {
        result.push(mergingBlock);
    }
    return result;
}
// for bulleted list, numbered list etc all the items
// are adjacents
// this function will create a parent node with _suBlocks containing
// the items of the list
function aggregateListTree(block) {
    block._subBlocks = mergeListBlocks(block._subBlocks);
    block._subBlocks.forEach(b => aggregateListTree(b));
    return block;
}
// we store in _subBlocks all the blocks which were referenced in blockIds
function buildTree(block, blocks, debug) {
    const root = Object.assign(Object.assign({}, block), { _subBlocks: [] });
    // we ignore those blocks for now
    // see issue: https://github.com/pcarion/gatsby-source-notionso/issues/15
    if (block.type === 'toggle') {
        return root;
    }
    block.blockIds.forEach(id => {
        const subBlock = findBlockById(id, blocks);
        if (!subBlock) {
            console.log(`missing block id: ${id} in block: id=${block.blockId} type:${block.type} json:${JSON.stringify(block, null, '  ')}`);
        }
        else {
            root._subBlocks.push(buildTree(subBlock, blocks, debug));
        }
    });
    return root;
}
function renderBlock(root, renderFuncs, renderUtils, debug) {
    const children = [];
    // get meta information about block
    const meta = {};
    addPropertiesToDict(root, meta);
    addAttributesToDict(root, meta);
    if (root.type === 'image') {
        const url = renderUtils.publicUrl(meta.source);
        if (!url) {
            console.log(`cannot find public url for image: ${JSON.stringify(meta)}`);
        }
        // TODO: default image?
        meta.publicImageUrl = url || '';
    }
    if (hasProperty(root, 'title') && root.type !== 'page') {
        const texts = findTextProperty(root, 'title');
        const textBlocks = renderNotionText_1.default(texts, renderFuncs, renderUtils, debug);
        textBlocks.forEach(b => children.push(b));
    }
    root._subBlocks.forEach(block => {
        children.push(renderBlock(block, renderFuncs, renderUtils, debug));
    });
    const result = renderFuncs.renderBlock(root.type, meta, children);
    return result;
}
function renderPageblocks(pageId, blocks, imageNodes, renderFuncs, debug = false) {
    const pageBlock = findBlockById(pageId, blocks);
    if (!pageBlock) {
        throw new Error(`missing root block id: ${pageId}`);
    }
    // we build the tree of blocks
    const rootBlock = buildTree(pageBlock, blocks, debug);
    if (debug) {
        console.log('buildTree>tree>rootBlock>', JSON.stringify(rootBlock, null, '  '));
    }
    const aggregatedRootBlock = aggregateListTree(rootBlock);
    if (debug) {
        console.log('buildTree>aggregatedRootBlock>', JSON.stringify(aggregatedRootBlock, null, '  '));
    }
    const renderUtils = renderUtils_1.default(imageNodes);
    return renderBlock(aggregatedRootBlock, renderFuncs, renderUtils, debug);
}
exports.default = renderPageblocks;
//# sourceMappingURL=renderNotionBlocks.js.map