import type { GetStaticProps } from 'next';
import React from 'react';

import Listing from '../components/Listing';
import { addApolloState } from './apolloClient';
import { type DataListsAllWithPosts, fetchAllData } from './fetching';

export function listingPageFactory<T extends DataListsAllWithPosts>(
  dataList: T,
) {
  const getStaticProps: GetStaticProps = async () => {
    const { client, data, title, path } = await fetchAllData(dataList);
    return addApolloState(client, { props: { data, title, path } });
  };

  const Component = (props: React.ComponentPropsWithoutRef<typeof Listing>) => (
    <Listing {...props} />
  );

  return { getStaticProps, Component };
}
