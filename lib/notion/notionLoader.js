"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const axios_1 = require("axios");
const recordMapToBlocks_1 = require("./parser/recordMapToBlocks");
function notionLoader(reporter, debug = true) {
    let _blocks = [];
    return {
        loadPage: async (pageId) => {
            const urlLoadPageChunk = 'https://www.notion.so/api/v3/loadPageChunk';
            const data = {
                pageId: pageId,
                limit: 100000,
                cursor: { stack: [] },
                chunkNumber: 0,
                verticalColumns: false,
            };
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    credentials: 'include',
                    headers: {
                        accept: '*/*',
                        'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
                    },
                },
                data: JSON.stringify(data, null, 0),
                url: urlLoadPageChunk,
            };
            if (debug) {
                reporter.info(`retrieving notion data: ${JSON.stringify(options, null, '')}`);
            }
            return axios_1.default(options)
                .then(function (response) {
                if (response.status !== 200) {
                    reporter.error(`error retrieving data from notion. status=${response.status}`);
                    throw new Error(`Error retrieving data - status: ${response.status}`);
                }
                if (debug) {
                    const data = util.inspect(response.data, {
                        colors: true,
                        depth: null,
                    });
                    reporter.info(`response is: ${data}`);
                }
                // we parse the blocks
                recordMapToBlocks_1.default((response && response.data && response.data.recordMap) || {}, _blocks);
            })
                .catch(function (error) {
                reporter.error(`Error retrieving data: ${error}`);
                throw error;
            })
                .finally(function () {
                if (debug) {
                    console.log('DONE');
                    console.log(options);
                }
            });
        },
        downloadImages(images) {
            const urlGetSignedFileUrls = 'https://www.notion.so/api/v3/getSignedFileUrls';
            const urls = [];
            images.forEach(image => {
                urls.push({
                    url: image.imageUrl,
                    permissionRecord: {
                        table: 'block',
                        id: image.contentId,
                    },
                });
            });
            const dataForUrls = {
                urls,
            };
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    credentials: 'include',
                    headers: {
                        accept: '*/*',
                        'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
                    },
                },
                data: JSON.stringify(dataForUrls, null, 0),
                url: urlGetSignedFileUrls,
            };
            const result = [];
            return axios_1.default(options)
                .then(function (response) {
                if (response.status !== 200) {
                    reporter.error(`Error retrieving images ${images} , status is: ${response.status}`);
                }
                else {
                    if (debug) {
                        console.log(util.inspect(response.data, {
                            colors: true,
                            depth: null,
                        }));
                    }
                    ((response &&
                        response.data &&
                        response.data.signedUrls) ||
                        []).forEach((signedUrl, index) => {
                        result.push({
                            imageUrl: images[index].imageUrl,
                            contentId: images[index].contentId,
                            signedImageUrl: signedUrl,
                        });
                    });
                }
                return result;
            })
                .catch(function (error) {
                console.log('Error:');
                console.log(error);
                return result;
            });
        },
        getBlockById(blockId) {
            return _blocks.find(b => b.blockId === blockId);
        },
        getBlocks(copyTo, pageId) {
            _blocks.filter(b => b.blockId !== pageId).forEach(b => copyTo.push(b));
        },
        reset() {
            _blocks = [];
        },
    };
}
exports.default = notionLoader;
//# sourceMappingURL=notionLoader.js.map