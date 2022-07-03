<script lang="ts">
	import mapboxgl, { type LngLatBoundsLike } from 'mapbox-gl';
	import type { City, Popo } from 'src/types';
	import { distanceBetweenCoordinates } from '../../../utils';
	import { onMount } from 'svelte';
	import { derived, type Readable } from 'svelte/store';
	import turf from 'turf';
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
	export let city: City;

	const travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit';
	const getDistance = (userLocation: [number, number], popo: Popo) => {
		return distanceBetweenCoordinates(
			[userLocation[0], userLocation[1]],
			[popo.mapCoordinates[0], popo.mapCoordinates[1]]
		);
	};

	const getLinks = (userLocation: [number, number] | null, popo: Popo) => {
		let mapsMarkerUrl = `https://www.google.com/maps?q=${popo.name}`;
		let mapsDirectionUrl = null;

		if (city) {
			mapsMarkerUrl += `, ${city.address}`;
		}
		if ($location) {
			mapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&travelmode=${travelMode}&origin=${userLocation[0]},${userLocation[1]}&destination=${popo.mapCoordinates[0]},${popo.mapCoordinates[1]}`;
		}

		return [
			{ name: 'Maps', url: mapsMarkerUrl },
			{ name: 'Walk', url: mapsDirectionUrl }
		];
	};

	const features = turf.featureCollection(
		popos.map((popo: Popo) =>
			turf.point([popo.mapCoordinates[1], popo.mapCoordinates[0]], { name: popo.name })
		)
	);
	const boundsArr = turf.bbox(features);
	const mapBounds: LngLatBoundsLike = [boundsArr[0], boundsArr[1], boundsArr[2], boundsArr[3]];
	const center = turf.center(features).geometry.coordinates;
	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			zoom: 10,
			center: [center[0], center[1]],
			projection: { name: 'globe' }
		});
		addMarkers();
		console.log(mapBounds);

		map.on('load', () => {
			map.fitBounds(mapBounds);
		});
	});

	// need a better way to build popups
	function addMarkers() {
		popos.map((popo: Popo) => {
			let imageUrl = `https://picsum.photos/seed/${popo.name}/600/450`;
			if (popo.imageName) imageUrl = `/images/${popo.imageName}`;
			const links = getLinks($location, popo);
			const popup = new mapboxgl.Popup({
				offset: 25,
				closeButton: false,
				className: 'bg-white rounded-md shadow-sm w-64'
			}).setHTML(`
      <div>
        ${
					$location
						? `<div class="absolute rounded top-0 right-0 pointer-events-none px-2 py-1 bg-white">${getDistance(
								$location,
								popo
						  )} Kms</div>`
						: ''
				}
      <img class="h-48 object-cover rounded-t-md w-full group-hover:scale-95 duration-150 group-hover:rounded-md"
          alt=""
          src="${imageUrl}">
      </img>
      <div class="p-2">
      <div class="flex justify-center font-bold m-2 text-base">${popo.name}</div>
      <div class="m-2 text-base">${popo.description}</div>
      <div
        class="flex flex-col rounded shadow-sm justify-self-end p-2"
        style="background-color: var(--color-primary);"
      >
      <p class="text-base">Hours: ${popo.openingHours}</p>
      <div class="flex gap-4 justify-end mt-3">
        <a
          target="_blank"
          class="self-end px-4 py-1 shadow hover:shadow-xl rounded"
          style="background-color: var(--color-secondary);"
          href="${links[0].url}">
          ${links[0].name}
        </a>
        ${
					$location
						? `<a
          target="_blank"
          class="self-end px-4 py-1 shadow hover:shadow-xl rounded"
          style="background-color: var(--color-secondary);"
          href="${links[1].url}">
          ${links[1].name}`
						: ''
				}
        </a> 
      </div>
      </div>
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
			// add user location marker
			const userPopup = new mapboxgl.Popup({ closeButton: false }).setText('Your location');
			new mapboxgl.Marker({ color: 'red' })
				.setLngLat([$location[1], $location[0]])
				.setPopup(userPopup)
				.addTo(map);
			map.flyTo({ center: [$location[1], $location[0]], essential: true });
		}
	});

	export function resizeMap() {
		setTimeout(() => {
			map.resize();
		}, 0); // this is so hacky but it works LOL
	}

	function flyToPopos() {
		map.flyTo({ center: [center[0], center[1]], essential: true });
		map.fitBounds(mapBounds);
	}
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js"></script>
</svelte:head>

<div id="map" class="w-full h-[calc(100vh-12rem)]">
	<button
		style="background-color: var(--color-secondary);"
		class="absolute top-0 right-0 border m-4 p-2 z-50"
		on:click={flyToPopos}>Focus on Popos</button
	>
</div>
