var express = require("express");

var app = express();

var port = (process.env.PORT|| 10000);  //Tanto local como para heroku

var path = require("path");

<<<<<<< HEAD
app.use("/",express.static(path.join(__dirname + "/public")));
=======
app.use("/",express.static(path.join(__dirname + "public")));
>>>>>>> 7b807d307d85231cc9a6590d4baf982739e38396

app.get("/info/culturaBASE", (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
<style>
table, th, td {
    border: 1px solid black;
}
</style>
</head>
<body>

<h3> <a href=" http://estadisticas.mecd.gob.es/CulturaDynPx/culturabase/index.htm?type=pcaxis&path=/t20/p20/a2005/&file=pcaxis#"> Enlace de referencia </a>
</h3>

<table>
    <colgroup>
    <col style="background-color:#f2f2f2">
    </colgroup>
    <tr>
    <th>districts</th>
    <th>years</th>
    <th>fundraising</th>
    <th>spectators</th>
    <th>spending_per_view</th>
    </tr>
    <tr>
    <td>Andalucia</td>
    <td>2019</td>
    <td>88.3</td>
    <td>16.4</td>
    <td>5.4</td>
    </tr>
    <tr>
    <td>Andalucia</td>
    <td>2018</td>
    <td>82.0</td>
    <td>15.1</td>
    <td>5.4</td>
    </tr>

    <tr>
    <td>Madrid</td>
    <td>2019</td>
    <td>134.3</td>
    <td>20.7</td>
    <td>6.5</td>
    </tr>

    <tr>
    <td>Madrid</td>
    <td>2018</td>
    <td>127.8</td>
    <td>19.3</td>
    <td>6.6</td>
    </tr>

    <tr>
    <td>Ceuta y Melilla</td>
    <td>2019</td>
    <td>0.6</td>
    <td>0.1</td>
    <td>5.1</td>
    </tr>
</table>

</body>
</html>`);
});

app.get("/info/air_routes", (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
<style>
table, th, td {
border: 1px solid black;
}
</style>
</head>
<body>

<h3> <a href=" https://www.fomento.gob.es/BE/?nivel=2&orden=03000000"> Enlace de referencia </a>
</h3>

<table>
<colgroup>
<col style="background-color:#f2f2f2">
</colgroup>
<tr>
<th>districts</th>
<th>years</th>
<th>flights</th>
<th>passengers</th>
<th>total_goods(kg)</th>
</tr>
<tr>
<td>Madrid</td>
<td>2020</td>
<td>158405</td>
<td>17071089</td>
<td>401133380</td>
</tr>
<tr>
<td>Cataluña</td>
<td>2017</td>
<td>320456</td>
<td>47262688</td>
<td>156105304</td>
</tr>

<tr>
<td>Andalucía</td>
<td>2020</td>
<td>78777</td>
<td>7441585</td>
<td>10561907</td>
</tr>

<tr>
<td>Andalucía</td>
<td>2019</td>
<td>194370</td>
<td>27332163</td>
<td>12971632</td>
</tr>

<tr>
<td>Madrid</td>
<td>2019</td>
<td>417958</td>
<td>61703370</td>
<td>558566726</td>
</tr>
</table>

</body>
</html>`);
});


app.get("/info/hostelry", (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
<head>
<style>
table, th, td {
    border: 1px solid black;
}
</style>
</head>
<body>

<h3> <a href=" https://www.ine.es/jaxiT3/Tabla.htm?t=2066&L=0"> Enlace de referencia </a>
</h3>

<table>
    <colgroup>
    <col style="background-color:#f2f2f2">
    </colgroup>
    <tr>
    <th>districts</th>
    <th>years</th>
    <th>employee_staff</th>
    <th>establishments_open </th>
    <th>travelers_number</th>
    </tr>
    <tr>
    <td>Andalucia</td>
    <td>2020</td>
    <td>182,681</td>
    <td>17,140</td>
    <td>6,841,779</td>
    </tr>
    <tr>
    <td>Andalucia</td>
    <td>2019</td>
    <td>435,130</td>
    <td>29,557</td>
    <td>19,869,536</td>
    </tr>

    <tr>
    <td>Catalonia</td>
    <td>2020</td>
    <td>147,190</td>
    <td>14,751</td>
    <td>5,787,656</td>
    </tr>

    <tr>
    <td>Catalonia</td>
    <td>2019</td>
    <td>418,558</td>
    <td>27,722</td>
    <td>20,752,391</td>
    </tr>

    <tr>
    <td>Catalonia</td>
    <td>2018</td>
    <td>400,203</td>
    <td>27,213</td>
    <td>20,045,332</td>
    </tr>
</table>

</body>
</html>`);
});

//Arrancar server
app.listen(port, () => {
    console.log("Dentro callback- Server ready on port " +port);
});
