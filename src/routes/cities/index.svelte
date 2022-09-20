<script context="module" lang="ts">
  import type { CityT } from "src/types";
  import { formatTitle } from "../../utils";

  /** @type {import('./__types/[slug]').Load} */
  export async function load({ fetch }) {
    const response = await fetch(`/api/cities.json`);
    const cities: CityT[] = await response.json();
    
    if (cities && cities.length == 1) {
      return {
        status: 302,
        redirect: `/cities/${cities[0].slug}`
      }
    }

    return {
      status: response.status,
      props: {
        cities,
      }
    };
  }
</script>

<script lang="ts">
  import Container from "../../components/Container.svelte";
  export let cities: CityT[] = [];
</script>

<svelte:head>
  <title>{formatTitle('Cities')}</title>
</svelte:head>

<div class="max-w-screen-sm m-auto">
  <h1 class="pb-8 text-5xl text-center">Places with some places</h1>
  <div class="flex flex-col space-y-4">
    {#each cities as city, i}
      <Container 
        containerProps={{
          class: "relative h-64 rounded-lg shadow-xl flex" 
        }}
        bgImageUrl={`/images/${city.slug}/${city.imageName}`}
        bgColor="rgba(255,255,255,0.40)"
      >
        <div class="flex flex-grow px-8 py-8 rounded">
          <a class="self-center px-2 py-2 text-3xl transition-colors duration-200 rounded bg-secondary-200 hover:bg-secondary-400" href={`/cities/${city.slug}`}>
            {city.displayName}
          </a>
        </div>
      </Container>
    {/each}
  </div>
</div>