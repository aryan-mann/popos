<script context="module" lang="ts">
  import type { CityT, Coordinates, PopoT as PopoT } from "src/types";
  import { location } from "../../state";
  import Popo from "./components/Popo.svelte";

  /** @type {import("./__types/[slug]").Load} */
  export async function load({ params, fetch }) {
    const response = await fetch(`/api/citypopos/${params.slug}.json`);
    const responseJson = await response.json()
    const selectedCity: CityT = responseJson || [];

    return {
      status: response.status,
      props: {
        selectedCity
      }
    };
  }
</script>

<script lang="ts">
  import { distanceBetweenCoordinates, formatTitle } from "../../utils";
  import { derived, type Readable } from "svelte/store";

  function distanceFromLocation(c1: PopoT, c2: PopoT): number {
    if ($location == null)
      return (c2?.rating ?? 0) - (c1?.rating ?? 0);

    const distC1 = distanceBetweenCoordinates(c1.mapCoordinates, $location);
    const distC2 = distanceBetweenCoordinates(c2.mapCoordinates, $location);

    if (distC1 === distC2)
      return (c2?.rating ?? 0) - (c1?.rating ?? 0)

    return distC1 - distC2;
  }

  export let selectedCity: CityT;

  const cityPopos: Readable<PopoT[]> = derived(location, $location => {
    if (!selectedCity || !selectedCity.popos)
      return [];

    return [...selectedCity.popos]
      .sort((x, y) => distanceFromLocation(x, y));
  }, selectedCity?.popos || []);
</script>

<svelte:head>
  <title>{formatTitle(`${selectedCity.displayName}`)}</title>
</svelte:head>

{#if selectedCity == null}
  <p>City not found</p>
{:else}
  <h1 class="mb-8 text-5xl text-black sm:mb-10 md:mb-12 sm:text-6xl sm:mt-5 md:mt-10 md:text-7xl">{selectedCity.displayName}</h1>
  {#if selectedCity.popos}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4">
      {#each $cityPopos as popo (popo.name)}
        <Popo {popo} city={selectedCity} />
      {/each}
    </div>
  {:else}
    <p>No popos found.</p>
  {/if}
{/if}
