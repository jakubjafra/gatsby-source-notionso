"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createNodesFromRootPage_1 = require("./gatsby/createNodesFromRootPage");
const extractPageIdFromPublicUrl_1 = require("./util/extractPageIdFromPublicUrl");
const defaultConfig = {
    debug: false,
    downloadLocal: true,
};
exports.sourceNodes = async (context, pluginConfig) => {
    const config = Object.assign(Object.assign({}, defaultConfig), pluginConfig);
    const { rootPageUrl, name } = config;
    const { actions, getNodes, store, cache, createNodeId, createContentDigest, reporter, } = context;
    const { createNode, createParentChildLink, touchNode } = actions;
    if (!rootPageUrl) {
        reporter.panic('gatsby-source-notionso requires a rootPageUrl parameter. This is the id of the root page for your notion content');
        return;
    }
    if (!name) {
        reporter.panic('gatsby-source-notionso requires a name parameter. This is used to build the names of the GraphQL types');
        return;
    }
    const rootPageId = extractPageIdFromPublicUrl_1.default(rootPageUrl);
    if (!rootPageId) {
        reporter.panic('gatsby-source-notionso requires a valid public URL.');
        return;
    }
    // Prevent GraphQL type inference from crashing when node.localFile
    // is set.
    getNodes().forEach((node) => {
        if (node.localFile___NODE) {
            touchNode({ nodeId: node.localFile___NODE });
        }
    });
    await createNodesFromRootPage_1.default(rootPageId, createNodeId, createNode, createParentChildLink, createContentDigest, getNodes, store, cache, config, reporter);
};
exports.createSchemaCustomization = async (context, pluginConfig) => {
    const { actions } = context;
    const { createTypes } = actions;
    const typeDefs = `
    type NotionPage${pluginConfig.name}LinkedPage {
      title: String!
      pageId: String!
    }

    type NotionPage${pluginConfig.name}Att {
      att: String!
      value: String
    }

    type NotionPage${pluginConfig.name}Text {
      text: String!
      atts: [NotionPage${pluginConfig.name}Att!]
    }

    type NotionPage${pluginConfig.name}Property {
      propName: String!
      value: [NotionPage${pluginConfig.name}Text!]
    }

    type NotionPage${pluginConfig.name}Block {
      type: String!
      blockId: String!
      properties: [NotionPage${pluginConfig.name}Property!]
      attributes: [NotionPage${pluginConfig.name}Att!]
      blockIds: [String!]
    }

    type NotionPageImage${pluginConfig.name} implements Node {
      imageUrl: String!
      contentId: String!
      pageId: String!
    }

    type NotionPage${pluginConfig.name} implements Node {
      pageId: String!
      title: String!
      indexPage: Int!
      isDraft: Boolean!
      slug: String!
      excerpt: String!
      pageIcon: String!
      tags: [String!]
      createdAt: Date @dateformat
      blocks: [NotionPage${pluginConfig.name}Block!]
      imageNodeIds: [String!]
      linkedPages: [NotionPage${pluginConfig.name}LinkedPage!]
    }
  `;
    createTypes(typeDefs);
};
//# sourceMappingURL=gatsby-node.js.map