<script context="module" lang="ts">
	import type { City } from 'src/types';
	import { location } from '../../state';

	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const response = await fetch(`/data/cities`);
		const cities: City[] = await response.json();

		const selectedCitySlug: string = params.slug;
		const selectedCities = cities.filter((city) => city.slug == selectedCitySlug);
		const selectedCity: City | null = selectedCities.length == 1 ? selectedCities[0] : null;

		return {
			status: response.status,
			props: {
				selectedCity
			}
		};
	}
</script>

<script lang="ts">
	export let selectedCity: City;

	function distanceFromCurrentLocation(coords: [number, number]): number {
		if ($location == null) return Infinity;

		function deg2rad(deg: number): number {
			return deg * (Math.PI / 180);
		}

		let lat1 = $location[0];
		let lon1 = $location[1];
		let lat2 = coords[0];
		let lon2 = coords[1];

		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2 - lat1); // deg2rad below
		var dLon = deg2rad(lon2 - lon1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km

		return Math.round(d * 10) / 10;
	}
</script>

{#if selectedCity == null}
	<p>City not found</p>
{:else}
	<h1>{selectedCity.displayName}</h1>
	{#if selectedCity.popos}
		{#each selectedCity.popos.sort((x, y) => distanceFromCurrentLocation(x.mapCoordinates) - distanceFromCurrentLocation(y.mapCoordinates)) as popo}
			<div class="px-4 py-4 mb-4 bg-blue-100">
				<ul>
					<li>Name: {popo.name}</li>
					<li>Map Coordinates: {popo.mapCoordinates}</li>
					<li>Description: {popo.description}</li>
					<li>Opening Hours: {popo.openingHours}</li>
					{#if $location}
						<li>Distance: {distanceFromCurrentLocation(popo.mapCoordinates)} Kms</li>
					{/if}
					<li class="my-1">
						<a
							target="_blank"
							class="font-bold text-white p-2 bg-green-800"
							href={`https://www.google.com/maps?q=${popo.mapCoordinates[0]},${popo.mapCoordinates[1]}`}
							>Open as Coordinates (Maps)</a
						>
					</li>
					<li class="my-1">
						<a
							target="_blank"
							class="font-bold text-white p-2 bg-green-800"
							href={`https://www.google.com/maps?q=${popo.name}, San Francisco`}
							>Open as Location (Maps)</a
						>
					</li>
				</ul>
			</div>
		{/each}
	{:else}
		<p>No popos found.</p>
	{/if}
{/if}
