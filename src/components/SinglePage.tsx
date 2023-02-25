import { styled } from '@linaria/react';
import Image from 'next/image';
import React from 'react';

import type { Page } from '../lib/fetching';
import { Breakpoints, ProseContainer, styledLinks } from '../styles/common';
import Metadata from './Metadata';
import Renderer from './Renderer';

type SinglePageProps = {
  data: Page;
};

export default function SinglePage({ data }: SinglePageProps) {
  return (
    data && (
      <StyledArticle>
        <Metadata
          title={data.title}
          description={data.lead}
          cover={data.cover?.url}
          type="article"
          publishedAt={new Date(data.createdAt)}
          updatedAt={new Date(data.updatedAt)}
        />
        <StyledHeader>
          <ProseContainer>
            {data.cover?.url}
            <h1>{data.title}</h1>
            <Image
              priority
              alt=""
              src={data.cover?.url ?? ''}
              width={data.cover?.width ?? 0}
              height={data.cover?.height ?? 0}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: `${data.cover?.width ?? 0} / ${
                  data.cover?.height ?? 0
                }`,
              }}
            />
          </ProseContainer>
        </StyledHeader>
        <ProseContainer className={styledLinks}>
          <Renderer document={data.content.document} />
        </ProseContainer>
      </StyledArticle>
    )
  );
}

const StyledArticle = styled.article`
  padding-block: var(--size-12);

  @media (width < ${Breakpoints.MD}) {
    padding-block: var(--size-6);
  }
`;

const StyledHeader = styled.header`
  h1 {
    margin: 0;
    font-weight: var(--weight-medium);
  }
`;
