<script context="module" lang="ts">
	import type { CityT } from 'src/types';
	import { formatTitle } from '../../utils';

	/** @type {import('./__types/[slug]').Load} */
	export async function load({ fetch }) {
		const response = await fetch(`/api/cities.json`);
		const cities: CityT[] = await response.json();

		return {
			status: response.status,
			props: {
				cities
			}
		};
	}
</script>

<script lang="ts">
	import Container from '../../components/Container.svelte';
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
					class: 'relative h-64 rounded-lg shadow-xl flex transform hover:scale-[1.01] duration-300'
				}}
				bgImageUrl={`/images/${city.slug}/${city.imageName}`}
				bgColor="rgba(255,255,255, 0.6)"
			>
				<a
					class="flex flex-grow px-8 py-8 rounded duration-300"
					href={`/cities/${city.slug}`}
				>
					<div
						class="self-end px-2 py-2 transition-colors text-5xl text-stone-900 font-thin duration-200 rounded"
					>
						{city.displayName}
					</div>
				</a>
			</Container>
		{/each}
	</div>
</div>
