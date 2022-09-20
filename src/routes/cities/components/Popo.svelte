<script lang="ts">
	import type { CityT, PopoLinkT, PopoT } from 'src/types';
	import { derived, type Readable } from 'svelte/store';
	import { location } from '../../../state';
	import { distanceBetweenCoordinates } from '../../../utils';
	import { StarIcon } from 'svelte-feather-icons';
	import { raf } from "svelte/internal";

	export let popo: PopoT;
	export let city: CityT;

	const travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit';

	let imageUrl = `https://picsum.photos/seed/${popo.name}/600/450`;
	if (popo.imageName) imageUrl = `/images/${city.slug}/${popo.imageName}`;

	const distance: Readable<number | null> = derived(
		location,
		($location) => {
			if (!$location) return null;

			return distanceBetweenCoordinates(
				[$location[0], $location[1]],
				[popo.mapCoordinates[0], popo.mapCoordinates[1]]
			);
		},
		null
	);

	const links: Readable<PopoLinkT[]> = derived(
		location,
		($location) => {
			const mapsMarkerQueryBase = `https://www.google.com/maps?q=`;
			let mapsMarkerUrl = `${mapsMarkerQueryBase}${popo.name}`;
			let mapsDirectionUrl = null;

			// TODO: this should go in a utils class!
			if (popo.address) {
				mapsMarkerUrl = `${mapsMarkerQueryBase}${popo.address}`;
			} else if (city) {
				mapsMarkerUrl += `, ${city.address}`;
			}
			if ($location) {
				mapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&travelmode=${travelMode}&origin=${$location[0]},${$location[1]}&destination=${popo.mapCoordinates[0]},${popo.mapCoordinates[1]}`;
			}

			return [
				{ name: 'Open Map', url: mapsMarkerUrl },
				{ name: 'Transit', url: mapsDirectionUrl }
			];
		},
		[]
	);

	function formatRating(rating: number | undefined) {
		if (!rating)
			return '??';

		let starsLeft = 5;
		let text = '';

		for (let i=1; i <= rating; i++) {
			starsLeft -= 1;
			text += '★';
		}
		for (let i=1; i <= starsLeft; i++) {
			text += '☆';
		}

		return text;
	}
</script>

{#if popo}
	<div class="relative duration-200 bg-white rounded-md shadow-sm group hover:shadow-xl">
		<div class="absolute top-0 left-0 w-full h-full bb -z-10" />
		<div class="flex flex-col justify-between h-full">
			<div class="relative">
				<img
					class="object-cover w-full h-48 duration-150 rounded-t-md group-hover:scale-95 group-hover:rounded-md"
					alt=""
					src={imageUrl}
				/>
				{#if $distance}
					<p
						class="absolute top-0 right-0 px-2 py-1 rounded-bl pointer-events-none bg-secondary-100"
					>
						{$distance} Kms
					</p>
				{/if}
				<div class="px-4 pt-4 pb-2">
					<p class="mb-2 font-bold text-center">{popo.name}</p>
					<p>{popo.description}</p>
					{#if popo.authorNote}
						<p class="mt-2"><b>Authors Note: </b>{popo.authorNote}</p>
					{/if}
					<p class="mt-2"><b>Rating: </b><span class="text-secondary-600">{formatRating(popo.rating)}</span></p>
					<p class="py-1 mt-3 text-center rounded bg-primary-200">Open: {popo.openingHours}</p>
				</div>
			</div>
			{#if popo.tags}
				<div class="flex items-center w-full gap-2 px-4 overflow-x-scroll">
					{#each popo.tags as tag}
						<p class="px-2 py-1 rounded bg-secondary-200" style="min-width: fit-content;">{tag}</p>
					{/each}
				</div>
			{/if}
			<div />
			<div
				class="flex flex-col p-2 m-2 rounded shadow-sm justify-self-end"
				style="background-color: var(--color-primary);"
			>
				<div class="flex items-center justify-center gap-4">
					{#each $links as { url, name }}
						{#if url}
							<a
								target="_blank"
								class="self-end px-4 py-1 rounded shadow hover:shadow-xl"
								style="background-color: var(--color-secondary);"
								href={url}>{name}</a
							>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<p>Popo not found</p>
{/if}
