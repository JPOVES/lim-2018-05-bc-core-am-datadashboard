/********************************************************************************
 * PROYECTO DATADASHBOARD
 * AUTORA: GENESIS NOLE PONCE
 * LABORATORIA 2018
*********************************************************************************
////////////////////////////////////////////////////////////////////////////////
/********************************************************************************
 * FUNCIONES PRINCIPALES:
 * SE ENCARGAN DE TRAER LOS DATOS DE LA DB
 * USERS, PROGRESS Y COHORTS
 * Y AÑADIR LOS DATOS A LOS SELECTS PRINCIPALES
 ********************************************************************************/
function loadCohortsData(sede) {
    const data = new XMLHttpRequest();
    data.open("GET", "../data/cohorts.json", true);
    data.send();
    data.onreadystatechange = function() {
        if (data.readyState == 4 && data.status == 200) {
            cohorts = JSON.parse(data.responseText);
            var generation = document.getElementById('generation');
            generation.innerHTML = `<option value="0">Selecionar</option>`;
            for (var i in cohorts) {
                if (cohorts[i].id.search(sede) >= 0){
                    generation.innerHTML += `<option value = "${cohorts[i].id}">${cohorts[i].id}</option>`;
                }
            }
        }
    };
}

//TRAE LOS DATOS DE LAS ESTUDIANTES
function loadUsersData(cohortId) {                                                              
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `../data/cohorts/${cohortId}/users.json`, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        //SI EL CODIGO STATUS ES 200 (que todo esta ok) CAPTURO LA RESPUESTA EN UNA VARIABLE
        if (xhr.readyState == 4 && xhr.status == 200) {
            users = JSON.parse(xhr.responseText);
        }
    };
}
// TRAE DATOS DE PROGRESO DE CADA ALUMNA
function loadProgressData(cohortId) {
    const xhr_progress = new XMLHttpRequest();
    xhr_progress.open("GET", `../data/cohorts/${cohortId}/progress.json`, true);
    xhr_progress.send();
    xhr_progress.onreadystatechange = function () {
        //SI EL CODIGO STATUS ES 200 (que todo esta ok) CAPTURO LA RESPUESTA EN UNA VARIABLE
        if (xhr_progress.readyState == 4 && xhr_progress.status == 200) {
            //SI HAY UNA RESPUESTA EJECUTO ESTA FUNCION PARA ARMAR LAS UI CON LOS DATOS DE USUARIOS Y PROGRESOS
            //PARSEO LA RESPUESTA, OBTENIENDO UN OBJETO QUE A SU VEZ LO TRANSFORMO EN ARRAY PARA PODER USAR SUS POSICIONES 
            //progress = Object.values(JSON.parse(xhr_progress.responseText));
            progress = JSON.parse(xhr_progress.responseText);
        }
    }
}
const loadCoursesData = (cohortsId) => {
    const selectCourses = document.getElementById("courses");
    const courses = window.cohorts.filter((element) => {
        if (element.id == cohortsId) {
            return element;
        }
    });
    //por ahora lo agrego directamente prque el cohort tiene solo un curso
    selectCourses.innerHTML = `<option value="0">Select</option>`;
    selectCourses.innerHTML += `<option value="${courses["0"].coursesIndex.intro.title}">${courses["0"].coursesIndex.intro.title}</option>`;
}
/********************************************************************************
 * FUNCIONES PRINTTABLES:
 * SE ENCARGAN MOSTRAR LOS DATOS EN LAS RESPECTIVAS TABLAS
 * TABLE PRIMARY, TABLE DETAILS, TABLE DETAILS X CURSO
 *  
 ********************************************************************************/
function tableDetailGeneral(userWithStatsDefault, init, final){
    const tbody = document.getElementById("tbody_detail_general");
    let body = ``;
    userWithStatsDefault.forEach( (element, i) => {
        if(element.role == 'student'){
            if (i >= init && i < final) {
                body += `<tr>
                            <td>${element.name}</td>
                            <td>${element.stats.reads.total}</td>
                            <td>${element.stats.reads.completed}</td>
                            <td>${element.stats.reads.percent}</td>
                            <td>${element.stats.quizzes.total}</td>
                            <td>${element.stats.quizzes.completed}</td>
                            <td>${element.stats.quizzes.scoreAvg}</td>
                            <td>${element.stats.quizzes.percent}</td>
                            <td>${element.stats.exercises.total}</td>
                            <td>${element.stats.exercises.completed}</td>
                            <td>${element.stats.exercises.percent}</td>
                            <td>${element.stats.percent}</td>
                        </tr>`;
            }
        }
    });
    tbody.innerHTML = body;
}

