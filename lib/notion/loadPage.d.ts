import { Reporter } from 'gatsby';
import { NotionLoader, NotionPageDescription } from '../types/notion';
export default function loadPage(pageId: string, rootPageId: string, indexPage: number, notionLoader: NotionLoader, reporter: Reporter, debug: boolean): Promise<NotionPageDescription>;
