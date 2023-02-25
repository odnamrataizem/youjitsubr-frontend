import { listingPageFactory } from '../../lib/listing';

const { Component, getStaticProps } = listingPageFactory('users');

export default Component;
export { getStaticProps };
