import { gql } from '@apollo/client';
import { styled } from '@linaria/react';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';

import { addApolloState, initializeApollo } from '../../lib/apolloClient';
import type { Tag } from '../../lib/fetching';
import { Breakpoints, ProseContainer, styledLinks } from '../../styles/common';

const ALL_TAGS_QUERY = gql`
  query AllTags {
    tags(orderBy: [{ name: asc }]) {
      id
      name
      slug
      postsCount(where: { status: { equals: PUBLISHED } })
    }
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: ALL_TAGS_QUERY });
  return addApolloState(client, { props: { list: data.tags } });
};

const MIN_FONT_SIZE = 0.75;
const MAX_FONT_SIZE = 2.25;

type TagsProps = {
  list: Tag[];
};

export default function Tags({ list }: TagsProps) {
  list = list.filter(tag => tag.postsCount);

  let minCount = Infinity;
  let maxCount = 0;

  for (const tag of list) {
    minCount = Math.min(minCount, tag.postsCount ?? 0);
    maxCount = Math.max(maxCount, tag.postsCount ?? 0);
  }

  console.log({ minCount, maxCount });

  return (
    <ProseContainer className={styledLinks}>
      <StyledTitle>Tags</StyledTitle>
      <StyledTagCloud>
        {list.map(tag => {
          const scale =
            ((tag.postsCount ?? 0) - minCount) / (maxCount - minCount);
          const fontSize = `${
            scale * (MAX_FONT_SIZE - MIN_FONT_SIZE) + MIN_FONT_SIZE
          }rem`;

          return (
            <StyledItem key={tag.id} style={{ fontSize }}>
              <Link href={`/tags/${encodeURIComponent(tag.slug)}`}>
                {tag.name}
              </Link>
            </StyledItem>
          );
        })}
      </StyledTagCloud>
    </ProseContainer>
  );
}

const StyledTitle = styled.h1`
  text-align: center;
  font-size: var(--scale-6) !important;
  font-weight: var(--weight-medium);

  @media (width < ${Breakpoints.MD}) {
    font-size: var(--scale-4) !important;
  }
`;

const StyledTagCloud = styled.ul`
  text-align: center;
  padding-inline-start: 0 !important;
`;

const StyledItem = styled.li`
  display: inline;
  margin-inline: 0.2em;
  hyphens: none;
  white-space: nowrap;
`;
