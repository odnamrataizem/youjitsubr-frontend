import { gql } from '@apollo/client';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import React from 'react';
import EntityLink from '../components/EntityLink';
import PostLink from '../components/PostLink';

import { addApolloState, initializeApollo } from '../lib/apolloClient';
import type { Post } from '../lib/fetching';
import { POSTS_PER_PAGE } from '../lib/routing';

const FRONT_PAGE_QUERY = gql`
  query FrontPageQuery {
    posts(
      where: { status: { equals: PUBLISHED } }
      orderBy: [{ sticky: desc }, { publishedAt: desc }]
      take: ${POSTS_PER_PAGE}
    ) {
      id
      title
      slug
      lead
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

type HomeProps = {
  data: Post[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async context => {
  const client = initializeApollo();
  const { data } = await client.query({ query: FRONT_PAGE_QUERY });
  return addApolloState(client, { props: { data: data.posts } });
};

export default function Home({ data }: HomeProps) {
  return (
    <>
      <h1>YouJitsuBR</h1>
      <p>Welcome</p>
      <ul>
        {data.map(post => (
          <li key={post.id}>
            <Image
              alt=""
              src={post.cover?.url ?? ''}
              width="160"
              height="120"
              style={{ objectFit: 'cover' }}
            />
            <br />
            <EntityLink kind="posts" data={post.category} />
            <br />
            <PostLink post={post} />
            <br />
            {post.lead}
            <br />
            {new Date(post.publishedAt).toLocaleString('pt-BR', {
              dateStyle: 'short',
            })}
            {post.sticky && (
              <>
                <br />
                Sticky
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
