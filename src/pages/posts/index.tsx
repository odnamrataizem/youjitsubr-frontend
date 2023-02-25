import { listingPageFactory } from '../../lib/listing';

const { Component, getStaticProps } = listingPageFactory('categories');

export default Component;
export { getStaticProps };
