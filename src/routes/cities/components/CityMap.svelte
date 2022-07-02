<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

	let map: mapboxgl.Map;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/light-v10',
			center: [16.37, 48.2],
			zoom: 12
		});
	});

	export function resizeMap() {
		setTimeout(() => map.resize(), 0); // this is so hacky but it works LOL
	}
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.min.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<div id="map" class="w-full" />
