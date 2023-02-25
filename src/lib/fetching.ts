import { gql } from '@apollo/client';

import { initializeApollo } from './apolloClient';
import { POSTS_PER_PAGE } from './routing';

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type Fetcher<T> = () => Promise<{
  client: ReturnType<typeof initializeApollo>;
  data: T[];
}>;

const ALL_POSTS_SLUG = '~all';

const ALL_POSTS_QUERY = gql`
  query AllPosts($skip: Int! = 0, $take: Int) {
    postsCount(where: { status: { equals: PUBLISHED } })
    posts(
      where: { status: { equals: PUBLISHED } }
      orderBy: [{ sticky: desc }, { publishedAt: desc }]
      skip: $skip
      take: $take
    ) {
      id
      title
      lead
      slug
      publishedAt
      sticky
      category {
        name
        slug
      }
      cover {
        url
      }
    }
  }
`;

const ALL_POSTS_LIGHT_QUERY = gql`
  query AllPostsLight {
    pages {
      id
      slug
    }
    posts(
      where: { status: { equals: PUBLISHED } }
      orderBy: [{ sticky: desc }, { publishedAt: desc }]
    ) {
      id
      slug
      publishedAt
      authors(orderBy: { name: asc }) {
        id
        slug
      }
      category {
        id
        slug
      }
      tags(orderBy: { name: asc }) {
        id
        slug
      }
    }
  }
`;

export type UploadedFile = {
  url: string;
  width: number;
  height: number;
};

export type SlateDocument = {
  document: any;
};

export type Entity = {
  id: string;
  slug: string;
};

export type EntityWithPosts = Entity & {
  posts: Post[];
  postsCount?: number;
};

export type Category = EntityWithPosts & {
  name: string;
  description: SlateDocument;
  cover?: UploadedFile;
};

export type Page = Entity & {
  title: string;
  content: SlateDocument;
  cover?: UploadedFile;
  updatedAt: string;
};

export type Post = Entity & {
  title: string;
  lead: string;
  content: SlateDocument;
  cover?: UploadedFile;
  sticky: boolean;
  authors: User[];
  category: Category;
  tags: Tag[];
  publishedAt: string;
  updatedAt: string;
};

export type Tag = EntityWithPosts & {
  name: string;
};

export type User = EntityWithPosts & {
  name: string;
  description: SlateDocument;
  picture?: UploadedFile;
};

function expandData(data: { pages: Page[]; posts: Post[] }) {
  const categories: EntityWithPosts[] = [];
  const pages = data.pages;
  const posts = data.posts;
  const tags: EntityWithPosts[] = [];
  const users: EntityWithPosts[] = [];

  for (const post of posts) {
    for (const postUser of post.authors) {
      let user = users.find(user => user.id === postUser.id)!;
      if (!user) {
        user = { ...postUser };
        users.push(user);
      }

      if (!user.posts) {
        user.posts = [];
      }

      user.posts.push(post);
    }

    for (const postTag of post.tags) {
      let tag = tags.find(tag => tag.id === postTag.id)!;
      if (!tag) {
        tag = { ...postTag };
        tags.push(tag);
      }

      if (!tag.posts) {
        tag.posts = [];
      }

      tag.posts.push(post);
    }

    let category = categories.find(
      category => category.id === post.category.id,
    )!;
    if (!category) {
      category = { ...post.category };
      categories.push(category);
    }

    if (!category.posts) {
      category.posts = [];
    }

    category.posts.push(post);
  }

  categories.push({ id: ALL_POSTS_SLUG, slug: ALL_POSTS_SLUG, posts });

  return { categories, pages, posts, tags, users };
}

export type DataListMap = {
  categories: Category;
  pages: Page;
  posts: Post;
  tags: Tag;
  users: User;
};

export type DataLists = keyof ReturnType<typeof expandData>;

