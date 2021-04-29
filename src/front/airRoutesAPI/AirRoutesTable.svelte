<script>

    //Permite lanzar/cargar cuando se cargue el componente
    //nuestro componente : getHostelryResource()
    import {
        onMount
    }from "svelte";

    //https://sveltestrap.js.org/?path=/story/components--table
    //import Table from "sveltestrap/src/Table.svelte";
    //import { Table } from 'sveltestrap/src';
    //import { Table } from 'sveltestrap';


    let r_airRoutes = []

    async function getAirRoutesResource(){
        console.log("--AirRoutesAPI:\n  FrontEnd -> Fetching resource..");
        const res = await fetch("/api/v1/air_routes");

        if(res.ok){
            console.log("--AirRoutesAPI:\n  FrontEnd -> Success");
            const json = await res.json();
            r_airRoutes = json;
            console.log(`--AirRoutesAPI:\n  FrontEnd -> We have received ${r_airRoutes.length} resources `);
        }else{
            console.log("--AirRoutesAPI:\n  FrontEnd -> Error");
        }
    }

    onMount(getAirRoutesResource);
</script>

<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>

<main>
    <!-- https://www.w3schools.com/html/html_tables.asp -->
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Comunidad</th>
                <th>Año</th>
                <th>Vuelos</th>
                <th>Pasajeros</th>
                <th>Mercancía</th>
            </tr>
        </thead>
        <tbody>
            {#each r_airRoutes as r}
                <tr>
                    <td>{r.district}</td>
                    <td>{r.year}</td>
                    <td>{r.flight}</td>
                    <td>{r.passenger}</td>
                    <td>{r.merchandise}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>