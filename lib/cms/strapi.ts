import { baseRequest } from '../request'

const strapiRequest = baseRequest.child({
  baseUrl: process.env.CMS_STRAPI_BASE_URL,
  parseResponse: async (response) => {
    const res = await response.json()
    return res.data
  },
  headers: {
    Authorization: process.env.CMS_STRAPI_TOKEN!,
  },
  cache: 'force-cache',
  next: { revalidate: 60 },
})

export { strapiRequest }
