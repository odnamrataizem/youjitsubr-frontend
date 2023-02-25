import { ParsedUrlQuery } from 'node:querystring';

import { gql } from '@apollo/client';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';

import SinglePage from '../components/SinglePage';
import { addApolloState, initializeApollo } from '../lib/apolloClient';
import { fetchSlugs, Page } from '../lib/fetching';

const PAGE_QUERY = gql`
  query Page($slug: String) {
    page(where: { slug: $slug }) {
      id
      title
      slug
      content {
        document
      }
      cover {
        url
        width
        height
      }
    }
  }
`;

type PathResultQuery = ParsedUrlQuery & {
  id: string;
  page: string[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }

  const { data } = await fetchSlugs('pages');

  return {
    paths: data.map(({ slug }) => ({ params: { page: slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  { data: Page },
  PathResultQuery
> = async context => {
  const client = initializeApollo();
  const { data } = await client.query({
    query: PAGE_QUERY,
    variables: { slug: context.params?.page ?? '' },
  });

  if (!data?.page) {
    return { notFound: true };
  }

  return addApolloState(client, { props: { data: data.page } });
};

export default function PageComponent(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <SinglePage {...props} />;
}
