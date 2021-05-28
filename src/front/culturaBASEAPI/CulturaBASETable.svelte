<!--Los nombres de los ficheros svelte SIEMPRE empiezan en mayúscula porque sino no te los lee el desgraciado de svelte-->
<script>
    import{
        onMount
    }from "svelte";

    //import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    //nueva importacion para agrupacion de formulario
    
    import FormGroup from "sveltestrap/src/Button.svelte";
    import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
	import Input from "sveltestrap/src/Input.svelte";
    
    var BASE_CULTURABASE_API_PATH = "/api/v2/culturaBASE";
    let r_culturaBASE = []
    let newCB = {district: "",
    year: "",
    fundraising: "",
    spectator: "",
    spending_per_view: ""
    }
    let exitoMsg = "";
    //let errorMsg = "";

    //variables de paginacion

    let numeroRecursos = 10;//recursos que tenemos por página, y que a su vez son los datos iniciales
    let offset = 0;
    let currentPage = 1;
    let plusData = true;


    //Inicializamos variables de busqueda

    let campo1 = "";
    let campo2 = "";
    let valor1 = "";
    let valor2 = "";

    async function getCulturaBASEResource(){
        console.log("Buscando recursos de culturaBASE...")

        const res = await fetch(BASE_CULTURABASE_API_PATH+ "?offset="+ numeroRecursos * offset + "&limit=" + numeroRecursos);
        const resNext = await fetch(BASE_CULTURABASE_API_PATH+ "?offset="+ numeroRecursos * (offset+1) + "&limit=" + numeroRecursos);

        if(res.ok && resNext.ok){
            console.log("Todo okey");
            //pasamos los valores de busqueda y los parametros a formato json
            //como res y resNext son constantes que están sujetas a busqueda se hace así la transformacion con wl await
            const json = await res.json();//res.json() es a raíz de la transformcion de una const en otra de tipo json
            const jsonNext = await resNext.json();
            r_culturaBASE = json;

            //condicionante para ver si hemos llegado al ultimo valor de los recursos iniciales o no
            if(jsonNext.length == 0){
                plusData = false;
            }else{
                plusData = true;
            }
            console.log("Hemos recibido " + r_culturaBASE.length + " datos de culturaBASE");
        }else{
            console.log("ERROR");
        }

    }

    //funcion para el incremento del offset con un parametro valor que le pasamos nosotros
    function incrementOffset(valor){
        offset += valor;
        currentPage += valor;
        getCulturaBASEResource();
    }



    /*async function getCulturaBASEResource(){
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
    }*/

    async function insertCulturaBASE() {
	  
        console.log("Inserting new data..." + JSON.stringify(newCB));
        newCB.year = newCB.year.toString();
 
        const res = await fetch(BASE_CULTURABASE_API_PATH, {
            method: "POST",
            body: JSON.stringify(newCB),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getCulturaBASEResource();
            if(res.ok){
                exitoMsg = res.status + ": " + res.statusText + ". Dato insertado con exito";
            }else if(res.status==400){
                window.alert("Los campos no están rellenos");
                exitoMsg = res.status + ": " + res.statusText + ". No has metido los campos bien";
            }else if (res.status==409){
                window.alert("El recurso ya existe");
                exitoMsg = res.status + ": " + res.statusText + ". El recurso ya existe";
            }
        });
    }

    async function deleteCultura(district, year) {
        const res = await fetch(BASE_CULTURABASE_API_PATH + "/"+  district +"/" + year, {
            method: "DELETE"
        }).then(function (res)  {
            getCulturaBASEResource();
			exitoMsg = res.status + ": " + res.statusText + ". Dato eliminado con éxito";
        });
    }   
    
	async function deleteAllCultura() {
        const res = await fetch(BASE_CULTURABASE_API_PATH, {
            method: "DELETE"
        }).then(function (res) {
            getCulturaBASEResource();
			exitoMsg = res.status + ": " + res.statusText + ". Datos eliminados con éxito";
        });
    }
	async function loadInitialData() {
        const res = await fetch(BASE_CULTURABASE_API_PATH + "/loadInitialData", {
            method: "GET"
        }).then(function (res) {
            getCulturaBASEResource();
			exitoMsg = res.status + ": " + res.statusText + ". Datos reiniciados con éxito";
        });
    }

    //Para la funcion de busqueda tenemos que meterle los valores que queramos en la función para buscarlos
    async function search(campo1, valor1, campo2, valor2){
        //damos por sentado que hay que dejar implementado el offset
        offset = 0;
        currentPage = 1;
        //variable booleana para ver si le hemos metido valores de más
        plusData = false;
        //mensaje de exito ya inicializado anteriormente
        exitoMsg = "";
        console.log("Buscando los datos: " + campo1+ " " + valor1+ ", " + campo2 + " "+ valor2);
        //la url de la que vamos a sacar la informacion y con la que vamos a trabajar para añadirle los campos de busqueda
        //ello es como lo que hacemos en el backend con los get de busqueda en node pero añadiéndolos de manera directa
        var url = BASE_CULTURABASE_API_PATH;

        //los condicionantes van a ser que ninguno de los campos esten vacíos, y que si no lo están impriman la url de busqueda
        /*if(campo1 != "" & campo2 != "" & valor1 != "" & valor2 != ""){
            url = url + "?"+ campo1 + "="+ valor1 + "&" + campo2 + "=" + valor2;
        }else if(campo1 != "" & campo2 == "" & valor1 != ""){
            url = url + "?"+ campo1 + "="+ valor1;
        }else if(campo1 != "" & campo2 != "" & valor2 != ""){
            url = url + "?"+ campo2 + "=" + valor2;
        }*/

        if(campo1 != "" && campo2 != "" && valor1 != "" && valor2 != "" && campo2 == "year" && campo1 == "year"){
            url = url + "/?from=" + valor1 +"&to="+ valor2;
        }else if(campo1 != "" & campo2 != "" & valor1 != "" & valor2 != ""){
            url = url + "?"+ campo1 + "="+ valor1 + "&" + campo2 + "=" + valor2;
        }else if(campo1 != "" & valor2 == "" & valor1 != ""){
            url = url + "?"+ campo1 + "="+ valor1;
        }else if(valor1 == "" & campo2 != "" & valor2 != ""){
            url = url + "?"+ campo2 + "=" + valor2;
        }

        //imprimimos en consola el resultado que sale de la url
        console.log(url);

        //se hace la busqueda asincrona de la url a ver si es correcta
        const res = await fetch(url);
        if(res.ok){
            console.log("La busqueda es correcta, el resultado: ");
            const json = await res.json();
            //pasamos el formato de la base de datos a json para trabajar con sus parámetros
            r_culturaBASE = json;
            if(r_culturaBASE.length==0){
                exitoMsg = "404 Not Found";
                window.alert("El recurso que está buscando "+ valor1 + " " + valor2 +  " no existe.");
            } else if(campo1 ==  "" & campo2 == "" || valor1 == "" & valor2 == ""){
                r_culturaBASE = [];
                exitoMsg = "404 Not Found";
                window.alert("El recurso que está buscando "+ valor1 + " " + valor2 + " no existe");
            }else if(r_culturaBASE.length>=10){
                getCulturaBASEResource();
            }else{
                console.log("Hemos encontrado " + r_culturaBASE.length + " datos de culturaBASE");
            //mensaje que le enseñamos al usuario
                exitoMsg = res.status + ": "+ res.statusText + ". Búsqueda realizada con éxito. " + r_culturaBASE.length + " elementos encontrados.";
            }
            
        }else if(res.status == 404){
            r_culturaBASE = [];
            exitoMsg = res.status + ": "+ res.statusText + ". No encontramos parámetros coincidentes ";
        } else{
            //alerta emergente cuando un usuario se equivoca haciendo la busqueda
            window.alert("Error: Te has equivocado a la hora de poner los datos para la búsqueda máquina o no hemos encontrado na, prueba de nuevo");
            //error que aparece en consola
            //errorMsg = res.status + ": "+ res.statusText + ". Busqueda realizada con errores o en el vacío" 
            console.log("ERROR A LA HORA DE HACER LA BUSQUEDA");
        }

        /*const res = await fetch(url,{
            method: "GET",
            body: JSON.stringify({
                district: params.district,
                year: params.year,
                fundraising: params.fundraising,
				spectator: params.spectator,
				spending_per_view: params.spending_per_view
            })
        }).then(function(res){
            getCulturaBASEResource();
            if(res.ok){
                console.log("La busqueda es correcta, el resultado: ");
                const json = res.json();
                //pasamos el formato de la base de datos a json para trabajar con sus parámetros
                r_culturaBASE = json;
                if(r_culturaBASE.length==0){
                exitoMsg = "404 Not Found";
                window.alert("El recurso que está buscando no existe.");
                } else if(campo1 ==  "" & campo2 == "" || valor1 == "" & valor2 == ""){
                    r_culturaBASE = [];
                    exitoMsg = "404 Not Found";
                    window.alert("El recurso que está buscando no existe.");
                }else{
                    console.log("Hemos encontrado " + r_culturaBASE.length + " datos de culturaBASE");
                //mensaje que le enseñamos al usuario
                    exitoMsg = res.status + ": "+ res.statusText + ". Búsqueda realizada con éxito. " + r_culturaBASE.length + " elementos encontrados.";
                }
            }else if(res.status == 404){
                r_culturaBASE = [];
                exitoMsg = res.status + ": "+ res.statusText + ". No encontramos parámetros coincidentes ";
            } else{
                //alerta emergente cuando un usuario se equivoca haciendo la busqueda
                window.alert("Error: Te has equivocado a la hora de poner los datos para la búsqueda máquina o no hemos encontrado na, prueba de nuevo");
                //error que aparece en consola
                //errorMsg = res.status + ": "+ res.statusText + ". Busqueda realizada con errores o en el vacío" 
                console.log("ERROR A LA HORA DE HACER LA BUSQUEDA");
            }
        });*/

        /*const res = await fetch(url+ "&offset="+ numeroRecursos * offset + "&limit=" + numeroRecursos);
        const resNext = await fetch(url+ "&offset="+ numeroRecursos * (offset+1) + "&limit=" + numeroRecursos);

        if(res.ok&&resNext.ok){
            console.log("La busqueda es correcta, el resultado: ");
            const json = await res.json();
            const jsonNext = await resNext.json();
            r_culturaBASE = json;

            if(Object.keys(r_culturaBASE).length == 0){
                plusData = false;
                exitoMsg = "Resultado de la búsqueda: " + " Recurso no encontrado.";
            }else if(Object.keys(r_culturaBASE).length > 0 && Object.keys(r_culturaBASE).length <= 10){
                outputMsg = "";
                console.log("--CBAPI:\n  FrontEnd -> Found: "+ r_culturaBASE.length +" resources");
                exitoMsg = "resultado de la búsqueda: " + r_culturaBASE.length + " recursos encontrados <" + res.status + ": " + res.statusText + ">";
                plusData = false;
            }else{
                plusData = true;
            }
            console.log("Hemos encontrado " + r_culturaBASE.length + " datos de culturaBASE");
            
            exitoMsg = res.status + ": "+ res.statusText + ". Búsqueda realizada con éxito. " + r_culturaBASE.length + " elementos encontrados.";
            
        }else if(res.status == 404){
            r_culturaBASE = [];
            exitoMsg = res.status + ": "+ res.statusText + ". No encontramos parámetros coincidentes ";
        } else{
            window.alert("Error: Te has equivocado a la hora de poner los datos para la búsqueda máquina o no hemos encontrado na, prueba de nuevo");
            console.log("ERROR A LA HORA DE HACER LA BUSQUEDA");
        }*/
        
    }


    onMount(getCulturaBASEResource);
