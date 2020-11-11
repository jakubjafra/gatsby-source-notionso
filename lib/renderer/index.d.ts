import { NotionPageBlock, NotionImageNodes } from '../types/notion';
export declare type BlockMeta = Record<string, string>;
export declare type NotionRenderChild = object;
export interface NotionPageToRender {
    title: string;
    pageId: string;
    slug: string;
    isDraft: boolean;
    indexPage: number;
    id: string;
    excerpt: string;
    pageIcon: string;
    createdAt: string;
    blocks: NotionPageBlock[];
    imageNodes: NotionImageNodes[];
}
export interface NotionRenderFuncs {
    wrapText: (text: string) => NotionRenderChild;
    renderTextAtt: (children: NotionRenderChild[], att: string) => NotionRenderChild;
    renderLink: (children: NotionRenderChild[], ref: string) => NotionRenderChild;
    renderBlock(blockType: string, meta: BlockMeta, children: NotionRenderChild[]): NotionRenderChild;
}
declare type NotionRendererParam = {
    notionPage: NotionPageToRender;
    debug?: boolean;
};
declare type NotionPageRenderer = {
    render: (renderFuncs: NotionRenderFuncs) => object;
};
declare type NotionPageRendererFactory = (arg: NotionRendererParam) => NotionPageRenderer;
declare const renderer: NotionPageRendererFactory;
export default renderer;
