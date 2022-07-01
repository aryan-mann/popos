<script lang="ts">
	import Geolocation from 'svelte-geolocation';
	import { location } from '../state'
	let shouldGetPosition = false;

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

	function getPosition() {
		shouldGetPosition = true;
	}
	function onPositionReceived(e: any) {
		const latitude = e.detail.coords.latitude;
		const longitude = e.detail.coords.longitude;
		
		if (typeof(latitude) == "number" && typeof(longitude) == "number") {
			location.set([latitude, longitude])
		}
	}
</script>

<style>
	@import '../vars.css';
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

<header>
	<nav class="navbar max-w-6xl m-auto py-4 items-center px-4 flex justify-between">
		<ul class="flex space-x-3 flex-row font-medium lg:flex-row lg:space-x-8 lg:mt-0">
			{#each headerData.menuItems as menuItem}
				<li>
					<a
						href={menuItem.url}
						class="block py-2 pr-4 pl-3 text-gray-800 shadow-lg rounded text-xl duration-200 hover:-rotate-2"
						style="background-color: var(--color-secondary);"
						aria-current="page"
					>
						{menuItem.title}
					</a>
				</li>
			{/each}
		</ul>
		<div>
			{#if $location != null}
				<p class="cool-text">Coordinates: {$location}</p>
			{:else}
				<Geolocation 
					getPosition={shouldGetPosition}
					on:position={onPositionReceived}
					let:loading let:success let:error let:notSupported
				>
					{#if notSupported}
						<p class="cool-text">Your browser does not support the Geolocation API.</p>
					{:else if loading}
						<p class="cool-text disabled">Loading...</p>
					{:else if error}
						<p class="cool-text">An error occurred. {error.code} {error.message}</p>
					{:else}
						<button 
							class="cool-text flex items-center px-2 py-1 text-gray-800 rounded shadow-lg"
							on:click={getPosition}
						>Get My Location</button>
					{/if}
				</Geolocation>
			{/if}
		</div>
	</nav>
</header>
