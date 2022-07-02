<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl, { Marker, type LngLatBoundsLike, type LngLatLike } from 'mapbox-gl';
	import type { City, Popo } from 'src/types';
	import { location } from '../../../state';
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

	interface PopoLink {
		url: string | null;
		name: string;
	}
	let map: mapboxgl.Map;
	export let popos: Popo[];
	let markers: Array<mapboxgl.Marker> = [];
	let popups: Array<mapboxgl.Popup> = [];

	const travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit';

	onMount(() => {
		const minBounds: LngLatLike = [
			Math.min(...popos.map((popo: Popo) => popo.mapCoordinates[1])) * 1.0001,
			Math.min(...popos.map((popo: Popo) => popo.mapCoordinates[0])) * 1.0001
		];
		const maxBounds: LngLatLike = [
			Math.max(...popos.map((popo: Popo) => popo.mapCoordinates[1])) * 1.0001,
			Math.max(...popos.map((popo: Popo) => popo.mapCoordinates[0])) * 1.0001
		];
		const bounds: LngLatBoundsLike = [minBounds, maxBounds];

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [(minBounds[0] + maxBounds[0]) / 2, (minBounds[1] + maxBounds[1]) / 2],
			projection: { name: 'globe' },
			zoom: 9
		});
		addMarkers();
		map.fitBounds(bounds);
	});

	// need a better way to build popups
	function addMarkers() {
		popos.map((popo: Popo) => {
			let imageUrl = `https://picsum.photos/seed/${popo.name}/600/450`;
			if (popo.imageName) imageUrl = `/images/${popo.imageName}`;

			const popup = new mapboxgl.Popup({
				offset: 25,
				closeButton: false,
				className: 'bg-white rounded-md shadow-sm w-64'
			}).setHTML(`
      <div>
      <img class="h-48 object-cover rounded-t-md w-full group-hover:scale-95 duration-150 group-hover:rounded-md"
          alt=""
          src="${imageUrl}">
      </img>
      <div class="p-2">
      <div class="flex justify-center font-bold mt-2 text-base">${popo.name}</div>
      <div class="mt-2 text-base">${popo.description}</div>
      <div class="mt-2 text-base">${$location}</div>
      </div>
      </div>`);
			popups.push(popup);
			markers.push(
				new mapboxgl.Marker()
					.setLngLat([popo.mapCoordinates[1], popo.mapCoordinates[0]])
					.setPopup(popup)
					.addTo(map)
			);
		});
	}

	location.subscribe(() => {
		if (map && $location) {
			markers.map((marker) => marker.remove());
			popups.map((popup) => popup.remove());
			addMarkers();
			new mapboxgl.Marker().setLngLat([$location[1], $location[0]]).addTo(map);
			map.flyTo({ center: [$location[1], $location[0]], essential: true });
		}
	});

	export function resizeMap() {
		setTimeout(() => {
			map.resize();
		}, 0); // this is so hacky but it works LOL
	}
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js"></script>
</svelte:head>

<div id="map" class="w-full h-[calc(100vh-12rem)]" />