function tableMain(userWithStatsDefault, init, final){
    const tbody = document.getElementById("table_main_body");
    let body = ``;
    userWithStatsDefault.forEach( (element, i) => {
        if(element.role == 'student'){ 
            if (i >= init && i < final) {
                body += `<tr>
                            <td>${element.name}</td>
                            <td>${element.stats.percent}</td>
                </tr>`;
            }
        }
    });
    tbody.innerHTML = body;
}

function infoDetalledByCourse(userWithStatsDefault, init, final){
    const tbody = document.getElementById("tableInfoXCurso_tbody");
    let body = ``;
    userWithStatsDefault.forEach((element, i) =>{
        if(element.role == 'student'){ 
            if (i >= init && i < final) {
                if(element.statsByCourse){ 
                    body += `<tr>
                                <td>${element.name}</td>
                                <td>${element.statsByCourse["0"].reads.total}</td>
                                <td>${element.statsByCourse["0"].reads.completed}</td>
                                <td>${element.statsByCourse["0"].quizzes.total}</td>
                                <td>${element.statsByCourse["0"].quizzes.completed}</td>
                                <td>${element.statsByCourse["0"].percent}</td>

                                <td>${element.statsByCourse["1"].reads.total}</td>
                                <td>${element.statsByCourse["1"].reads.completed}</td>
                                <td>${element.statsByCourse["1"].exercises.total}</td>
                                <td>${element.statsByCourse["1"].exercises.completed}</td>
                                <td>${element.statsByCourse["1"].quizzes.total}</td>
                                <td>${element.statsByCourse["1"].quizzes.completed}</td>
                                <td>${element.statsByCourse["1"].percent}</td>

                                <td>${element.statsByCourse["2"].reads.total}</td>
                                <td>${element.statsByCourse["2"].reads.completed}</td>
                                <td>${element.statsByCourse["2"].quizzes.total}</td>
                                <td>${element.statsByCourse["2"].quizzes.completed}</td>
                                <td>${element.statsByCourse["2"].percent}</td>

                            </tr>`;
                }else{
                    body += `<tr>
                                <td>${element.name}</td>
                                <td colspan="17">NO EXISTE INFORMACION</td>
                            </tr>`;
                }
            }
        }
    });
    tbody.innerHTML = body;
} 

/********************************************************************************
 * PAGINACION Y EVENTOS :
 * SE ENCARGAN DE PAGINAR LA TABLA QUE ESTA ACTIVA EN LA INTERFACE
 * Y CAMBIA EL ESTADO DE LOS BOTONES DEPENDIENDO LA POSICION DE SU RECORRIDO
 *  
 ********************************************************************************/
function pagination(table, users) {
    const usersLength = users.length;
    document.getElementById('total_row').value = usersLength;
    document.getElementById('current_step').value = 10;
    document.getElementById('current_table_paginating').value = table;
    total_row = usersLength;
    //resetiando los bottones
    first.disabled = true;
    first.style.cursor = "not-allowed";
    prev.disabled = true;
    prev.style.cursor = "not-allowed";

    next.disabled = false;
    next.style.cursor = "pointer";
    last.disabled = false;
    last.style.cursor = "pointer";
    
}

const prev = document.getElementById('prev'); 
const first = document.getElementById('first');
const last = document.getElementById('last');
const next = document.getElementById('next');


prev.addEventListener('click', function () {
    let table = document.getElementById('current_table_paginating').value;
    let current_step = parseInt(document.getElementById('current_step').value);
    if(current_step > 10){
        let final = current_step - 10;
        let init = final - 10;
        document.getElementById('current_step').value = final;
        if(table == 'tableMain'){
            tableMain(window.userWithStatsDefault, init, final)
        }else if(table == "tableDetailGeneral"){
            tableDetailGeneral(window.userWithStatsDefault, init, final);
        }else if(table == "tableDetalledByCourse"){
            infoDetalledByCourse(window.userWithStatsDefault, init, final)
        }
        if(final == 10){
            first.disabled = true;
            first.style.cursor = "not-allowed";
            prev.disabled = true;
            prev.style.cursor = "not-allowed";
        }
    }
    next.disabled = false;
    next.style.cursor = "pointer";
    last.disabled = false;
    last.style.cursor = "pointer";

});

