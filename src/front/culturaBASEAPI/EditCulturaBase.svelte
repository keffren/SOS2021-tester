<script>
    import{
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";

    //import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    export let params = {};
    let culturaBASE = {};
    let updatedDistrict = "";
    let updatedYear = "";
    let updatedFundraising = 0.0;
    let updatedSpectator = 0.0;
    let updatedSpendingPerView = 0.0;

    let successMessage = "";

    onMount(getCulturaBase);

    async function getCulturaBase(){
        console.log("Fetching Cultura...");
        const res = await fetch("/api/v2/culturaBASE/"+ params.district);

        //const res = await fetch("/api/v1/culturaBASE/"+ params.district + "/" + params.year);

        if(res.ok){
            console.log("Okey: ");
            const json = await res.json();
            culturaBASE = json;
            //Suponemos que a tanto district como year le llegan directamente los parametros de busqueda porque son clave
            updatedDistrict = params.district;
            updatedYear = params.year;
            //Dado que los demás atributos no son de busqueda creamos el cultura como objeto json para invocarlos
            //El parseFloat como hicimos anteriormente para que se lea correctamente el formato json los datos que le metemos
            updatedFundraising = parseFloat(culturaBASE.fundraising);
            updatedSpectator = parseFloat(culturaBASE.spectator);
            updatedSpendingPerView = parseFloat(culturaBASE.spending_per_view);
            console.log("Hemos recibido los datos de culturaBASE");


            
        }else if(res.status == 404){
            window.alert("El dato "+params.district + " " + params.year + " no existe");
        }
    }

    async function updateCulturaBase() {
		
        console.log("Actualizando el cine..." + JSON.stringify(params.district));
		//const res = await fetch("/api/v1/culturaBASE/" + params.district + "/" + params.year
        const res = await fetch("/api/v2/culturaBASE/" + params.district + "/" +params.year, {
            method: "PUT",
            body: JSON.stringify({
                district: params.district,
                year: params.year,
                fundraising: updatedFundraising,
				spectator: updatedSpectator,
				spending_per_view: updatedSpendingPerView
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getCulturaBase();
			if(res.ok){	
				successMessage = res.status + ": " + res.statusText + ". Dato actualizado con éxito, somos unos máquinas chavalada";
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
    <h2 style="text-align:center;">Editar info: <strong> {params.district}<!--{params.year}--></strong></h2>
    {#await culturaBASE}
        Loading data...
    {:then culturaBASE} 
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Comunidad</th>
                    <th>Año</th>
                    <th>Recaudación total (contada por millones)</th>
                    <th>Espectadores (contados por millones)</th>
                    <th>Gasto por espectador(contado por millones)</th>
                </tr>
            </thead>
            <tbody>
                
                    <tr>
                        <!--Estamos haciendo la llamada a los atributos de cultura base y los estamos ordenando por filas-->
                        <td>{updatedDistrict}</td>
                        <td>{updatedYear}</td>
                        <td><input type="number" bind:value={updatedFundraising}></td>
                        <td><input type="number" bind:value={updatedSpectator}></td>
                        <td><input type="number" bind:value={updatedSpendingPerView}></td>
                        <td> <Button outline  color="success" on:click={updateCulturaBase}>Actualizar</Button></td>
                    </tr>
              
            </tbody>
        </table>
    {/await}
    {#if successMessage}
        <p style="color: green">{successMessage}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Volver</Button>
</main>