</script>

<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>

<main>
    <div>
        <Button style="align: center;" on:click={getCulturaBASEResource}>Menu principal</Button>
        <button type="button" class="btn btn-secondary" onclick="window.location.href='#/culturaBASE/graph'"> Ir a la gráfica de la industria Cinematográfica </button><br>
        <button type="button" class="btn btn-secondary" onclick="window.location.href='#/info'"> Volver </button><br>
    </div>
    
    
        <table class="table center table-striped">
            <tr>
                <td>
                    <Input  type="select" name="inputCampo" id="inputCampo" bind:value="{campo1}">
                        <option disabled selected></option>
						<option value="district">Comunidad</option>
						<option value="year">Año</option>
						<option value="fundraising">Recaudacion</option>
						<option value="spectator">Espectadores</option>
						<option value="spending_per_view">Gasto por espectador</option>
                    </Input>
                </td>

                <td>
                    <Input type="text"  name="inputValor" id="inputValor" bind:value="{valor1}"></Input>
                
                </td>

            

            
                <td>
                    <Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo2}">
                            <option disabled selected></option>
                            <option value="district">Comunidad</option>
                            <option value="year">Año</option>
                            <option value="fundraising">Recaudacion</option>
                            <option value="spectator">Espectadores</option>
                            <option value="spending_per_view">Gasto por espectador</option>
                    </Input>
                </td>
                <td>
                    <Input type="text"  name="inputValor" id="inputValor" bind:value="{valor2}"></Input>
                    
                </td>
                <td>
                    <Button style="align:center;" color= "primary" on:click="{search(campo1, valor1, campo2, valor2)}" class="button-search"> Búsqueda de elementos</Button>
                </td>
            </tr>
           
        </table>
    
    


    
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="text-align: center;">Comunidad</th>
                <th style="text-align: center;">Año</th>
                <th style="text-align: center;">Recaudación total (contada por millones)</th>
                <th style="text-align: center;">Espectadores (contados por millones)</th>
                <th style="text-align: center;">Gasto por espectador(contado por millones)</th>
                <td><Button outline color = "danger" on:click="{deleteAllCultura}">Eliminarlo todo</Button></td>
            </tr>
        </thead>
        <tbody>
            {#each r_culturaBASE as r_cb}
                <tr>
                    <!--Estamos haciendo la llamada a los atributos de cultura base y los estamos ordenando por filas-->
                    <td style="text-align: center;"><a href="#/culturaBASE/{r_cb.district}/{r_cb.year}">{r_cb.district}</a></td>
                    <!--<td>{r_cb.district}</td>-->
                    <td style="text-align: center;">{r_cb.year}</td>
                    <td style="text-align: center;">{r_cb.fundraising}</td>
                    <td style="text-align: center;">{r_cb.spectator}</td>
                    <td style="text-align: center;">{r_cb.spending_per_view}</td>
                   <td><Button outline color = "danger" on:click="{deleteCultura(r_cb.district, r_cb.year)}">Eliminar</Button></td>
                </tr>
            {/each}
        </tbody>
    </table>
    <h3 style="text-align: center;">Añadimos nuevo dato</h3>
    <table class="table table-striped">
        <tr>
                    
            <td>Provincia: <input bind:value="{newCB.district}"></td>
            <td>Año: <input type="number" bind:value="{newCB.year}"></td>
            <td>Recaudacion: <input type="number"bind:value="{newCB.fundraising}"></td>
            <td>Espectadores: <input type="number"bind:value="{newCB.spectator}"></td>
            <td>Gasto medio por espectador: <input type="number" bind:value="{newCB.spending_per_view}"></td>
            <td> <Button outline color = "success" on:click={insertCulturaBASE}>Añadir la cosa</Button></td>
            <!--<td><button type="button" class="btn btn-outline-primary" function = "onclick:{insertCulturaBASE}"></button></td>-->
        </tr>
    </table>

    <Pagination arialabel="Número de páginas">
        <!-- If we are in the first page-->
        <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
            <PaginationLink previous href="#/culturaBASE" on:click="{() => incrementOffset(-1)}" />
        </PaginationItem>
          
        <!-- If we are not in the first page-->
        {#if currentPage != 1}
        <PaginationItem>
            <PaginationLink href="#/culturaBASE" on:click="{() => incrementOffset(-1)}" >{currentPage - 1}</PaginationLink>
        </PaginationItem>
        {/if}

        <PaginationItem active>
            <PaginationLink href="#/culturaBASE" >{currentPage}</PaginationLink>
        </PaginationItem>
  
        <!-- If there are more elements-->
        {#if plusData}
        <PaginationItem >
            <PaginationLink href="#/culturaBASE" on:click="{() => incrementOffset(1)}">{currentPage + 1}</PaginationLink>
        </PaginationItem>
        {/if}
  
        <PaginationItem class="{plusData ? '' : 'disabled'}">
            <PaginationLink next href="#/culturaBASE" on:click="{() => incrementOffset(1)}"/>
        </PaginationItem>
    </Pagination>
    {#if exitoMsg}
        <p style="color: green">{exitoMsg}</p>
    {/if}


    <Button on:click={loadInitialData}>Añadir los casos base</Button>
</main>

