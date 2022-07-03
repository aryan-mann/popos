import { get as pget } from './popos.json'

/** @type {import('./__types/items').RequestHandler} */
export async function get(args: any) {
  const main = await pget(args)
  
  return {
    ...main,
    body: main.body.cities.map((x) => ({
      slug: x.slug,
      address: x.address,
      displayName: x.displayName,
      mapCoordinates: x.mapCoordinates
    }))
  }
}