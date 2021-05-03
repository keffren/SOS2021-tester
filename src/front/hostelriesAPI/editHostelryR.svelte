<script>

    //IMPORTS

    import {
        onMount
    }from "svelte";

    import {
        pop
    }from "svelte-spa-router";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const BASE_HOSTELRIES_API_PATH = "/api/v1/hostelries";
    let successMessage = "";

    //VALUES to update
    export let params = {};
    let resource = {};

    let u_district = "";
    let u_year = "";
    let u_employee_staff = 0;
    let u_establishment_open = 0;
    let u_traveler_numer = 0;

    onMount(getHostelryResource);

    async function getHostelryResource(){
        console.log("--HostelriesAPI:\n  FrontEnd -> Getting resource..");
        const res = await fetch(BASE_HOSTELRIES_API_PATH + "/" + params.district + "/"+ params.year);
        
        if(res.ok){
            console.log("--HostelriesAPI:\n  FrontEnd -> Success");
            const json = await res.json();
            resource = json;
            u_district = params.district;
            u_year = params.year;
            u_employee_staff = resource.employee_staff;
            u_establishment_open = resource.establishment_open;
            u_traveler_numer = resource.traveler_numer;

            console.log(`--HostelriesAPI:\n  FrontEnd -> Resource received `);
        }else{
            console.log("--HostelriesAPI:\n  FrontEnd -> Error");
        }   
    }

    async function updateResource(){
        console.log("--HostelriesAPI:\n  FrontEnd -> Updating this resource <" + JSON.stringify(params.district)+"> ...");

        const res = await fetch(BASE_HOSTELRIES_API_PATH + "/" + params.district + "/"+ params.year,
            {
                method: "PUT",
                body: JSON.stringify({
                    district : params.district,
                    year: params.year,
                    employee_staff: u_employee_staff,
                    establishment_open: u_establishment_open,
                    traveler_numer: u_traveler_numer
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getHostelryResource();
            
            if(res.ok){	
				successMessage = res.status + ": " + res.statusText + ". Dato actualizado con éxito";
				console.log("OK!" + successMessage);
			}else if(res.status == 400){
				window.alert("Los datos que se intentan insertar no son válidos");
			}

        }); 
    }
</script>

<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>

<main>
    <h2>Editar info: <strong> {params.district}<!--{params.year}--></strong></h2>
    {#await resource}
        Loading data...
    {:then resource} 
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
                <tr>
                    <td>{u_district}</td>
                    <td>{u_year}</td>
                    <td><input type="number" bind:value={u_employee_staff}></td>
                    <td><input type="number" bind:value={u_establishment_open}></td>
                    <td><input type="number" bind:value={u_traveler_numer}></td>
                    <td> <Button outline  color="success" on:click={updateResource}>Actualizar</Button></td>
                </tr>
                
            </tbody>
        </table>

    {/await}
    {#if successMessage}
        <p style="color: green">{successMessage}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Volver</Button>
</main>




