import { NotionPageBlock, NotionImageNodes } from '../types/notion';
import { NotionRenderFuncs, NotionRenderChild } from './index';
export default function renderPageblocks(pageId: string, blocks: NotionPageBlock[], imageNodes: NotionImageNodes[], renderFuncs: NotionRenderFuncs, debug?: boolean): NotionRenderChild;
