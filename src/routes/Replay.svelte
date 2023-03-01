<script>
  // create a prop
  export let replay;
</script>

<article>
  <h4><a href="/ReplayDetails?matchId={replay.matchId}"> {replay.metadata.settings.Name || replay.metadata.settings.mapName}</a></h4>
  <small>
    Number of players: <b>{replay.metadata.settings.PlayerData.length}</b>
  </small><br/>
  <small>
    Pyrogenesis Version: <b>{replay.metadata.engine_version}</b>
  </small><br/>

</article>

<style>
  article {
    margin: 0 0 1em 0;
  }
  h1 {
    font-size: 1.4em;
    margin: 0;
    display: block;
  }
</style>
