import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Post, SlateDocument, UploadedFile } from '../lib/fetching';
import EntityLink from './EntityLink';
import Paginator from './Paginator';
import PostLink from './PostLink';
import Renderer from './Renderer';

type ListingObject = {
  id: string;
  name?: string;
  title?: string;
  description?: SlateDocument;
  cover?: UploadedFile;
  picture?: UploadedFile;
  posts: Post[];
};

type ListingProps<T extends ListingObject> = {
  data: T;
  page?: number;
  lastPage?: number;
};

export default function Listing<T extends ListingObject>({
  data,
  page,
  lastPage,
}: ListingProps<T>) {
  page ??= 1;
  lastPage ??= 1;

  const image = data.picture?.url ?? data.cover?.url ?? '';
  const description = data.description?.document;

  return (
    <>
      <h1>{data.name ?? data.title}</h1>
      {image && (
        <Image
          alt=""
          src={image}
          width="400"
          height="400"
          style={{ objectFit: 'cover' }}
        />
      )}
      {description && <Renderer document={description} />}
      <ul>
        {data.posts.map(post => (
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
      <Paginator page={page} lastPage={lastPage} />
    </>
  );
}
