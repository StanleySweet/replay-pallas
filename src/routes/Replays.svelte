<script>
    import { onMount } from "svelte";
    import Replay from "./Replay.svelte";
    export let replays;
    onMount(async () => {
        await fetch(`http://localhost:8080/replays`)
          .then(r => r.json())
          .then(data => {
            replays = data;
          });
      })
</script>

<div  id="wrapper">
  {#if replays}

  <h2>Replay Pallàs</h2>
  {/if}
  <div class="grid grid-cols-5">
  {#if replays}

{#each replays as replay }
    <Replay {replay} />
{/each}
{:else}
  <p class="loading">loading...</p>
{/if}

</div>

</div>

<style>

  .loading {
    opacity: 0;
    animation: 0.4s 0.8s forwards fade-in;
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  li {
    list-style-type: georgian;
  }
</style>
