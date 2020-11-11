import { Reporter, Actions, NodePluginArgs } from 'gatsby';
import { NotionLoader, NotionsoPluginOptions } from '../types/notion';
export default function createNodeForPage(pageId: string, rootPageId: string, title: string, index: number, notionLoader: NotionLoader, createNodeId: NodePluginArgs['createNodeId'], createNode: Actions['createNode'], createContentDigest: NodePluginArgs['createContentDigest'], store: NodePluginArgs['store'], cache: NodePluginArgs['cache'], pluginConfig: NotionsoPluginOptions, reporter: Reporter): Promise<object | null>;
