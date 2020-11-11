import { NotionPageText } from '../types/notion';
import { NotionRenderChild, NotionRenderFuncs } from './index';
import { RenderUtils } from './renderUtils';
export default function renderNotionText(input: NotionPageText[], renderFuncs: NotionRenderFuncs, renderUtils: RenderUtils, debug?: boolean): NotionRenderChild[];
