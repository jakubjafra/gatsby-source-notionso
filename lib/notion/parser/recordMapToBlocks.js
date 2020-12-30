"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
            value: (_c = (_b = (_a = value) === null || _a === void 0 ? void 0 : _a.format) === null || _b === void 0 ? void 0 : _b.block_width, (_c !== null && _c !== void 0 ? _c : '-1')),
        });
        block.attributes.push({
            att: 'aspectRatio',
            value: (_f = (_e = (_d = value) === null || _d === void 0 ? void 0 : _d.format) === null || _e === void 0 ? void 0 : _e.block_aspect_ratio, (_f !== null && _f !== void 0 ? _f : '-1')),
        });
    }
    if (block.type === 'page') {
        block.attributes.push({
            att: 'pageIcon',
            value: (_j = (_h = (_g = value) === null || _g === void 0 ? void 0 : _g.format) === null || _h === void 0 ? void 0 : _h.page_icon, (_j !== null && _j !== void 0 ? _j : '')),
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