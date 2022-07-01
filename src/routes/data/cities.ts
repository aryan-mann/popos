import { get as pget } from './popos'

export async function get(args: any) {
  const main = await pget(args)
  
  return {
    ...main,
    body: main.body.cities
  }
}