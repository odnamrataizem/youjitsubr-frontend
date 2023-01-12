import type { ParsedUrlQuery } from 'node:querystring';

import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import React from 'react';

import { extractTime } from './misc';
import {
  type DataListsWithPosts,
  fetchSlugs,
  type Post,
  type EntityWithPosts,
  fetchData,
  DataListMap,
} from './fetching';
import { addApolloState } from './apolloClient';
import Listing from '../components/Listing';

export const POSTS_PER_PAGE = 30;

export const PAGE_PREFIX = '~p';
const PAGE_ONE = `${PAGE_PREFIX}1`;

export type ResultProps<T extends DataListsWithPosts> = {
  data: DataListMap[T];
  page?: number;
  lastPage?: number;
  timeframe?: string[];
};

export type PathResultQuery = ParsedUrlQuery & {
  slug: string[];
};

type TimeFolder = {
  year: string;
  month: string;
  length: number;
};

function paginate(item: EntityWithPosts, prefix: string[]) {
  const paths: string[][] = [];

  paths.push(prefix);
  for (let i = POSTS_PER_PAGE; i < item.posts.length; i += POSTS_PER_PAGE) {
    paths.push([
      ...prefix,
      `${PAGE_PREFIX}${1 + Math.floor(i / POSTS_PER_PAGE)}`,
    ]);
  }

  return paths;
}

function paginateByMonth(item: EntityWithPosts, prefix: string[]) {
  const folders = item.posts
    .reduce<TimeFolder[]>((previous, current) => {
      const [year, month] = extractTime(new Date(current.publishedAt));

      let yearItem = previous.find(item => item.year === year && !item.month);
      if (!yearItem) {
        yearItem = { year, month: '', length: 0 };
        previous.push(yearItem);
      }

      yearItem.length++;

      let monthItem = previous.find(
        item => item.year === year && item.month === month,
      );
      if (!monthItem) {
        monthItem = { year, month, length: 0 };
        previous.push(monthItem);
      }

      monthItem.length++;

      return previous;
    }, [])
    .map(
      ({ year, month, length }) =>
        [[year, month].filter(Boolean), Array.from<Post>({ length })] as const,
    );

  const result = paginate(item, prefix);

  for (const [folder, posts] of folders) {
    result.push(...paginate({ ...item, posts }, [...prefix, ...folder]));
  }

  return result;
}

export function pagedRouteFactory<T extends DataListsWithPosts>(
  dataList: T,
  sliceMonths = false,
) {
  const getStaticPaths: GetStaticPaths<PathResultQuery> = async () => {
    if (process.env.NODE_ENV === 'development') {
      return {
        paths: [],
        fallback: 'blocking',
      };
    }

    const { data } = await fetchSlugs(dataList);
    const result: string[][] = [];

    for (const item of data) {
      result.push(
        ...(sliceMonths ? paginateByMonth : paginate)(item, [item.slug]),
      );
    }

    return {
      paths: result.map(slug => ({
        params: { slug },
      })),
      fallback: false,
    };
  };

  const getStaticProps: GetStaticProps<
    ResultProps<T>,
    PathResultQuery
  > = async context => {
    const { slug = [] } = context.params ?? {};

    if (slug.length === 0) {
      return { notFound: true };
    }

    let pageFragment = slug[slug.length - 1];

    if (pageFragment.startsWith(PAGE_PREFIX)) {
      if (pageFragment === PAGE_ONE) {
        return { notFound: true };
      }

      slug.pop();
    } else {
      pageFragment = PAGE_ONE;
    }

    const slugString = (sliceMonths ? slug.shift() : slug.pop()) ?? '';
    const page = Number.parseInt(pageFragment.slice(PAGE_PREFIX.length), 10);

    if (isNaN(page)) {
      return { notFound: true };
    }

    const { client, data } = await fetchData(
      dataList,
      slugString,
      page,
      slug.map(part => Number(part)),
    );

    if (!data || !client) {
      return { notFound: true };
    }

    const lastPage = Math.ceil(data.postsCount / POSTS_PER_PAGE);

    if (data.postsCount) {
      return addApolloState(client, {
        props: { data, page, lastPage, timeframe: slug },
      });
    }

    return { notFound: true };
  };

  const Component = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    return <Listing {...props} />;
  };

  return { Component, getStaticPaths, getStaticProps };
}
