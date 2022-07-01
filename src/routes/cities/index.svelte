<script context="module" lang="ts">
  import type { City } from "src/types";
import { formatTitle } from "../../utils";

  /** @type {import('./__types/[slug]').Load} */
  export async function load({ params, fetch, session, stuff }) {
    const response = await fetch(`/api/cities.json`);
    const cities: City[] = await response.json();
    
    return {
      status: response.status,
      props: {
        cities,
      }
    };
  }
</script>

<script lang="ts">
  export let cities: City[] = [];
</script>

<svelte:head>
  <title>{formatTitle('Cities')}</title>
</svelte:head>

<div class="max-w-screen-sm py-12 m-auto">
  <h1 class="text-6xl text-center py-8">Places with Places</h1>
  <div class="space-y-4 flex flex-col">
    {#each cities as city}
      <a class="px-8 py-8 bg-white rounded duration-500 hover:bg-yellow-100 text-4xl" href={`/cities/${city.slug}`}>{city.displayName}</a>
    {/each}
  </div>
</div>