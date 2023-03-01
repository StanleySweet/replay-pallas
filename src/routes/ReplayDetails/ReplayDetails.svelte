<script type="text/javascript">
  import { onMount } from "svelte";
	import PlayerStatistics from './PlayerStatistics.svelte'


  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

  export let replay = null;
  export let playerData = null;
  onMount(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('matchId');
      const r = await fetch(`http://localhost:8080/replays/${matchId}`)
      const data = await r.json();
      replay = data;
      if(replay.metadata)
      {
        replay.previewImage = replay.metadata.mapPreview?.split(":")[2]
        const mode = (myArray) => myArray.reduce(      (a,b,i,arr)=>      (arr.filter(v=>v===a).length>=arr.filter(v=>v===b).length?a:b),null);
        playerData = replay.metadata.settings.PlayerData;
        for(const player of playerData)
          player.MostUsedCmd = mode(player.Commands.map(a => a.type));
        for(const player of playerData)
          player.SecondMostUsedCmd = mode(player.Commands.filter(a => a.type !== player.MostUsedCmd).map(a => a.type));

      }
    })
</script>
<div  id="wrapper">
  {#if replay}
  <h2><a href="../">Replay Pallàs</a> &gt; {replay.matchId}</h2>
  <h3><a href="../">General Match Info</h3>
  <div class="grid grid-cols-4">
     <div class="crop-container">
        <img width="256" src="https://cdn.jsdelivr.net/gh/0ad/0ad/binaries/data/mods/public/art/textures/ui/{replay.previewImage}" style="position: relative; max-width:none;" alt="map preview of {replay.metadata.settings.Name}" aria-hidden="true">
     </div>
     <article class="col-span-3 grid grid-cols-2">
      <small>
       Map Name: <b>{replay.metadata.settings.Name || replay.metadata.settings.mapName}</b>
        </small><br/>
      <small>
      Number of players: <b>{replay.metadata.settings.PlayerData.length}</b>
      </small><br/>
      <small>
        Match duration: <b>{(replay.metadata.settings.MatchDuration + "").toHHMMSS()}</b>
      </small><br/>
      <small>
        Date: <b>{new Date(replay.metadata.timestamp *1000).toLocaleDateString("en-GB",{
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
    })}</b>
      </small><br/>
      <small>
        Pyrogenesis Version: <b>{replay.metadata.engine_version}</b>
      </small><br/>

    {#if replay.metadata.settings.Biome}
      <small>
        Biome: <b>{replay.metadata.settings.Biome}</b>
      </small><br/>
    {/if}
    {#if replay.metadata.settings.RatingEnabled}
      <small>
        Ranked: <b>{replay.metadata.settings.RatingEnabled}</b>
      </small><br/>
      {/if}
      <small>
        Teams Locked: <b>{replay.metadata.settings.LockTeams}</b>
      </small><br/>
      <small>
        Random Map Seed: <b>{replay.metadata.settings.Seed}</b>
      </small><br/>
      <small>
        Starting Resources: <b>{replay.metadata.settings.StartingResources}</b>
      </small><br/>
      <small>
        Population Cap: <b>{replay.metadata.settings.PopulationCap}</b>
      </small><br/>



    {#if replay.metadata.settings.Size}
      <small>
        Size: <b>{replay.metadata.settings.Size}</b>
      </small>
    {/if}
    </article>
  </div>
  {#if playerData}
    <PlayerStatistics {playerData} />
  {/if}
  {:else}
  <p class="loading">loading...</p>
  {/if}
</div>

<style>
.crop-container {
    width: 205px;
    height: 150px;
    overflow: hidden;
}
img {
  line-height: 0;
  text-indent: -999em;
}
img::after {
  content: "";
  display: block;
  background-color: white;
  background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1255/image-not-found.svg");
  background-position: center;
  background-size: cover;
  padding: 50% 0;
  margin-left: -80px;
  position: relative;
}
</style>
