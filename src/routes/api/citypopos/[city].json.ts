import type { CityT } from 'src/types';
import { get as pget } from '../popos.json'

export async function get(args: any) {
  const main = await pget(args)
  const citySlug = args.params.city

  let selectedCity: CityT | null = null;
  let foundMatch = false;

  // pick out the city we want from all the cities
  for (const cur of main.body.cities) {
    if (foundMatch)
      continue;

    if (cur.slug === citySlug){
      selectedCity = cur;
      foundMatch = true;
    }
  }

  // keep only the "vetted" places
  if (selectedCity) {
    selectedCity.popos = [...(selectedCity?.popos || [])].filter((popo) => popo.vetted || false)
  }

  return {
    ...main,
    status: foundMatch ? 200 : 404,
    body: selectedCity || {}
  }
}