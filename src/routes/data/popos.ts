import toml from 'toml'
import fs from 'fs/promises'
import type { Dataset } from 'src/types';

interface PoposGet {
  status: number;
  Headers: any;
  body: Dataset
}

export async function get(args: any): Promise<PoposGet>  {
  const poposTomlString = await fs.readFile('./db/popos.toml', "utf-8")
  const poposJson: Dataset = toml.parse(poposTomlString);

  // Some processing
  //   1. Add city slug to Popo definition 
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