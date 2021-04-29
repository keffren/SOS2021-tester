<!--Los nombres de los ficheros svelte SIEMPRE empiezan en mayúscula porque sino no te los lee el desgraciado de svelte-->
<script>
    import{
        onMount
    }from "svelte";

    let r_culturaBASE = []

    async function getCulturaBASEResource(){
        console.log("--CulturaBASEAPI: \n Estamos buscando los recursos pertinentes");
        const res = await fetch("api/v1/culturaBASE");

        if(res.ok){
            console.log("--CulturaBASEAPI: \n Éxito");
            const json = await res.json();
            r_culturaBASE = json;
            console.log(`--CulturaBASEAPI: \n Hemos recibido ${r_culturaBASE} `);
        }else{
            console.log("--CulturaBASEAPI: \n Error buscando los recursos");
        }
    }

    onMount(getCulturaBASEResource);
</script>

<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>

<main>
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
            {#each r_culturaBASE as r_cb}
                <tr>
                    <!--Estamos haciendo la llamada a los atributos de cultura base y los estamos ordenando por filas-->
                    <td>{r_cb.district}</td>
                    <td>{r_cb.year}</td>
                    <td>{r_cb.fundraising}</td>
                    <td>{r_cb.spectator}</td>
                    <td>{r_cb.spending_per_view}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>