const queries = {
  categories: [
    'category',
    gql`
      query OneCategory(
        $slug: String
        $skip: Int! = 0
        $take: Int
        $minDate: DateTime
        $maxDate: DateTime
      ) {
        category(where: { slug: $slug }) {
          id
          name
          slug
          description {
            document
          }
          cover {
            url
          }
          postsCount(
            where: {
              AND: [
                { status: { equals: PUBLISHED } }
                { publishedAt: { gte: $minDate } }
                { publishedAt: { lt: $maxDate } }
              ]
            }
          )
          posts(
            where: {
              AND: [
                { status: { equals: PUBLISHED } }
                { publishedAt: { gte: $minDate } }
                { publishedAt: { lt: $maxDate } }
              ]
            }
            orderBy: [{ sticky: desc }, { publishedAt: desc }]
            skip: $skip
            take: $take
          ) {
            id
            title
            lead
            slug
            publishedAt
            sticky
            category {
              name
              slug
            }
            cover {
              url
            }
          }
        }
      }
    `,
  ],
  users: [
    'user',
    gql`
      query OneUser(
        $slug: String
        $skip: Int! = 0
        $take: Int
        $minDate: DateTime
        $maxDate: DateTime
      ) {
        user(where: { slug: $slug }) {
          id
          name
          slug
          description {
            document
          }
          picture {
            url
          }
          postsCount(
            where: {
              AND: [
                { status: { equals: PUBLISHED } }
                { publishedAt: { gte: $minDate } }
                { publishedAt: { lt: $maxDate } }
              ]
            }
          )
          posts(
            where: {
              AND: [
                { status: { equals: PUBLISHED } }
                { publishedAt: { gte: $minDate } }
                { publishedAt: { lt: $maxDate } }
              ]
            }
            orderBy: [{ sticky: desc }, { publishedAt: desc }]
            skip: $skip
            take: $take
          ) {
            id
            title
            lead
            slug
            publishedAt
            sticky
            category {
              name
              slug
            }
            cover {
              url
            }
          }
        }
      }
    `,
  ],
  tags: [
    'tag',
    gql`
      query OneTag(
        $slug: String
        $skip: Int! = 0
        $take: Int
        $minDate: DateTime
        $maxDate: DateTime
      ) {
        tag(where: { slug: $slug }) {
          id
          name
          slug
          postsCount(
            where: {
              AND: [
                { status: { equals: PUBLISHED } }
                { publishedAt: { gte: $minDate } }
                { publishedAt: { lt: $maxDate } }
              ]
            }
          )
          posts(
            where: {
              AND: [
                { status: { equals: PUBLISHED } }
                { publishedAt: { gte: $minDate } }
                { publishedAt: { lt: $maxDate } }
              ]
            }
            orderBy: [{ sticky: desc }, { publishedAt: desc }]
            skip: $skip
            take: $take
          ) {
            id
            title
            lead
            slug
            publishedAt
            sticky
            category {
              name
              slug
            }
            cover {
              url
            }
          }
        }
      }
    `,
  ],
} as const;

export type DataListsWithPosts = keyof typeof queries;

function fetchingAllPosts(dataList: string, slug: string) {
  return dataList === 'categories' && slug === ALL_POSTS_SLUG;
}

function isValidYear(year: number) {
  return !Number.isNaN(year) && year > 0;
}

function isValidMonth(month: number) {
  return !Number.isNaN(month) && month > 0 && month < 13;
}

export async function fetchData<T extends DataListsWithPosts>(
  dataList: T,
  slug: string,
  page: number,
  timeframe: number[],
) {
  if (
    timeframe.length > 3 ||
    (timeframe[0] != null && !isValidYear(timeframe[0])) ||
    (timeframe[1] != null && !isValidMonth(timeframe[1]))
  ) {
    return { client: null, data: null };
  }

  let minDate: Date | undefined = undefined;
  let maxDate: Date | undefined = undefined;

  if (timeframe[0] != null && timeframe[1] != null) {
    minDate = new Date(timeframe[0], timeframe[1] - 1);
    maxDate = new Date(timeframe[0], timeframe[1]);
  } else if (timeframe[0] != null) {
    minDate = new Date(timeframe[0], 0);
    maxDate = new Date(timeframe[0] + 1, 0);
  }

  const skip = (page - 1) * POSTS_PER_PAGE;
  const client = initializeApollo();
  const [field, query] = queries[dataList];

  if (fetchingAllPosts(dataList, slug)) {
    const { data } = await client.query({
      query: ALL_POSTS_QUERY,
      variables: { skip, take: POSTS_PER_PAGE },
    });

    return { client, data: { ...data } };
  }

  const { data } = await client.query({
    query,
    variables: { slug, skip, take: POSTS_PER_PAGE, minDate, maxDate },
  });

  return { client, data: data[field] };
}

const queriesAll = {
  categories: [
    'Categorias',
    'posts',
    gql`
      query AllCategories {
        categories(orderBy: [{ name: asc }]) {
          id
          name
          slug
          cover {
            url
          }
          postsCount(where: { status: { equals: PUBLISHED } })
        }
      }
    `,
  ],
  users: [
    'Equipe',
    'people',
    gql`
      query AllUsers {
        users(orderBy: [{ name: asc }]) {
          id
          name
          slug
          picture {
            url
          }
          postsCount(where: { status: { equals: PUBLISHED } })
        }
      }
    `,
  ],
} as const;

export type DataListsAllWithPosts = keyof typeof queriesAll;

export async function fetchAllData<T extends DataListsAllWithPosts>(
  dataList: T,
) {
  const client = initializeApollo();
  const [title, path, query] = queriesAll[dataList];

  const { data } = await client.query({ query });

  return { client, title, path, data: data[dataList] };
}

export async function fetchSlugs<T extends DataLists>(dataList: T) {
  const client = initializeApollo();
  const { data } = await client.query({ query: ALL_POSTS_LIGHT_QUERY });
  return { client, data: expandData(data)[dataList] };
}
