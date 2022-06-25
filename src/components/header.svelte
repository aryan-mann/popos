<script lang="ts">
	import Geolocation from 'svelte-geolocation';
	import { location } from '../state'
	let getPosition = false;

	const headerData = {
		menuItems: [
			{
				url: '/',
				title: 'Home'
			},
			{
				url: '/cities',
				title: 'Cities'
			}
		]
	};
</script>

<header class="bg-gray-50">
	<nav class="max-w-7xl m-auto py-2 px-4 flex justify-between">
		<ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
			{#each headerData.menuItems as menuItem}
				<li>
					<a
						href={menuItem.url}
						class="block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white"
						aria-current="page"
					>
						{menuItem.title}
					</a>
				</li>
			{/each}
		</ul>
		<div>
			{#if $location != null}
				<p>Coordinates: {$location}</p>
			{:else}
				<Geolocation 
					getPosition={getPosition}
					on:position={(e) => {
						const latitude = e.detail.coords.latitude;
						const longitude = e.detail.coords.longitude;
						
						if (typeof(latitude) == "number" && typeof(longitude) == "number") {
							location.set([latitude, longitude])
						}
					}}
					let:loading let:success let:error let:notSupported
				>
					{#if notSupported}
						Your browser does not support the Geolocation API.
					{:else if loading}
						Loading...
					{:else if error}
						An error occurred. {error.code} {error.message}
					{:else}
						<button on:click={() => (getPosition = true)}>Get My Location</button>
					{/if}
				</Geolocation>
			{/if}
		</div>
	</nav>
</header>
