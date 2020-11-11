import { NotionImageNodes } from '../types/notion';
export interface RenderUtils {
    publicUrl(arg: string): string | null;
}
export default function (imageNodes: NotionImageNodes[]): RenderUtils;
