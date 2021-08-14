<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let value;

    async function post() {
        const response = await fetch('http://localhost:8001/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({desc: value})
        });
        let result = await response.json();
        if (result.status == "ok") {
            dispatch('message');
        }
    }
</script>

<div>
    <textarea bind:value placeholder="what happend?"></textarea>
    <button id="post" on:click={post}>Post</button>
</div>

<style>
    textarea {
        height: 20rem;
        width: 24rem;
        resize: none;
    }

    div {
        display: flex;
        justify-content: center;
        align-items: stretch;
        
        position: fixed;
        bottom: 2rem; 
        left: calc(50% - 12rem);
    }
</style>