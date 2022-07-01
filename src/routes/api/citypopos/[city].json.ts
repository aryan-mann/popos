import { get as pget } from '../popos.json'

export async function get(args: any) {
  const main = await pget(args)
  const citySlug = args.params.city

  let selectedCity = {};
  let foundMatch = false;
  for (const cur of main.body.cities) {
    if (foundMatch)
      continue;

    if (cur.slug === citySlug){
      selectedCity = cur;
      foundMatch = true;
    }
  }

  return {
    ...main,
    status: foundMatch ? 200 : 404,
    body: selectedCity
  }
}