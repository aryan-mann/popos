import { get as pget } from './popos.json'

/** @type {import('./__types/items').RequestHandler} */
export async function get(args: any) {
  const main = await pget(args)
  
  return {
    ...main,
    body: main.body.cities.map((x) => {
      const xDupe = { ...x }; // dupe it so the in-memory object is not deleted
      // remove popos to not bloat the response
      delete xDupe.popos;
      return xDupe;
    })
  }
}