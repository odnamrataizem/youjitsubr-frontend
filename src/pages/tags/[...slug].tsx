import { pagedRouteFactory } from '../../lib/routing';

const { Component, getStaticPaths, getStaticProps } = pagedRouteFactory('tags');

export default Component;
export { getStaticPaths, getStaticProps };
