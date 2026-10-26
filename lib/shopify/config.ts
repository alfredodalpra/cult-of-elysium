// Without real credentials the storefront runs on local mock data, so the
// project can be deployed and demoed without a Shopify store.
export const isMock =
  !process.env.SHOPIFY_STORE_DOMAIN ||
  !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.SHOPIFY_STORE_DOMAIN === 'your-store.myshopify.com'
