<script>

    //onMount : Permite lanzar/cargar cuando se cargue el componente
    //          nuestro componente : getHostelryResource()
    import {
        onMount
    }from "svelte";

    import Button from "sveltestrap/src/Button.svelte";
    import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
    import Input from "sveltestrap/src/Input.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

    //https://sveltestrap.js.org/?path=/story/components--table
    //import Table from "sveltestrap/src/Table.svelte";
    //import { Table } from 'sveltestrap/src';
    //import { Table } from 'sveltestrap';

    const BASE_HOSTELRIES_API_PATH = "/api/v2/hostelries";
    let outputMsg = "";
    let outputMsg_E = "";

    let r_hostelries = []

    //PAGINACIÓN & BÚSQUEDA
    //Paginación
    let numRecursos = 10;     //   == limit 
    let offset = 0;
    let currentPage = 1;
    let existsMoreData = true;

    //Búsqueda
    let campo_1 = "";
    let valor_c_1 = "";
    let campo_2 = "";
    let valor_c_2 = "";
    

    //JSOn para insertar nuevo recurso
    let newResource = {
        "district"           :   "",
        "year"               :   "",
        "employee_staff"     :   "",
        "establishment_open" :   "",
        "traveler_numer"     :   ""
    }

    // ¿fetch? => https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch    

    /* GET SIN BÚSQUEDA NI PAGINACIÓN
    async function getHostelryResource(){
        console.log("--HostelriesAPI:\n  FrontEnd -> Getting resource..");
        const res = await fetch(BASE_HOSTELRIES_API_PATH);
        
        if(res.ok){
            console.log("--HostelriesAPI:\n  FrontEnd -> Success");
            const json = await res.json();
            r_hostelries = json;
            console.log(`--HostelriesAPI:\n  FrontEnd -> We have received ${r_hostelries.length} resources `);
        }else{
            console.log("--HostelriesAPI:\n  FrontEnd -> Error");
        }
        
    }
    */

    async function getHostelryResource(){
        console.log("--HostelriesAPI:\n  FrontEnd -> Getting resources..");

        //Impl pag en back-end:        .../conleccion?limit = x & offset= 0

        const res = await fetch(BASE_HOSTELRIES_API_PATH + "?offset=" + offset*numRecursos + "&limit=" + numRecursos);
        const resNext = await fetch(BASE_HOSTELRIES_API_PATH + "?offset=" + (offset+1)*numRecursos + "&limit=" + numRecursos);
        
        if(res.ok && resNext.ok){
            const json = await res.json();
            const jsonNext = await resNext.json();

            r_hostelries = json;

            if(Object.keys(r_hostelries).length == 0){
                existsMoreData = false;
            }else{
                existsMoreData = true;
            }

            console.log(`--HostelriesAPI:\n  FrontEnd -> Hostelry Get obtains: ${Object.keys(r_hostelries).length} resources`);

        }else{
            console.log("--HostelriesAPI:\n  FrontEnd -> GET Error");
        }

        outputMsg_E = "";   //Resetear el mensaje error para que no salga en casos de acierto.
    }

    function incrementOffset(param){
        offset += param;
        currentPage += param;
        getHostelryResource();
    }

    async function searchData(campo_1,valor_c_1,campo_2,valor_c_2){
        offset = 0;
        currentPage = 1;
        //existsMoreData = false;

        var url = BASE_HOSTELRIES_API_PATH;
        var urlAux = "";
        
        console.log("--HostelriesAPI:\n  FrontEnd -> Searching: " + campo_1 + "="+ valor_c_1 + " & " + campo_2 + "=" + valor_c_2);
        console.log("campo1:"+campo_1+ " = "+valor_c_1);
        console.log("campo2:"+campo_2+ " = "+valor_c_2);

        //Impl búsqueda en  back-end : ..../coleccion?campo_1 = xx & campo_2 = yyy

        if(campo_1 != "" && campo_2 != "" && valor_c_1 != "" && valor_c_2 != "" && campo_1 == campo_2 && campo_1 == "year"){
            url += "?from="+valor_c_1+"&to="+valor_c_2;
            urlAux += "&offset=";
        
        }else if(campo_1 == campo_2 && campo_1 != "year" && campo_1 != ""){

            //ERROR FATAL!!! No más casos por favor.
            window.alert("ERROR: No se puede hacer búsqueda de dos campos iguales a no ser que sea temporal!");
			console.log("--HostelriesAPI:\n  FrontEnd ->ERROR de Búsqueda");

        }else if(campo_1 != "" && campo_2 != "" && valor_c_1 != "" && valor_c_2 != ""){
            url += "?"+campo_1+"="+valor_c_1+"&"+campo_2+"="+valor_c_2;
            urlAux += "&offset=";

        }else if(campo_1 == "" && campo_2!="" && valor_c_2!=""){
            url += "?" + campo_2 + "=" + valor_c_2;
            urlAux += "&offset=";

        }else if(campo_1 != "" && valor_c_1 != "" && campo_2 == ""){
            url += "?" + campo_1 + "=" + valor_c_1;
            urlAux += "&offset=";

        }else{
            urlAux += "?offset=";
        }
        
        /*
        console.log("--HostelriesAPI:\n  FrontEnd -> Url search created:\n"+"          "+url);
        
        const res = await fetch(url);
        
        if(res.ok){
            const json = await res.json();
            r_hostelries = json;

            console.log("--HostelriesAPI:\n  FrontEnd -> Found: "+Object.keys(r_hostelries).length +" resources");
            outputMsg = "resultado de la búsqueda: " + Object.keys(r_hostelries).length + " recursos encontrados <" + res.status + ": " + res.statusText + ">";
        }else if(res.status == 404){
            r_hostelries = [];
            console.log("--HostelriesAPI:\n  FrontEnd -> Not found!");
            outputMsg = "Resultado de la búsqueda: " + Object.keys(r_hostelries).length + " recursos encontrados.";
        }
        else{
            window.alert("ERROR: Compruebe que los valores están correctamente para la búsqueda");
            //outputMsg = ("El recurso no existe! <" + res.status + ":"+res.statusText+">");
			console.log("--HostelriesAPI:\n  FrontEnd ->ERROR de Búsqueda");
        } 
        */

        //APLICAR PAGINACIÓN A LA BÚSQUEDA
        console.log("url:         "+url + urlAux + offset*numRecursos + "&limit=" + numRecursos)
        const res = await fetch(url + urlAux + offset*numRecursos + "&limit=" + numRecursos);
        const resNext = await fetch(url + urlAux + (offset+1)*numRecursos + "&limit=" + numRecursos);
        
        if(res.ok && resNext.ok){
            const json = await res.json();
            const jsonNext = await resNext.json();

            r_hostelries = json;

            if(Object.keys(r_hostelries).length == 0){
                outputMsg = "";

                outputMsg_E = "Resultado de la búsqueda con < " + valor_c_1+", "+valor_c_2+ ">: no existe.";
                existsMoreData = false;
            }
            
            else if(Object.keys(r_hostelries).length > 0 && Object.keys(r_hostelries).length <= 10){
                outputMsg = "";
                console.log("--HostelriesAPI:\n  FrontEnd -> Found: "+Object.keys(r_hostelries).length +" resources");
                outputMsg = "Resultado de la búsqueda: " + Object.keys(r_hostelries).length + " recursos encontrados <" + res.status + ": " + res.statusText + ">";
                existsMoreData = false;
            
            }
            
            else{
                existsMoreData = true;
                console.log("--HostelriesAPI:\n  FrontEnd -> Found: "+Object.keys(r_hostelries).length +" resources");
                outputMsg = "Resultado de la búsqueda: " + Object.keys(r_hostelries).length + " recursos encontrados <" + res.status + ": " + res.statusText + ">";
            }

        }else if(res.status == 404){
            r_hostelries = [];
            console.log("--HostelriesAPI:\n  FrontEnd -> Not found!");
            outputMsg_E = "Resultado de la búsqueda: " + " Recurso no encontrado.";
        }
        else{
            window.alert("ERROR: Compruebe que los valores están correctamente para la búsqueda");
            //outputMsg = ("El recurso no existe! <" + res.status + ":"+res.statusText+">");
			console.log("--HostelriesAPI:\n  FrontEnd ->ERROR de Búsqueda");
        }        
    }

    async function loadDB(){

        console.log("--HostelriesAPI:\n  FrontEnd -> Loading Initial Data into DB...");

        const res = await fetch(BASE_HOSTELRIES_API_PATH+"/loadInitialData");

        if(res.ok){
            getHostelryResource();
            outputMsg = "Recursos cargados con éxito <"+ res.status + ": " + res.statusText + ">" ;
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
        newResource.year = newResource.year.toString();     //Mediante input recibimos el year en int para evitar string en ese campo,
                                                            //por ello se le hace un casting a string ya que en json está en String.
        //console.log(newResource);

        const res = await fetch(BASE_HOSTELRIES_API_PATH,
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

                        if(res.ok){
                            outputMsg =  "Recurso insertado con éxito: <" + res.status + ": " + res.statusText + ">";
                        
                        }else if(res.status == 400){
                            //Bad Request
                            window.alert("ERROR: Compruebe que esten correctamente introducidos los campos de búsqueda.");

                        }else if(res.status == 409){
                            //Conflict
                            window.alert("ERROR: El recurso "+ newResource.district+"/"+newResource.year+" ya existe.");
                        }
                    })
    }

    async function deleteResource(district,year){
        console.log("--HostelriesAPI:\n  FrontEnd -> Deleting resource..");

        const res = await fetch(BASE_HOSTELRIES_API_PATH+"/"+district+"/"+year,
                            {
                                method: "DELETE"
                            }
        
                        ).then((res) => {

                            getHostelryResource();
                            outputMsg = "Recurso eliminado con éxito <"+ res.status + ": " + res.statusText + ">" ;

                            //EN caso que fallase sería por un 404 pero al estar en front end no puede succeder.
                        })
    }

    async function deleteAll(){
        const res = await fetch(BASE_HOSTELRIES_API_PATH, {
            method: "DELETE"
        }).then(function (res) {
            getHostelryResource();
			outputMsg = "Recursos eliminados con éxito <"+ res.status + ": " + res.statusText + ">";
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

    <!-- BOTONES -->
    <Button outline color="info" on:click={loadDB}>Cargar recursos</Button>
    <Button outline color="danger" on:click={deleteAll}>Eliminar datos</Button>
    <Button outline color="success" onclick="window.location.href='#/hostelries/graph'">Gráfica Highcharts</Button>
    <!-- https://www.w3schools.com/html/html_tables.asp -->
    <!-- https://sveltestrap.js.org/?path=/story/components--button -->

    <!-- BÚSQUEDA -->

    <table>
        <tr>
            <td>
                <Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo_1}">
                    <option disabled selected></option>
                    <option value="district">Provincia</option>
                    <option value="year">Año</option>
                    <option value="employee_staff">Empleados contrados</option>
                    <option value="establishment_open">Establecimientos abiertos</option>
                    <option value="traveler_numer">Turistas</option>
                </Input>
            </td>
            <td>
                <Input type="text"  name="inputValor" id="inputValor" bind:value="{valor_c_1}"></Input>
            </td>
            <td>
                <Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo_2}">
                    <option disabled selected></option>
                    <option value="district">Provincia</option>
                    <option value="year">Año</option>
                    <option value="employee_staff">Empleados contrados</option>
                    <option value="establishment_open">Establecimientos abiertos</option>
                    <option value="traveler_numer">Turistas</option>
                </Input>
            </td>
            <td>
                <Input type="text"  name="inputValor" id="inputValor" bind:value="{valor_c_2}"></Input>
            </td>
            <td>
                <Button color="primary" on:click={searchData(campo_1,valor_c_1,campo_2,valor_c_2)}>Buscar</Button>
            </td>
        </tr>
    </table>
    
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
                        <!--<a href="#/hostelries/{r.district}/{r.year}">{r.district}</a>-->
                        {r.district}
                    </td>
                    <td>{r.year}</td>
                    <td>{r.employee_staff}</td>
                    <td>{r.establishment_open}</td>
                    <td>{r.traveler_numer}</td>
                    <td>
                        <Button outline color="danger" on:click="{deleteResource(r.district,r.year)}">Eliminar</Button>
                        <a href="#/hostelries/{r.district}/{r.year}">
                            <Button outline color="info">Editar</Button>
                        </a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <!-- INSERT TABLE-->
    <table>
        <h3> Añadir nuevo recurso:</h3>
            <tr>
                <td><strong>Provincia:</strong> <input bind:value="{newResource.district}"></td>
                <td><strong>Año:</strong> <input type="number" bind:value="{newResource.year}"></td>
                <td><strong>Personal contratado:</strong> <input type="number" bind:value="{newResource.employee_staff}"></td>
                <td><strong>Establecimientos abiertos:</strong> <input type="number" bind:value="{newResource.establishment_open}"></td>
                <td><strong>Turistas:</strong> <input type="number" bind:value="{newResource.traveler_numer}"></td>

                <td><Button color="primary" on:click={insertResource}>Añadir</Button> </td>
                               
            </tr>
    </table>
    

    <!-- PAGINATION -->
    <!-- https://sveltestrap.js.org/?path=/story/components--pagination -->

    <Pagination arialabel="Número de páginas">
        <!-- If we are in the first page-->
        <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
            <PaginationLink previous href="#/hostelries" on:click="{() => incrementOffset(-1)}" />
        </PaginationItem>
          
        <!-- If we are not in the first page-->
        {#if currentPage != 1}
        <PaginationItem>
            <PaginationLink href="#/hostelries" on:click="{() => incrementOffset(-1)}" >{currentPage - 1}</PaginationLink>
        </PaginationItem>
        {/if}

        <PaginationItem active>
            <PaginationLink href="#/hostelries" >{currentPage}</PaginationLink>
        </PaginationItem>
  
        <!-- If there are more elements-->
        {#if existsMoreData}
        <PaginationItem >
            <PaginationLink href="#/hostelries" on:click="{() => incrementOffset(1)}">{currentPage + 1}</PaginationLink>
        </PaginationItem>
        {/if}
  
        <PaginationItem class="{existsMoreData ? '' : 'disabled'}">
            <PaginationLink next href="#/hostelries" on:click="{() => incrementOffset(1)}"/>
        </PaginationItem>
    </Pagination>
    
    {/await}
    {#if outputMsg}
        <p style="color: green">{outputMsg}</p>
    {/if}
    {#if outputMsg_E}
        <p style="color: red">{outputMsg_E}</p>
    {/if}

</main>