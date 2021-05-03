<script>

    //Permite lanzar/cargar cuando se cargue el componente
    //nuestro componente : getHostelryResource()
    import {
        onMount
    }from "svelte";
    import Button from "sveltestrap/src/Button.svelte";

    //https://sveltestrap.js.org/?path=/story/components--table
    //import Table from "sveltestrap/src/Table.svelte";
    //import { Table } from 'sveltestrap/src';
    //import { Table } from 'sveltestrap';

    const BASE_HOSTELRIES_API_PATH = "/api/v1/hostelries";
    let outputMsg = "";
    let r_hostelries = []
    let newResource = {
        "district"           :   "",
        "year"               :   "",
        "employee_staff"     :   "",
        "establishment_open" :   "",
        "traveler_numer"     :   ""
    }

    // ¿fetch? => https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch

    

    async function getHostelryResource(){
        console.log("--HostelriesAPI:\n  FrontEnd -> Getting resource..");
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

    async function loadDB(){

        console.log("--HostelriesAPI:\n  FrontEnd -> Loading Initial Data into DB...");

        const res = await fetch(BASE_HOSTELRIES_API_PATH+"/loadInitialData");

        
        
        if(res.ok){
            getHostelryResource();
            outputMsg = res.status + ": " + res.statusText + " => Recursos cargados con éxito";
        }else{
            window.alert("ERROR: no se pudo cargar los datos!")
        }

        /*  Lo mismo que arriba 
            .then(function (res) {
                getHostelryResource();
                //outputMsg = res.status + ": " + res.statusText + ". Datos reiniciados con éxito";
            });
        */
        
        
    }

    async function insertResource(){
        console.log("--HostelriesAPI:\n  FrontEnd -> Inserting resource..");

        const res = await fetch("/api/v1/hostelries",
                        {
                            method  : "POST",
                            body    : JSON.stringify(newResource),
                            headers :{
                                "Content-Type": "application/json"
                            }
                        }
                    )
                    .then( (res) => {
                        getHostelryResource();
                        outputMsg = res.status + ": " + res.statusText + " => Recurso insertado con éxito";

                    })
    }

    async function deleteResource(district,year){
        console.log("--HostelriesAPI:\n  FrontEnd -> Deleting resource..");

        const res = await fetch("/api/v1/hostelries"+"/"+district+"/"+year,
                            {
                                method: "DELETE"
                            }
        
                        ).then((res) => {
                            getHostelryResource();
                            outputMsg = res.status + ": " + res.statusText + " => Recurso eliminado con éxito";

                        })
    }

    async function deleteAll(){
        const res = await fetch(BASE_HOSTELRIES_API_PATH, {
            method: "DELETE"
        }).then(function (res) {
            getHostelryResource();
			outputMsg = res.status + ": " + res.statusText + " => Recursos eliminados con éxito";
        });
    }

    

    onMount(getHostelryResource);
</script>

<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>

<main>
    {#await r_hostelries}
        Loading data...
    {:then r_hostelries}

    <Button outline color="info" on:click={loadDB}>Cargar recursos</Button>
    <Button outline color="danger" on:click={deleteAll}>Eliminar datos</Button>
    <!-- https://www.w3schools.com/html/html_tables.asp -->
    <!-- GET TABLE-->
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Comunidad</th>
                <th>Año</th>
                <th>Personal contratado</th>
                <th>Establecimientos abiertos</th>
                <th>Turistas</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each r_hostelries as r}
                <tr>
                    <td>
                        <a href="#/hostelries/{r.district}/{r.year}">{r.district}</a>
                    </td>
                    <td>{r.year}</td>
                    <td>{r.employee_staff}</td>
                    <td>{r.establishment_open}</td>
                    <td>{r.traveler_numer}</td>
                    <td><Button outline color="danger" on:click="{deleteResource(r.district,r.year)}">Eliminar</Button></td>
                </tr>
            {/each}
        </tbody>
    </table>

    <!-- INSERT TABLE-->
    <table>
        <h3> Añadir nuevo recurso:</h3>
            <tr>
                <td><strong>Provincia:</strong> <input bind:value="{newResource.district}"></td>
                <td><strong>Año:</strong> <input  bind:value="{newResource.year}"></td>
                <td><strong>Personal contratado:</strong> <input type="number" bind:value="{newResource.employee_staff}"></td>
                <td><strong>Establecimientos abiertos:</strong> <input type="number" bind:value="{newResource.establishment_open}"></td>
                <td><strong>Turistas:</strong> <input type="number" bind:value="{newResource.traveler_numer}"></td>

                <td><strong>Acción:</strong><Button color="primary" on:click={insertResource}>Añadir</Button> </td>
            
            </tr>
    </table>
    {/await}
    {#if outputMsg}
        <p style="color: green">{outputMsg}</p>
    {/if}
</main>