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


    let r_hostelries = []

    async function getHostelryResource(){
        console.log("--HostelriesAPI:\n  FrontEnd -> Fetching resource..");
        const res = await fetch("/api/v1/hostelries");

        if(res.ok){
            console.log("--HostelriesAPI:\n  FrontEnd -> Success");
            const json = await res.json();
            r_hostelries = json;
            console.log(`--HostelriesAPI:\n  FrontEnd -> We have received ${r_hostelries.length} resources `);
        }else{
            console.log("--HostelriesAPI:\n  FrontEnd -> Error");
        }
    }

    onMount(getHostelryResource);
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
                <th>Personal contratado</th>
                <th>Establecimientos abiertos</th>
                <th>Turistas</th>
            </tr>
        </thead>
        <tbody>
            {#each r_hostelries as r}
                <tr>
                    <td>{r.district}</td>
                    <td>{r.year}</td>
                    <td>{r.employee_staff}</td>
                    <td>{r.establishment_open}</td>
                    <td>{r.traveler_numer}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>