first.addEventListener('click', function () {
    let table = document.getElementById('current_table_paginating').value;
    let final = 10;
    let init = 0;
    document.getElementById('current_step').value = final;
    if(table == 'tableMain'){
        tableMain(window.userWithStatsDefault, init, final)
    }else if(table == "tableDetailGeneral"){
        tableDetailGeneral(window.userWithStatsDefault, init, final);
    }else if(table == "tableDetalledByCourse"){
        infoDetalledByCourse(window.userWithStatsDefault, init, final)
    }
    first.disabled = true;
    first.style.cursor = "not-allowed";
    prev.disabled = true;
    prev.style.cursor = "not-allowed";

    next.disabled = false;
    next.style.cursor = "pointer";
    last.disabled = false;
    last.style.cursor = "pointer";

});

last.addEventListener('click', function () {

    let table = document.getElementById('current_table_paginating').value;
    let final = window.total_row;
    let init = final - 10;
    document.getElementById('current_step').value = final;
    if(table == 'tableMain'){
        tableMain(window.userWithStatsDefault, init, final)
    }else if(table == "tableDetailGeneral"){
        tableDetailGeneral(window.userWithStatsDefault, init, final);
    }else if(table == "tableDetalledByCourse"){
        infoDetalledByCourse(window.userWithStatsDefault, init, final)
    }
    next.disabled = true;
    next.style.cursor = "not-allowed";
    last.disabled = true;
    last.style.cursor = "not-allowed";
    first.disabled = false;
    first.style.cursor = "pointer";
    prev.disabled = false;
    prev.style.cursor = "pointer";
});

next.addEventListener('click', function () {
    let table = document.getElementById('current_table_paginating').value;
    let current_step = parseInt(document.getElementById('current_step').value);
    if(current_step <= window.total_row){
        let init = current_step;
        let final = init + 10;
        document.getElementById('current_step').value = final;
        if(table == 'tableMain'){
            tableMain(window.userWithStatsDefault, init, final)
        }else if(table == "tableDetailGeneral"){
            tableDetailGeneral(window.userWithStatsDefault, init, final);
        }else if(table == "tableDetalledByCourse"){
            infoDetalledByCourse(window.userWithStatsDefault, init, final)
        }
        first.disabled = false;
        first.style.cursor = "pointer";
        prev.disabled = false;
        prev.style.cursor = "pointer";
    }
});


/********************************************************************************
 * USO DE SELECTS PARA MOSTRAR LOS DATOS DEL COHORT
 * SE VALIDAD SOLO UN COHORT YA QUE DE LOS DEMAS NO HAY DATOS
 *  
 ********************************************************************************/
document.getElementById("locals").addEventListener("change", function (event) {
    sede = event.target.value;
    if(sede !== "0"){
        loadCohortsData(sede);
    } else{
        alert("seleccione una sede");
    }
});

document.getElementById("generation").addEventListener("change", function(event){
    const generation = event.target.value;
    if(generation !== "0"){
        if(generation === 'lim-2018-03-pre-core-pw'){
            loadUsersData(generation);
            loadProgressData(generation)
            loadCoursesData(generation);
        } else {
            alert("esta sede no tiene informacion");
        }
    } else {
        alert("seleccione una sede");
    } 
});

var tableMainElement = document.getElementById('table_main'),
    tableDetailGeneralElement = document.getElementById('table_detail_general'),
    tableInfoXCursoElement = document.getElementById("tableInfoXCurso"),
    paginationElement = document.getElementById('pagination'),
    filterBtn = document.getElementById("filterBtn"),
    orderContainer = document.getElementById("order_contenedor"),
    infoPrimaryBtn = document.getElementById("infoPrimaryBtn"),
    infoGeneralBtn = document.getElementById("infoGeneralBtn"),
    infoXcursoBtn = document.getElementById("infoXcursoBtn"),
    btnOrdenar = document.getElementById("btn_ordenar"),
    inputSearch = document.getElementById("search");


document.getElementById("courses").addEventListener("change", event => {
    const course = event.target.value;
    if(course != "0"){
        if(course ===  "Introducción a la programación (con JavaScript)"){
                let options ={
                    cohort: window.cohorts,
                    cohortData : {
                        users : window.users,
                        progress : window.progress
                    }
                }
                userWithStatsDefault = window.processCohortData(options);
                tableMain(window.userWithStatsDefault, 0, 10);
                pagination('tableMain', window.userWithStatsDefault);
                tableMainElement.style.display = "inline-block";
                paginationElement.style.display = "block";
                filterBtn.style.display = "block";   
                orderContainer.style.display = "block";            
        }
    }else {
        alert("seleccione un curso");
    }
});


