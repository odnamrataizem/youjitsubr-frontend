import { gql } from '@apollo/client';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import React from 'react';

import EntityLink from '../../components/EntityLink';
import { addApolloState, initializeApollo } from '../../lib/apolloClient';
import type { User } from '../../lib/fetching';

const ALL_USERS_QUERY = gql`
  query AllUsers {
    users(orderBy: [{ name: asc }]) {
      id
      name
      slug
      picture {
        url
      }
      postsCount
    }
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: ALL_USERS_QUERY });
  return addApolloState(client, { props: { list: data.users } });
};

type PeopleProps = {
  list: User[];
}

export default function People({ list }: PeopleProps) {
  return (
    <>
      <h1>People</h1>
      <ul>
        {list.filter(user => user.postsCount).map(user => (
          <li key={user.id}>
            <Image
              alt=""
              src={user.picture?.url ?? ''}
              width="60"
              height="60"
              style={{ objectFit: 'cover' }}
            />
            <br />
            <EntityLink kind="people" data={user} />
            <br />
            {user.postsCount} posts
          </li>
        ))}
      </ul>
    </>
  );
}
