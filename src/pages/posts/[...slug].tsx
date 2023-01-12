import { gql } from '@apollo/client';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';

import SinglePost from '../../components/SinglePost';
import { addApolloState, initializeApollo } from '../../lib/apolloClient';
import { fetchSlugs, type Post } from '../../lib/fetching';
import { extractTime } from '../../lib/misc';
import {
  pagedRouteFactory,
  PAGE_PREFIX,
  ResultProps,
  type PathResultQuery,
} from '../../lib/routing';

const POST_QUERY = gql`
  query Post($slug: String) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      lead
      content {
        document
      }
      cover {
        url
      }
      sticky
      authors(orderBy: { name: asc }) {
        id
        name
        slug
        description {
          document
        }
        picture {
          url
        }
      }
      category {
        id
        name
        slug
        description {
          document
        }
        cover {
          url
        }
      }
      tags(orderBy: { name: asc }) {
        id
        name
        slug
      }
      status
      publishedAt
      updatedAt
    }
  }
`;

const original = pagedRouteFactory('categories', true);

export const getStaticPaths: GetStaticPaths<
  PathResultQuery
> = async context => {
  const result = await original.getStaticPaths(context);

  if (result.paths.length === 0 || typeof result.paths[0] === 'string') {
    return result;
  }

  const { data } = await fetchSlugs('posts');

  for (const { category, publishedAt, slug } of data) {
    result.paths.push({
      params: {
        slug: [category.slug, ...extractTime(new Date(publishedAt)), slug],
      },
    });
  }

  return result;
};

export const getStaticProps: GetStaticProps<
  ResultProps<'categories'> | { data: Post; isPost: true },
  PathResultQuery
> = async context => {
  const params = context.params?.slug ?? [];
  if (
    params.length < 4 ||
    (params.length === 4 && params[3].startsWith(PAGE_PREFIX))
  ) {
    return original.getStaticProps(context);
  }

  if (params.length > 4) {
    return { notFound: true };
  }

  const slug = params.pop();
  const categorySlug = params.shift();
  const [year, month] = params;

  const client = initializeApollo();
  const { data } = await client.query({
    query: POST_QUERY,
    variables: { slug },
  });

  if (!data?.post) {
    return { notFound: true };
  }

  const [publishYear, publishMonth] = extractTime(
    new Date(data.post.publishedAt),
  );

  if (
    year !== publishYear ||
    month !== publishMonth ||
    categorySlug !== data.post.category.slug ||
    data.post.status !== 'PUBLISHED'
  ) {
    return { notFound: true };
  }

  return addApolloState(client, {
    props: { data: data.post, isPost: true },
  });
};

export default function PostPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const keys = Object.keys(props);

  if ('isPost' in props) {
    return <SinglePost {...props} />;
  }

  return <original.Component {...props} />;
}
