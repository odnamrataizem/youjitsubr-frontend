import Head from 'next/head';
import React from 'react';

type MetadataProps = {
  title?: string;
  description?: string;
  cover?: string;
  type?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  authorsFacebook?: string[];
  category?: string;
  tags?: string[];
};

export default function Metadata({
  title,
  description,
  cover,
  type,
  publishedAt,
  updatedAt,
  authorsFacebook,
  category,
  tags,
}: MetadataProps) {
  const renderedTitle = title
    ? `${title} | YouJitsuBR`
    : 'YouJitsuBR | slogan?';

  return (
    <Head>
      <title>{renderedTitle}</title>
      <meta name="color-scheme" content="light dark" />
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title ?? 'YouJitsuBR'} />
      {description && <meta property="og:description" content={description} />}
      {cover && <meta property="og:image" content={cover} />}
      <meta
        property="og:locale"
        content={(process.env.NEXT_PUBLIC_LOCALE ?? '').replace('-', '_')}
      />
      <meta property="og:site_name" content="YouJitsuBR" />
      {type && <meta property="og:type" content={type} />}
      {publishedAt && (
        <meta
          property="article:published_time"
          content={publishedAt.toISOString()}
        />
      )}
      {updatedAt && (
        <meta
          property="article:modified_time"
          content={updatedAt.toISOString()}
        />
      )}
      {authorsFacebook?.map(url => (
        <meta key={url} property="article:author" content={url} />
      ))}
      {category && <meta property="article:section" content={category} />}
      {tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ?? 'YouJitsuBR'} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:site" content="@YouJitsuNoBR" />
      {cover && <meta name="twitter:image" content={cover} />}
    </Head>
  );
}