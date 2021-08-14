<script>
	import { onMount } from 'svelte';
	import Event from './Event.svelte';
	import NewEvent from './NewEvent.svelte';


	let events = [];
	let error;
	let showNew = false;

	async function getAllEvents() {
		const response = await fetch('http://localhost:8001/events');
		if (response.ok) {
			events = await response.json();
		} else {
			error = response.status;
		}
	}

	onMount(getAllEvents);
</script>

<main>
	{#each events as event (event[0]) }
	<Event id={event[0]} desc={event[1]} timestamp={event[2]} on:message={getAllEvents}/>
	{/each}

	{#if error}
	<p class="error">{error}</p>
	{/if}

	{#if showNew}
	<NewEvent on:message={getAllEvents} />
	{/if}
	<button id="new" on:click={() => showNew = !showNew}>New</button>
</main>

<style>
	.error {
		color: red;
	}

	#new {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
	}
</style>