<script context="module" lang="ts">
  import type { City } from "src/types";

  /** @type {import('./__types/[slug]').Load} */
  export async function load({ params, fetch, session, stuff }) {
    const response = await fetch(`/data/cities`);
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

{#each cities as city}
  <div>
    <a href={`/cities/${city.slug}`}>{city.displayName}</a>
  </div>
{/each}