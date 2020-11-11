import { Reporter, Actions, NodePluginArgs } from 'gatsby';
import { NotionsoPluginOptions } from '../types/notion';
export default function createNodesFromRootPage(rootPageId: string, createNodeId: NodePluginArgs['createNodeId'], createNode: Actions['createNode'], createParentChildLink: Actions['createParentChildLink'], createContentDigest: NodePluginArgs['createContentDigest'], getNodes: NodePluginArgs['getNodes'], store: NodePluginArgs['store'], cache: NodePluginArgs['cache'], pluginConfig: NotionsoPluginOptions, reporter: Reporter): Promise<void>;
