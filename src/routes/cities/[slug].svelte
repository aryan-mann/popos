<script context="module" lang="ts">
	import type { City, Coordinates, Popo as PopoT } from 'src/types';
	import { location } from '../../state';
	import Popo from './components/Popo.svelte';

	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const response = await fetch(`/api/citypopos/${params.slug}.json`);
		const selectedCity: City = (await response.json()) || [];

		return {
			status: response.status,
			props: {
				selectedCity
			}
		};
	}
</script>

<script lang="ts">
	import { distanceBetweenCoordinates, formatTitle } from '../../utils'
	import { derived, type Readable } from 'svelte/store';
	
	function distanceFromLocation(c1: Coordinates, c2: Coordinates): number {
		if ($location == null)
			return 0
		const distC1 = distanceBetweenCoordinates(c1, $location);
		const distC2 = distanceBetweenCoordinates(c2, $location);
		return distC1 - distC2;
	}

	export let selectedCity: City;

	const cityPopos: Readable<PopoT[]> = derived(location, $location => {
		if (!selectedCity || !selectedCity.popos)
			return []

		return [...selectedCity.popos]
			.sort((x, y) => distanceFromLocation(x.mapCoordinates, y.mapCoordinates));
	}, selectedCity?.popos || []);
</script>

<svelte:head>
	<title>{formatTitle(`${selectedCity.displayName}`)}</title>
</svelte:head>

{#if selectedCity == null}
	<p>City not found</p>
{:else}
	<h1 class="text-7xl text-black mb-8 mt-4">{selectedCity.displayName}</h1>
	{#if selectedCity.popos}
		<div class="grid grid-cols-3 gap-x-2 gap-y-4">
			{#each $cityPopos as popo (popo.name)}
				<Popo {popo} city={selectedCity} />
			{/each}
		</div>
	{:else}
		<p>No popos found.</p>
	{/if}
{/if}
