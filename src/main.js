//TRAE LOS DATOS DE LAS ESTUDIANTES
function loadUsersData(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../data/cohorts/lim-2018-03-pre-core-pw/users.json", true);
    xhr.send();
    xhr.onreadystatechange = function() {
        //SI EL CODIGO STATUS ES 200 (que todo esta ok) CAPTURO LA RESPUESTA EN UNA VARIABLE
        if (xhr.readyState == 4 && xhr.status == 200) {
            var users = JSON.parse(xhr.responseText);
            //SI HAY UNA RESPUESTA EJECUTO ESTA FUNCION PARA TRAER LOS PROGRESOS Y LE PASO COMO PARAMETRO
            //LOS DATOS DE USUARIO PARA LUEGO CONSUMIRLO EN OTRA FUNCION
            loadProgressData(users);
        }
    };
}
//EJECUTO FUNCION-CARGA DE USUARIOS
loadUsersData();
// TRAE DATOS DE PROGRESO DE CADA ALUMNA
function loadProgressData(users){
    const xhr_progress = new XMLHttpRequest();
    xhr_progress.open("GET", "../data/cohorts/lim-2018-03-pre-core-pw/progress.json", true);
    xhr_progress.send();
    xhr_progress.onreadystatechange = function(){
        //SI EL CODIGO STATUS ES 200 (que todo esta ok) CAPTURO LA RESPUESTA EN UNA VARIABLE
        if (xhr_progress.readyState == 4 && xhr_progress.status == 200) {
            //SI HAY UNA RESPUESTA EJECUTO ESTA FUNCION PARA ARMAR LAS UI CON LOS DATOS DE USUARIOS Y PROGRESOS
            //PARSEO LA RESPUESTA, OBTENIENDO UN OBJETO QUE A SU VEZ LO TRANSFORMO EN ARRAY PARA PODER USAR SUS POSICIONES 
           console.log(JSON.parse(xhr_progress.responseText));
            var progress = Object.values(JSON.parse(xhr_progress.responseText));
            computeUsersStats(users, progress, courses = null)
        }
    } 
}
// MUESTRA DATOS DE USUARIOS Y PROGRESO EN LA INTERFAZ
function computeUsersStats(users, progress, courses = null){
    console.log(users);  
    console.log(progress);
    let body = document.getElementById('tbody');
    for(var i = 0; i < users.length; i++){ 
        if(i < 15){
            body.innerHTML += `
            <tr>
                <td style="display: none;">${users[i].id}</td>
                <td>${users[i].signupCohort}</td>
                <td style="display: none;">${users[i].timezone}</td>
                <td>${users[i].name}</td>
                <td>${progress[i].intro.percent}</td>
                <td>-${progress[i].intro.units}<br>
                  
                </td>
            </tr>`;
        }
    }
}
