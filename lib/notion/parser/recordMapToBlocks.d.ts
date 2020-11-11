import { NotionPageBlock } from '../../types/notion';
export declare type NotionTextAttributes = string[][];
export declare type NotionText = [string, NotionTextAttributes?][];
export declare type MyObj = Record<string, any>;
export default function recordMapToBlocks(recordMap: any, blocks: NotionPageBlock[]): NotionPageBlock[];