/********************************************************************************
 * EVENTOS PARA CAMBIAR LA TABLA QUE SE MUESTRA:
 * MUESTRA LAS 3DIFERENTES TABLAS Y CAMBIAS LOS ESTILOS PARA LLEVAR
 * A CABO ESTAS ACCIONES
 ********************************************************************************/
document.getElementById("infoPrimaryBtn").addEventListener("click", e => {

    tableMain(window.userWithStatsDefault, 0, 10);
    pagination('tableMain', window.userWithStatsDefault);
    tableDetailGeneralElement.style.display = "none";
    tableInfoXCursoElement.style.display = "none";
    tableMainElement.style.display = "inline-block";

    infoPrimaryBtn.disabled = true;
    infoPrimaryBtn.style.cursor = "not-allowed";

    infoXcursoBtn.disabled= false;
    infoXcursoBtn.style.cursor= "pointer";

    infoGeneralBtn.disabled = false;
    infoGeneralBtn.style.cursor = "pointer";
    
});

document.getElementById("infoGeneralBtn").addEventListener("click", e => {
    
    tableDetailGeneral(window.userWithStatsDefault, 0, 10);
    pagination("tableDetailGeneral", window.userWithStatsDefault);
    tableMainElement.style.display = "none";
    tableInfoXCursoElement.style.display = "none";
    tableDetailGeneralElement.style.display = "inline-block";
    
    infoGeneralBtn.disabled = true;
    infoGeneralBtn.style.cursor = "not-allowed";

    infoPrimaryBtn.disabled = false;
    infoPrimaryBtn.style.cursor = "pointer";

    infoXcursoBtn.disabled= false;
    infoXcursoBtn.style.cursor= "pointer";
});
    
document.getElementById("infoXcursoBtn").addEventListener("click", e => { 
    
    infoDetalledByCourse(window.userWithStatsDefault, 0, 10)
    pagination("tableDetalledByCourse", window.userWithStatsDefault);
    tableMainElement.style.display = "none";
    tableDetailGeneralElement.style.display = "none";
    tableInfoXCursoElement.style.display = "inline-block";

    infoXcursoBtn.disabled= true;
    infoXcursoBtn.style.cursor= "not-allowed";

    infoGeneralBtn.disabled = false;
    infoGeneralBtn.style.cursor = "pointer";

    infoPrimaryBtn.disabled = false;
    infoPrimaryBtn.style.cursor = "pointer";
});


/********************************************************************************
 * EVENTO ORDENAR:
 * ORDENA LA TABLA DE ACUERDO A LOS PARAMETROS QUE SE ELIGA EN LA INTERFACE
 *  
 ********************************************************************************/
btnOrdenar.addEventListener("click", e => {
    let orderBy = document.getElementById("orderby").value;
    let orderDirection = document.getElementById("orderDirection").value;

    userWithStatsDefault = window.sortUsers(window.userWithStatsDefault, orderBy, orderDirection);
    let table = document.getElementById('current_table_paginating').value;
    if(table == 'tableMain'){
        tableMain(window.userWithStatsDefault, 0, 10)
    }else if(table == "tableDetailGeneral"){
        tableDetailGeneral(window.userWithStatsDefault, 0, 10);
    }else if(table == "tableDetalledByCourse"){
        infoDetalledByCourse(window.userWithStatsDefault, 0, 10)
    }
    pagination(table, window.userWithStatsDefault);

});

/********************************************************************************
 * EVENTO FILTRAR
 * FILTRA LOS DATOS DE ACUERDO AL STRING QUE SE INGRESE Y MUESTRA LOS DATOS
 * FILTRADOS, LA BUSQUEDAD ES DINAMICA.
 ********************************************************************************/

inputSearch.addEventListener("keyup", e => {
    let searchString = e.target.value;
    userWithStatsFiltereds = window.filterUsers(window.userWithStatsDefault, searchString);
    let table = document.getElementById('current_table_paginating').value;
    if(table == 'tableMain'){
        tableMain(window.userWithStatsFiltereds, 0, 10)
    }else if(table == "tableDetailGeneral"){
        tableDetailGeneral(window.userWithStatsFiltereds, 0, 10);
    }else if(table == "tableDetalledByCourse"){
        infoDetalledByCourse(window.userWithStatsFiltereds, 0, 10)
    }
});

/********************************************************************************
 * IMPORTANTE!!!!!
 * Para mejor rendimiento la funcion processCohortData solo es procesada una vez,
 * y luego para cada filtrado y criterio de orden se hace uso de las funciones
 * individuales expuestas al objecto window en data.js
 ********************************************************************************/