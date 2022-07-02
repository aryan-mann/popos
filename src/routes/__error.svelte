<script context="module" lang="ts">
	export function load({ error, status }) {
		return {
			props: {
				message: error.message,
				status // same as status: status
			}
		};
	}
</script>

<script>
	import FourOhFour from '../components/FourOhFour.svelte';
	export let message;
	export let status;
</script>

{#if status == 404}
	<FourOhFour />
{:else}
	<div>Something went wrong. Here's more information:<br /> {message}</div>
{/if}
