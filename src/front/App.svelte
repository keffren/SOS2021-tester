<script>
	//export let name;
	
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';

	//Imports of CulturaBASE
	import CulturaBASE from './culturaBASEAPI/CulturaBASE.svelte';
	import CulturaBASEDistrict from './culturaBASEAPI/EditCulturaBase.svelte';
	import GraphCB from './culturaBASEAPI/MyGraph.svelte';
	import DataGraph from './DataGraph.svelte';

	//Imports of Hostelries
	import Hostelries from './hostelriesAPI/Hostelries.svelte';
	import EditHostelryResource from './hostelriesAPI/editHostelryR.svelte';
	import GraphHostelry from './hostelriesAPI/MyGraph.svelte';

	import AirRoutes from './airRoutesAPI/AirRoutes.svelte';
	import NotFound from './NotFound.svelte';


	/*	The route definition is just a JavaScript dictionary (object)
		where the key is a string with the path (including parameters, etc),
		and the value is the route object.
	*/
	const routes = {
		'/info': Home,
		'/': Home,
		'/datagraph': DataGraph,
		
		//Hostelries API
		'/hostelries': Hostelries,
		'/hostelries/:district/:year': EditHostelryResource,
		'/hostelries/graph' : GraphHostelry,

		//CulturaBAse API
		'/culturaBASE': CulturaBASE,
		'/culturaBASE/:district/:year': CulturaBASEDistrict,
		'/culturaBASE/graph': GraphCB,
		
		//AirRoutes API
		'/airRoutes': AirRoutes,
		
		'*': NotFound
	};
</script>

<main>
	<Router {routes}/>
</main>

<!--
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
-->