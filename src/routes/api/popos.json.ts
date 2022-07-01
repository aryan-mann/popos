import toml from 'toml'
import fs from 'fs/promises'
import type { Dataset } from 'src/types';

interface PoposGet {
  status: number;
  Headers: any;
  body: Dataset
}

/** @type {import('./__types/items').RequestHandler} */
export async function get(): Promise<PoposGet>  {
  const poposTomlString = await fs.readFile('./src/lib/popos.toml', "utf-8")
  const poposJson: Dataset = toml.parse(poposTomlString);

  // Some processing:
  //   1. Add city slug to Popo 
  for (let city of poposJson.cities) {
    if (city.popos) {
      for (let popo of city.popos) {
        popo.citySlug = city.slug;
      }
    }
  }

  return {
    status: 200,
    Headers: {
      "Content-Type": "application/json"
    },
    body: poposJson
  }
}