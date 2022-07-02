<script context="module" lang="ts">
	import type { City, Coordinates, Popo as PopoT } from 'src/types';
	import { location } from '../../state';
	import Popo from './components/Popo.svelte';
	import CityMap from './components/CityMap.svelte';

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
		<div class="flex items-end text-lg">
			{#if !showMap}
				Map View
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="mx-2"
					><path
						d="M12 0c-3.148 0-6 2.553-6 5.702 0 4.682 4.783 5.177 6 12.298 1.217-7.121 6-7.616 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12 16l-6.707-2.427-5.293 2.427-5.581-2.427-6.419 2.427 4-9 3.96-1.584c.38.516.741 1.08 1.061 1.729l-3.523 1.41-1.725 3.88 2.672-1.01 1.506-2.687-.635 3.044 4.189 1.789.495-2.021.465 2.024 4.15-1.89-.618-3.033 1.572 2.896 2.732.989-1.739-3.978-3.581-1.415c.319-.65.681-1.215 1.062-1.731l4.021 1.588 3.936 9z"
					/></svg
				>
			{:else}
				List View
				<svg
					clip-rule="evenodd"
					fill-rule="evenodd"
					stroke-linejoin="round"
					stroke-miterlimit="2"
					viewBox="0 0 24 24"
					height="24"
					width="24"
					class="mx-2"
					xmlns="http://www.w3.org/2000/svg"
					><path
						d="m22 16.75c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75z"
						fill-rule="nonzero"
					/></svg
				>
			{/if}
		</div>
	</button>
	<h1 class="text-7xl text-black mb-8 mt-4">{selectedCity.displayName}</h1>
	{#if selectedCity.popos}
		<div class={`w-full ${!showMap ? 'hidden' : ''}`}>
			<CityMap bind:this={mapComponent} />
		</div>

		{#if !showMap}
			<div class={`grid grid-cols-3 gap-x-2 gap-y-4 justify-center`}>
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
