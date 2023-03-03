import { styled } from '@linaria/react';
import usePagination from '@mui/material/usePagination';
import { useMediaQuery } from '@react-hook/media-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { PAGE_PREFIX } from '../lib/routing';
import { Breakpoints } from '../styles/common';

type PaginatorProps = {
  page: number;
  lastPage: number;
};

export default function Paginator({ page, lastPage }: PaginatorProps) {
  const isPhone = useMediaQuery(`(width < ${Breakpoints.SM})`);

  const { items } = usePagination({
    boundaryCount: isPhone ? 1 : 2,
    page,
    count: lastPage,
    hideNextButton: true,
    hidePrevButton: true,
    showFirstButton: false,
    showLastButton: false,
    siblingCount: isPhone ? 1 : 2,
  });

  const { asPath } = useRouter();

  const generatePageLink = useCallback(
    (page: number) => (page > 1 ? `${asPath}/${PAGE_PREFIX}${page}` : asPath),
    [asPath],
  );

  if (lastPage === 1) {
    return null;
  }

  return (
    <nav>
      <StyledPaginator>
        {items.map(({ page: thisPage, type, selected, ...item }, index) => (
          <li key={index}>
            {type.endsWith('-ellipsis') ? (
              <div>…</div>
            ) : page === thisPage ? (
              <span>{thisPage}</span>
            ) : (
              <Link {...item} href={generatePageLink(thisPage ?? 1)}>
                {thisPage}
              </Link>
            )}
          </li>
        ))}
      </StyledPaginator>
    </nav>
  );
}

const StyledPaginator = styled.ul`
  display: flex;
  justify-content: center;
  gap: var(--size-4);
  flex-wrap: wrap;

  li {
    display: block;

    > * {
      display: flex;
      justify-content: center;
      align-items: center;
      min-inline-size: var(--size-11);
      block-size: var(--size-11);
      font-size: var(--scale-0);
      font-weight: var(--weight-medium);
      border-radius: var(--radius-sm);
      border: var(--size-2px) solid var(--color-youjitsu-1);
      color: var(--color-youjitsu-1);
      padding-inline: var(--size-1);

      html.dark & {
        border-color: var(--color-youjitsu-2);
        color: var(--color-youjitsu-2);
      }

      @media (width < ${Breakpoints.MD}) {
        min-inline-size: var(--size-9);
        block-size: var(--size-9);
        font-size: var(--scale-00);
      }
    }

    > div {
      border: 0;
    }

    > span {
      background-color: var(--color-youjitsu-1);
      color: var(--color-grey-50);

      html.dark & {
        background: var(--color-youjitsu-2);
        color: var(--color-grey-50);
      }
    }

    > a {
      text-decoration: none;
    }
  }

  @media (width < ${Breakpoints.SM}) {
    gap: var(--size-2);
    margin-inline: calc(var(--size-5) * -1);
  }
`;
