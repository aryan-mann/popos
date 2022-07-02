<script context="module" lang="ts">
	import type { City, Coordinates, Popo as PopoT } from 'src/types';
	import { location } from '../../state';
	import Popo from './components/Popo.svelte';
	import CityMap from './components/CityMap.svelte';
	import Icon from '../../components/Icon.svelte';

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
	import { distanceBetweenCoordinates, formatTitle } from '../../utils';
	import { derived, type Readable } from 'svelte/store';
	import { onMount } from 'svelte';

	function distanceFromLocation(c1: Coordinates, c2: Coordinates): number {
		if ($location == null) return 0;
		const distC1 = distanceBetweenCoordinates(c1, $location);
		const distC2 = distanceBetweenCoordinates(c2, $location);
		return distC1 - distC2;
	}

	export let selectedCity: City;
	let showMap: boolean = false;

	const toggleShowMap = () => {
		showMap = !showMap;
	};

	let mapComponent: any;
	let resizeMap: any;

	onMount(function () {
		resizeMap = function () {
			mapComponent.resizeMap();
		};
	});

	const cityPopos: Readable<PopoT[]> = derived(
		location,
		($location) => {
			if (!selectedCity || !selectedCity.popos) return [];

			return [...selectedCity.popos].sort((x, y) =>
				distanceFromLocation(x.mapCoordinates, y.mapCoordinates)
			);
		},
		selectedCity?.popos || []
	);
</script>

<svelte:head>
	<title>{formatTitle(`${selectedCity.displayName}`)}</title>
</svelte:head>

{#if selectedCity == null}
	<p>City not found</p>
{:else}
	<button
		class="cool-text fixed bottom-0 right-0 m-6 px-2 py-1 text-gray-800 rounded-full shadow-lg z-50 w-auto"
		on:click={() => {
			toggleShowMap();
			resizeMap();
		}}
	>
		<div class="flex gap-2 text-lg">
			{#if !showMap}
				Map View
				<Icon
					direction={'n'}
					stroke="black"
					strokeWidth={1}
					name={'map'}
					height="1.5em"
					width="1.5em"
				/>
			{:else}
				Grid View
				<Icon
					direction={'n'}
					stroke="black"
					strokeWidth={1}
					name={'grid'}
					height="1.5em"
					width="1.5em"
				/>
			{/if}
		</div>
	</button>
	<h1 class="text-7xl text-black mb-4">{selectedCity.displayName}</h1>
	{#if selectedCity.popos}
		<div class={`w-full ${!showMap ? 'hidden' : ''}`}>
			<CityMap popos={$cityPopos} bind:this={mapComponent} />
		</div>

		{#if !showMap}
			<div class={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 justify-center`}>
				{#each $cityPopos as popo (popo.name)}
					<Popo {popo} city={selectedCity} />
				{/each}
			</div>
		{/if}
	{:else}
		<p>No popos found.</p>
	{/if}
{/if}

<style>
	@import '../../vars.css';
	.cool-text {
		padding: 4px 8px;
		color: black;
		background-color: var(--color-secondary);
		border-radius: 4px;
	}
	.cool-text.disabled {
		background-color: gray;
	}
</style>
