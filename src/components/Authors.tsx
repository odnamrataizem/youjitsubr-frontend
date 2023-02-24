import React from 'react';

import type { Post } from '../lib/fetching';
import EntityLink from './EntityLink';

type AuthorsProps = {
  data: Post['authors'];
};

function Authors({ data }: AuthorsProps) {
  const authors = new Intl.ListFormat(
    process.env.NEXT_PUBLIC_LOCALE,
  ).formatToParts(data.map((_, index) => index.toString()));

  return (
    <>
      {authors.map(part =>
        part.type === 'literal' ? (
          <React.Fragment key={JSON.stringify(part)}>
            {part.value}
          </React.Fragment>
        ) : (
          <EntityLink
            key={JSON.stringify(part)}
            kind="people"
            data={data[Number.parseInt(part.value, 10)]}
          />
        ),
      )}
    </>
  );
}

export default Authors;
