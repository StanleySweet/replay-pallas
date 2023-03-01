<script>
	import HeaderBar from './HeaderBar.svelte'
	import Replays from './Replays.svelte'
	let replays;
  </script>
  <HeaderBar/>
  <main>
	<Replays {replays}/>
  </main>
