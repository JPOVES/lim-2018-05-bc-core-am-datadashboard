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
            var progress = Object.values(JSON.parse(xhr_progress.responseText));
            computeUsersStats(users, progress, courses = null)
        }
    } 
}
// MUESTRA DATOS DE USUARIOS Y PROGRESO EN LA INTERFAZ
function computeUsersStats(users, progress, courses = null){
    let total_row = document.getElementById('total_row').value = users.length;
    //MUESTRA LOS PRIMEROS 15 USUARIOS
    printData(users, progress, 0 , 15)
    //EVENTOS DE PAGINACIÓN
    //DEBERIA IMPRIMIR LOS 15 USUARIOS ANTERIORES
    const prev = document.getElementById('prev').addEventListener('click', function(){

    });
    //DEBERIA IMPRIMIR LOS 15 PRIMEROS USUARIOS
    const first = document.getElementById('first').addEventListener('click', function(){
        
        printData(users, progress, 0, 15);
        
    });
    //IMPRIME SOLO LOS 15 ULTIMOS USUARIOS
    const last = document.getElementById('last').addEventListener('click', function(){
        let final = total_row;
        let init = final -15;
        printData(users, progress, init, final);
    });
    //IMPRIME LOS 15 SIGUIENTES USUARIOS
    const next = document.getElementById('next').addEventListener('click', function(){
        // OBTENGO - DESDE DONDE INICIA EL SIGUIENTE BLOQUE
        let current_step = document.getElementById('current_step').value;
        let init = parseInt(current_step);
        let final = init + 15;
        document.getElementById('current_step').value = final;
        printData(users, progress, init , final);
    });   
}
//IMPRIME LOS DATOS EN LA TABLA TOMANDO COMO PARAMETROS UN INTERVALO 
function printData(users, progress, init , final){
    let body = document.getElementById('tbody');
    body.innerHTML = '';
    for(var i = 0; i < users.length; i++){ 
        if(i>= init && i < final){
            if (progress[i].intro){
                body.innerHTML += `
                <tr>
                    <td style="display: none;">users[i].id}</td>
                    <td>${users[i].signupCohort}</td>
                    <td style="display: none;">${users[i].timezone}</td>
                    <td>${users[i].name}</td>
                    <td>${progress[i].intro.percent}</td>
                    <td>---</td>
                </tr>`;
            }else{
                body.innerHTML += `
                <tr>
                    <td style="display: none;">users[i].id}</td>
                    <td>${users[i].signupCohort}</td>
                    <td style="display: none;">${users[i].timezone}</td>
                    <td>${users[i].name}</td>
                    <td>-----</td>
                    <td>------</td>
                </tr>`;
            }
        }
    }
}


