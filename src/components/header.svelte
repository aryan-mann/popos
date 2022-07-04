<script lang="ts">
	import Geolocation from 'svelte-geolocation';
	import { HomeIcon, MapIcon } from 'svelte-feather-icons';
	import { location } from '../state';
	let shouldGetPosition = false;

	const headerData = {
		menuItems: [
			{
				url: '/',
				title: 'Home',
				icon: HomeIcon,
				type: 'Link'
			},
			{
				title: 'Popos',
				url: '/logo.png',
				type: 'Logo'
			},
			{
				url: '/cities',
				title: 'Cities',
				icon: MapIcon,
				type: 'Link'
			}
		]
	};

	function getPosition() {
		shouldGetPosition = true;
	}
	// eslint-disable-next-line no-undef
	function onPositionReceived(e: CustomEvent<GeolocationPosition>) {
		shouldGetPosition = false;
		const latitude = e.detail.coords.latitude;
		const longitude = e.detail.coords.longitude;

		if (typeof latitude == 'number' && typeof longitude == 'number') {
			location.set([latitude, longitude]);
		}
	}
</script>

<header>
	<nav
		class="flex flex-col items-center max-w-6xl px-4 py-4 m-auto sm:flex-row sm:justify-between navbar"
	>
		<div
			class="flex items-center justify-between w-full mb-4 space-x-2 font-medium sm:w-auto sm:mb-0"
		>
			{#each headerData.menuItems as menuItem}
				{#if menuItem.type === 'Link'}
					<a
						href={menuItem.url}
						class="flex items-center px-3 py-2 text-xl text-gray-800 duration-200 rounded hover:bg-secondary-400 bg-secondary-200"
					>
						<svelte:component this={menuItem.icon} size="1.5x" />
						<span class="px-2">{menuItem.title}</span>
					</a>
				{:else if menuItem.type === 'Logo'}
					<div class="w-auto h-16 sm:pr-8 sm:order-first">
						<img class="w-full h-full shadow-lg rounded-xl" alt="" src={menuItem.url} />
					</div>
				{/if}
			{/each}
		</div>
		<div class="w-full text-xl sm:w-auto">
			<Geolocation
				getPosition={shouldGetPosition}
				on:position={onPositionReceived}
				let:loading
				let:success
				let:error
				let:notSupported
			>
				{#if notSupported || loading || error || $location}
					<p class="w-full px-2 py-1 text-center text-white rounded shadow-xl bg-primary-700">
						{#if $location}
							Using Location!
						{:else if notSupported}Unsupported.
						{:else if loading}Loading..
						{:else if error}Error!
						{/if}
					</p>
				{:else}
					<button
						class="w-full px-2 py-1 rounded shadow-xl bg-primary-400 hover:bg-primary-200"
						on:click={getPosition}>Use My Location</button
					>
				{/if}
			</Geolocation>
		</div>
	</nav>
</header>
