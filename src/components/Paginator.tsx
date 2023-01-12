import usePagination from '@mui/material/usePagination';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { PAGE_PREFIX } from '../lib/routing';

type PaginatorProps = {
  page: number;
  lastPage: number;
};

export default function Paginator({ page, lastPage }: PaginatorProps) {
  const { items } = usePagination({
    boundaryCount: 2,
    page,
    count: lastPage,
    hideNextButton: true,
    hidePrevButton: true,
    showFirstButton: false,
    showLastButton: false,
    siblingCount: 2,
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
      <ul style={{ display: 'flex', gap: '5px' }}>
        {items.map(({ page: thisPage, type, selected, ...item }, index) => (
          <li key={index} style={{ display: 'block' }}>
            {type.endsWith('-ellipsis') ? (
              '…'
            ) : page === thisPage ? (
              <span>{thisPage}</span>
            ) : (
              <Link {...item} href={generatePageLink(thisPage ?? 1)}>
                {thisPage}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
