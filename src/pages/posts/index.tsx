import { gql } from '@apollo/client';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { addApolloState, initializeApollo } from '../../lib/apolloClient';
import type { Category } from '../../lib/fetching';

const ALL_CATEGORIES_QUERY = gql`
  query AllCategories {
    categories(orderBy: [{ name: asc }]) {
      id
      name
      slug
      cover {
        url
      }
      postsCount
    }
  }
`;

export const getStaticProps: GetStaticProps = async context => {
  const client = initializeApollo();
  const { data } = await client.query({ query: ALL_CATEGORIES_QUERY });
  return addApolloState(client, { props: { list: data.categories } });
};

type CategoriesProps = {
  list: Category[];
};

export default function Categories({ list }: CategoriesProps) {
  return (
    <>
      <h1>Categories</h1>
      <ul>
        {list.filter(category => category.postsCount).map(category => (
          <li key={category.id}>
            <Image
              alt=""
              src={category.cover?.url ?? ''}
              width="60"
              height="60"
              style={{ objectFit: 'cover' }}
            />
            <br />
            <Link href={`/posts/${encodeURIComponent(category.slug)}`}>
              {category.name}
            </Link>
            <br />
            {category.postsCount} posts
          </li>
        ))}
      </ul>
    </>
  );
}
