<script>
	import { onMount } from 'svelte';
	import Event from './Event.svelte';


	let events = [];
	let error;

	onMount(async () => {
		const response = await fetch('http://localhost:8001/events');
		if (response.ok) {
			events = await response.json();
		} else {
			error = response.status;
		}
	});


</script>

<main>
	{#each events as event (event[0]) }
	<Event id={event[0]} desc={event[1]} timestamp={event[2]} />
	{/each}

	{#if error}
	<p class="error">{error}</p>
	{/if}
</main>

<style>
	.error {
		color: red;
	}
</style>