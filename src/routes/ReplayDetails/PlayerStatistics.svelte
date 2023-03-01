<script type="text/javascript">
  export let playerData = [];
</script>
{#if playerData && playerData.length}
<div class="grid grid-cols-2">
  <h3><a href="../">Player Statistics</h3>
    {#each playerData as playerInfo }
    <article class="col-span-3 grid grid-cols-2">
        <small>
        Player Name: <span style="color:rgb({playerInfo.Color.r} {playerInfo.Color.g} {playerInfo.Color.b});"><b>{'\u25A0'}</b></span> <b>{playerInfo.Name}</b>
        </small><br/>
        <small>
        Number of orders given: <b>{playerInfo.Commands.length}</b>
        </small><br/>
        <small>
        Most used order: <b>{playerInfo.MostUsedCmd}</b>
        </small><br/>
        <small>
          Second most used order: <b>{playerInfo.SecondMostUsedCmd}</b>
          </small><br/>
    </article>
    {/each}
</div>
{/if}

