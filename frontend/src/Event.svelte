<script>
    export let id;
    export let desc;
    export let timestamp;
</script>


<article class="event">
    <span>Ref: {id}</span>
    <p class="text">{desc}</p>
    <span class="timestamp">{timestamp}</span>
</article>

<style>
    .event {
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

    .text {
        font-size: 1.5rem;
    }


    .timestamp {
        font-family: monospace;
        align-self: flex-start;
    }
</style>
