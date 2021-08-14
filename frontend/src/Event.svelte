<script>
    import { createEventDispatcher } from 'svelte';

    export let id;
    export let desc;
    export let timestamp;

    let editMode = false;
    let expanded = false;

    const dispatch = createEventDispatcher();

    async function sendEdit() {
        console.log("sending", desc);
        const response = await fetch(`http://localhost:8001/event?id=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({desc})
        });

        if (response.ok) {
            const s = await response.json();
            if (s.stauts == "patched") {
                dispatch('message');
            }
        }
        editMode = false;
    }

    async function remove() {
        const response = await fetch(`http://localhost:8001/event?id=${id}`, {
            method: 'DELETE'
        });  

        console.log(response);
        
        if (response.ok) {
            const s = await response.json();

            if (s.status == "deleted") {
                dispatch('message');
            }
        }
    }

</script>


<article id="event" on:click={() => expanded = !expanded}>
    <span>Ref: {id}</span>
    {#if editMode}
    <textarea bind:value={desc} on:click|stopPropagation></textarea>
    {:else}
    <p id="text">{desc}</p>
    {/if}
    <span id="timestamp">{timestamp}</span>

    {#if expanded}
    <div id="controls" on:click|stopPropagation>
        {#if editMode}
        <button id="save" on:click={sendEdit}>Save</button>
        {:else}
        <button id="edit" on:click={() => editMode = true}>Edit</button>
        {/if}
        <button id="delete" on:click={remove}>Delete</button>
    </div>
    {/if}
</article>

<style>
    #event {
        display: flex;
        justify-content: space-between;
        align-items: center;

        min-height: 5rem;

        border: 1px solid black;
        
        margin: 0.5rem;

        padding-left: 0.3rem;
        padding-right: 0.3rem;
        padding-top: 0.1rem;
        padding-bottom: 0.1rem;
    }

    #text {
        font-size: 1.5rem;
    }


    #timestamp {
        font-family: monospace;
        align-self: flex-start;
    }

    #controls {
        align-self: flex-end;
    }

    #delete {
        border: 1px solid red;
        background-color: red;
        color: white;
    }
    #delete:active {
        border: 1px inset black;
        background-color: crimson;
    }
</style>
