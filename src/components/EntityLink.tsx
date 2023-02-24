import Link from 'next/link';
import React from 'react';

type EntityLinkProps = {
  kind: string;
  data: any;
  children?: React.ReactNode;
};

export default function EntityLink({ kind, data, children }: EntityLinkProps) {
  return (
    <Link
      href={`/${encodeURIComponent(kind)}/${encodeURIComponent(data.slug)}`}
    >
      <bdi>{children ?? data.title ?? data.name}</bdi>
    </Link>
  );
}
