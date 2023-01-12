import Link from 'next/link';
import React from 'react';

import type { Post } from '../lib/fetching';
import { extractTime } from '../lib/misc';

type PostLinkProps = {
  post: Post;
  children?: React.ReactNode;
};

export default function PostLink({ post, children }: PostLinkProps) {
  return (
    <Link
      href={`/posts/${encodeURIComponent(post.category.slug)}/${extractTime(
        new Date(post.publishedAt),
      ).join('/')}/${encodeURIComponent(post.slug)}`}
    >
      {children ?? post.title}
    </Link>
  );
}
