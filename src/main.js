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

function tableDetailGeneral(usersWithStats, init, final){
    const tbody = document.getElementById("tbody_detail_general");
    let body = ``;
    usersWithStats.forEach( (element, i) => {
        if(element.role == 'student'){
            if (i >= init && i < final) {
                body += `<tr>
                            <td>${element.name}</td>
                            <td>${element.stats.reads.total}</td>
                            <td>${element.stats.reads.completed}</td>
                            <td>${element.stats.reads.percent}</td>
                            <td>${element.stats.quizzes.total}</td>
                            <td>${element.stats.quizzes.completed}</td>
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

function tableMain(usersWithStats, init, final){
    const tbody = document.getElementById("table_main_body");
    let body = ``;
    usersWithStats.forEach( (element, i) => {
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

function infoDetalledByCourse(usersWithStats, init, final){
    const tbody = document.getElementById("tableInfoXCurso_tbody");
    let body = ``;
    /*usersWithStats.forEach((element, i) =>{
        if(element.role == 'student'){ 
            if (i >= init && i < final) {
                body += `<tr>
                            <td>${element.name}</td>
                            <td>${progress[i].intro.percent}</td>
                            <td>${progress[i].intro.units["01-introduction"].percent}</td>
                            <td>${introductionStats.reads.percent}</td>
                            <td>${introductionStats.quiz.percent}</td>
                            <td>${progress[i].intro.units["02-variables-and-data-types"].percent}</td>
                            <td>${variablesStats.reads.percent}</td>
                            <td>${variablesStats.quiz.percent}</td>
                            <td>${variablesStats.exercise.percent}</td>
                            <td>${progress[i].intro.units["03-ux-design"].percent}</td>
                            <td>${uxStats.reads.percent}</td>
                            <td>${uxStats.quiz.percent}</td>
                        </tr>`;
            }
        }
    });*/
} 
// MUESTRA DATOS DE USUARIOS Y PROGRESO EN LA INTERFAZ
function pagination(table) {
    let total_row = document.getElementById('total_row').value = users.length;
    document.getElementById('current_step').value = 10;
    //MUESTRA LOS PRIMEROS 15 USUARIOS
    //EVENTOS DE PAGINACIÓN
    //DEBERIA IMPRIMIR LOS 15 USUARIOS ANTERIORES
    const prev = document.getElementById('prev').addEventListener('click', function () {
        if(table == 'tableMain'){
            tableMain(window.usersWithStats, init, final)
        }else if(table == "tableDetailGeneral"){
            tableDetailGeneral(window.usersWithStats, init, final);
        }else{
            printData(window.users, window.progress, init, final);
        }
    });
    //DEBERIA IMPRIMIR LOS 15 PRIMEROS USUARIOS
    const first = document.getElementById('first').addEventListener('click', function () {
        if(table == 'tableMain'){
            tableMain(window.usersWithStats, init, final)
        }else if(table == "tableDetailGeneral"){
            tableDetailGeneral(window.usersWithStats, init, final);
        }else{
            printData(window.users, window.progress, 0, 10);
        }
    });
    //IMPRIME SOLO LOS 15 ULTIMOS USUARIOS
    const last = document.getElementById('last').addEventListener('click', function () {
        let final = total_row;
        let init = final - 10;
        if(table == 'tableMain'){
            tableMain(usersWithStats, init, final)
        }else if(table == "tableDetailGeneral"){
            tableDetailGeneral(window.usersWithStats, init, final);
        }else{
            printData(window.users, window.progress, init, final);
        }
    });
    //IMPRIME LOS 15 SIGUIENTES USUARIOS
    const next = document.getElementById('next').addEventListener('click', function () {
        // OBTENGO - DESDE DONDE INICIA EL SIGUIENTE BLOQUE
        let current_step = document.getElementById('current_step').value;
        let init = parseInt(current_step);
        let final = init + 10;
        document.getElementById('current_step').value = final;
        if(table == 'tableMain'){
            tableMain(window.usersWithStats, init, final)
        }else if(table == "tableDetailGeneral"){
            tableDetailGeneral(window.usersWithStats, init, final);
        }else{
            printData(window.users, window.progress, init, final);
        }
    });
}

const loadCoursesData = (cohortsId) => {
    const selectCourses = document.getElementById("courses");
    const courses = window.cohorts.filter((element) => {
        if (element.id == cohortsId) {
            return element;
        }
    });
    selectCourses.innerHTML = `<option value="0">Select</option>`;
    selectCourses.innerHTML += `<option value="${courses["0"].coursesIndex.intro.title}">${courses["0"].coursesIndex.intro.title}</option>`;
}


// Enlazando ambos select
document.getElementById("locals").addEventListener("change", function (event) {
    sede = event.target.value;
    if(sede !== "0"){
        loadCohortsData(sede);
    } else{
        alert("seleccione una sede");
    }
});

var tableMainElement = document.getElementById('table_main'),
    tableDetailGeneralElement = document.getElementById('table_detail_general'),
    tableInfoXCursoElement = document.getElementById("tableInfoXCurso"),
    paginationElement = document.getElementById('pagination'),
    filterBtn = document.getElementById("filterBtn");

    infoTotalBtn = document.getElementById("infoTotalBtn");
    infoGeneralBtn = document.getElementById("infoGeneralBtn");
    infoXcursoBtn = document.getElementById("infoXcursoBtn");

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

document.getElementById("courses").addEventListener("change", event => {
    const course = event.target.value;
    if(course != "0"){
        if(course ===  "Introducción a la programación (con JavaScript)"){
                usersWithStats = window.computeUsersStats(window.users, window.progress);
                tableMain(window.usersWithStats, 0, 10);
                pagination('tableMain');
                tableMainElement.style.display = "block";
                paginationElement.style.display = "block";
                filterBtn.style.display = "block";
        }
    }else {
        alert("seleccione un curso");
    }
});

document.getElementById("infoTotalBtn").addEventListener("click", e => {

    tableDetailGeneralElement.style.display = "none";
    tableInfoXCursoElement.style.display = "none";
    tableMainElement.style.display = "block";

    infoTotalBtn.style.display = "none";
    infoXcursoBtn.style.display = "block";
    infoGeneralBtn.style.display = "block";
    
});

document.getElementById("infoGeneralBtn").addEventListener("click", e => {
    tableMainElement.style.display = "none";
    tableInfoXCursoElement.style.display = "none";
    
    tableDetailGeneral(window.usersWithStats, 0, 10);
    pagination("tableDetailGeneral");
    tableDetailGeneralElement.style.display = "block";
    
    infoGeneralBtn.style.display = "none";
    infoTotalBtn.style.display = "block";
    infoXcursoBtn.style.display = "block";
});
    
document.getElementById("infoXcursoBtn").addEventListener("click", e => {   
    tableMainElement.style.display = "none";
    tableDetailGeneralElement.style.display = "none";
    tableInfoXCursoElement.style.display = "block";

    infoXcursoBtn.style.display = "none";
    infoGeneralBtn.style.display = "block";
    infoTotalBtn.style.display = "block";
});

