<script>
	import HeaderBar from '../HeaderBar.svelte'
	import ReplayDetails from './ReplayDetails.svelte'
	let replay;
  </script>
  <HeaderBar/>
  <main>
	<ReplayDetails {replay}/>
  </main>

