<script>
	//export let name;
	
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import CulturaBASE from './culturaBASEAPI/CulturaBASE.svelte';
	import Hostelries from './hostelriesAPI/Hostelries.svelte';
	import AirRoutes from './airRoutesAPI/AirRoutes.svelte';

	import NotFound from './NotFound.svelte';


	/*	The route definition is just a JavaScript dictionary (object)
		where the key is a string with the path (including parameters, etc),
		and the value is the route object.
	*/
	const routes = {
		'/': Home,
		'/hostelries': Hostelries,
		'/culturaBASE': CulturaBASE,
		'/airRoutes': AirRoutes,
		'*': NotFound
	};
</script>

<main>
	<!--
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	-->
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