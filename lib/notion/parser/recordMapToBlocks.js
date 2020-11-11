"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseNotionText(text) {
    const result = [];
    text.forEach(([str, att]) => {
        const item = {
            text: str,
            atts: [],
        };
        if (att) {
            att.forEach(([attName, ...rest]) => {
                item.atts.push({
                    att: attName,
                    value: rest && rest[0],
                });
            });
        }
        result.push(item);
    });
    return result;
}
function recordToBlock(value) {
    const block = {
        type: value.type,
        blockId: value.id,
        properties: [],
        attributes: [],
        blockIds: [],
    };
    const properties = value.properties || {};
    Object.keys(properties).forEach(propName => {
        block.properties.push({
            propName,
            value: parseNotionText(properties[propName]),
        });
    });
    (value.content || []).forEach(id => block.blockIds.push(id));
    // extra attributes to grab for images
    if (block.type === 'image') {
        block.attributes.push({
            att: 'width',
            value: _.get(value, 'format.block_width', '-1'),
        });
        block.attributes.push({
            att: 'aspectRatio',
            value: _.get(value, 'format.block_aspect_ratio', '-1'),
        });
    }
    if (block.type === 'page') {
        block.attributes.push({
            att: 'pageIcon',
            value: _.get(value, 'format.page_icon', ''),
        });
    }
    return block;
}
function recordMapToBlocks(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
recordMap, blocks) {
    Object.keys(recordMap.block).forEach(key => {
        const block = recordToBlock(recordMap.block[key].value);
        if (block) {
            blocks.push(block);
        }
    });
    return blocks;
}
exports.default = recordMapToBlocks;
//# sourceMappingURL=recordMapToBlocks.js.map