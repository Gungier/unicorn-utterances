import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import {countContent} from "../utils/count-words";
import PostType from "../types/post";
import {dataDirectory, getDatas} from "./get-datas";
import {pickDeep, DeepPartial, DeepReplaceKeys, PickDeep} from "ts-util-helpers";

export const postsDirectory = join(process.cwd(), 'content/blog')

const {unicorns, pronouns, licenses, roles} = getDatas()
export {unicorns, pronouns, licenses, roles, dataDirectory};

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

type KeysToPick = DeepPartial<DeepReplaceKeys<PostType, true | false>>;

export function getPostBySlug<ToPick extends KeysToPick>(slug: string, fields: ToPick = {} as any): PickDeep<true | false, PostType, ToPick> {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, realSlug, `index.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const counts = countContent(content) as {
    InlineCodeWords: number,
    RootNode: number,
    ParagraphNode: number,
    SentenceNode: number,
    WordNode: number,
    TextNode: number,
    WhiteSpaceNode: number,
    PunctuationNode: number,
    SymbolNode: number,
    SourceNode: number
  };

  // Ensure only the minimal needed data is exposed
  const items = pickDeep(data, fields);

  if (fields.slug) {
    items.slug = realSlug;
  }
  if (fields.content) {
    items.content = content;
  }
  if (fields.wordCount) {
    items.wordCount = (counts.InlineCodeWords || 0) + (counts.WordNode || 0);
  }

  if (fields.authors) {
    items.authors = (data.authors as string[]).map(author =>
        unicorns.find(unicorn => unicorn.id === author)!
    )
  }

  return items as any
}

let allPostsCache = new WeakMap<object, PostType[]>();

export function getAllPosts<ToPick extends KeysToPick>
    (fields: ToPick = {} as any, cacheString: null | object = null): Array<PickDeep<true | false, PostType, ToPick>> {
  if (cacheString) {
    const cacheData = allPostsCache.get(cacheString);
    if (cacheData) return cacheData as any;
  }

  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields));

  if (cacheString) allPostsCache.set(cacheString, posts as never as PostType[]);

  return posts as any[];
}
