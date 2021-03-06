import { PluginOptions } from 'gatsby';
export interface NotionMeta {
    slug?: string;
    date?: string;
    tags?: string[];
    isDraft?: boolean;
    excerpt?: string;
}
export interface NotionPageAtt {
    att: string;
    value?: string;
}
export interface NotionPageText {
    text: string;
    atts: NotionPageAtt[];
}
export interface NotionPageProperty {
    propName: string;
    value: NotionPageText[];
}
export interface NotionPageBlock {
    type: string;
    blockId: string;
    properties: NotionPageProperty[];
    attributes: NotionPageAtt[];
    blockIds: string[];
}
export interface NotionPageImage {
    pageId: string;
    notionUrl: string;
    signedUrl: string;
    contentId: string;
}
export interface NotionImageNodes {
    imageUrl: string;
    localFile: {
        publicURL: string;
    };
}
export interface NotionPageLinkedPage {
    title: string;
    pageId: string;
}
export interface NotionPageDescription {
    pageId: string;
    title: string;
    indexPage: number;
    slug: string;
    excerpt: string;
    pageIcon: string;
    createdAt: string;
    tags: string[];
    isDraft: boolean;
    blocks: NotionPageBlock[];
    images: NotionPageImage[];
    linkedPages: NotionPageLinkedPage[];
}
export declare type JsonTypes = string | number | boolean | Date | Json | JsonArray;
export interface Json {
    [x: string]: JsonTypes;
}
export declare type JsonArray = Array<JsonTypes>;
export interface NotionsoPluginOptions extends PluginOptions {
    rootPageUrl: string;
    name: string;
    tokenv2?: string;
    downloadLocal: boolean;
    debug?: boolean;
}
export interface NotionLoaderImageInformation {
    imageUrl: string;
    contentId: string;
}
export interface NotionLoaderImageResult {
    imageUrl: string;
    contentId: string;
    signedImageUrl: string;
}
export interface NotionLoader {
    loadPage(pageId: string): Promise<void>;
    downloadImages(images: NotionLoaderImageInformation[]): Promise<NotionLoaderImageResult[]>;
    getBlockById(blockId: string): NotionPageBlock | undefined;
    getBlocks(copyTo: NotionPageBlock[], pageId: string): void;
    reset(): void;
}
