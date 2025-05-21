import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && references(*[_type == "brand" && slug.current == $slug]._id)] | order(name asc) {
  ...,
  "brand": brand->{
    title,
    slug,
    image
  },
  "categories": categories[]->title
}`);

const MY_ORDERS_QUERY = defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
  ...,
  products[]{
    ...,
    product->{
      ...,
      "categories": categories[]->title,
      "brand": brand->title
    }
  }
}`);

export {
  BRANDS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
};