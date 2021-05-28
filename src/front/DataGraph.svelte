<script type="text/javascript">
    
    async function loadGraph2() {
        let CBData = [];
        let HostelryData =[];

        let CB_Res_Data = [];
        let Hostelry_Res_Data = [];
        let xAxis_years = [];


        const res_CB_Data = await fetch("/api/v2/culturaBASE");
        CBData = await res_CB_Data.json();

        const res_HostelryData = await fetch("/api/v2/hostelries");
        HostelryData = await res_HostelryData.json();


        for(var i = 2017; i <= 2020; i++){
            let espectadores = 0.0;
            let turistas = 0;

            CBData.forEach((x) => {
                if(x.year == i){
                    espectadores += parseInt(x.spectator*1000000);
                }
            })

            HostelryData.forEach((x) => {
                if(x.year == i){
                    turistas += parseInt(x.traveler_numer);
                }
            })

            xAxis_years.push(i);
            CB_Res_Data.push(espectadores);
            Hostelry_Res_Data.push(turistas);
        }


       
        
        /*
        HostelryData.forEach((x) => {
            DataGraph_H.push({name: x.district + " " + x.year, data: [parseInt(x.employee_staff),  parseInt(x.traveler_numer),parseInt(x.establishment_open)], pointPlacement: 'on'})
        });
        */

        /*
        //Estructura: [ {"name" : "Andalucia 2019", "data" : [CB.capos,.., Hostelry.campos ],...}]
        CBData.forEach( (x) => {
            HostelryData.forEach( (y) => {
                if(x.district == y.district && x.year == y.year){
                    DataGraph.push({name: x.district + " " + x.year, 
                                    data: [parseInt(x.fundraising), parseInt(x.spectator), parseInt(x.spending_per_view),
                                        ,parseInt(y.employee_staff),  parseInt(y.traveler_numer),parseInt(y.establishment_open)]
                                    , pointPlacement: 'on'})

                }else if(x.district == y.district && x.year != y.year){

                }else{

                }

            })
        })
        */

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Cultura Base'
            },

            subtitle: {
            text: 'Representación del número de espectadores,en el sector de la Industria Cinematica, y turistas, en el sector de la Hostelería, de España desde 2017 hasta 2020 según las comunidades autónomas.'
            },
            
            xAxis: {
                categories: Array.from(xAxis_years).sort()
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: 'Espectadores (CulturaBase)',
                    data: CB_Res_Data
                },
                {
                    name: 'Turistas (Hostelería)',
                    data: Hostelry_Res_Data
                }
            ]
        });
    }

</script>


<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <!--<script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}" ></script>-->
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph2}" ></script>

</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>

    </figure>
    
    <button type="button" class="btn btn-secondary" onclick="window.location.href='#'" style="width: 100%; margin-bottom: 5%;"> Volver a database</button><br>
</main>