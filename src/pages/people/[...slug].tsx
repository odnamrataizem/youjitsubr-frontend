import { pagedRouteFactory } from '../../lib/routing';

const { Component, getStaticPaths, getStaticProps } =
  pagedRouteFactory('users');

export default Component;
export { getStaticPaths, getStaticProps }
