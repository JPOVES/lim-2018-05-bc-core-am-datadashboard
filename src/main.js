                                                                                                                                                                                                                                                                                                                                                                                                                                            function loadCohortsData(sede){
    const data = new XMLHttpRequest();
    data.open("GET", "../data/cohorts.json", true);
    data.send();
    data.onreadystatechange = function() {
        if (data.readyState == 4 && data.status == 200) {
            cohorts = JSON.parse(data.responseText); 
            var generation = document.getElementById('generation');
            generation.innerHTML = `<option value="0">Selecionar</option>`;
            for(var i in cohorts){
                if(cohorts[i].id.search(sede) >= 0){
                    generation.innerHTML += `<option value = "${cohorts[i].id}">${cohorts[i].id}</option>`;
                }
            }
        }
    };
    
}

//TRAE LOS DATOS DE LAS ESTUDIANTES
function loadUsersData() {                                                              
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../data/cohorts/lim-2018-03-pre-core-pw/users.json", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        //SI EL CODIGO STATUS ES 200 (que todo esta ok) CAPTURO LA RESPUESTA EN UNA VARIABLE
        if (xhr.readyState == 4 && xhr.status == 200) {
            users = JSON.parse(xhr.responseText);
        }
    };
}

// TRAE DATOS DE PROGRESO DE CADA ALUMNA
function loadProgressData() {
    const xhr_progress = new XMLHttpRequest();
    xhr_progress.open("GET", "../data/cohorts/lim-2018-03-pre-core-pw/progress.json", true);
    xhr_progress.send();
    xhr_progress.onreadystatechange = function () {
        //SI EL CODIGO STATUS ES 200 (que todo esta ok) CAPTURO LA RESPUESTA EN UNA VARIABLE
        if (xhr_progress.readyState == 4 && xhr_progress.status == 200) {
            //SI HAY UNA RESPUESTA EJECUTO ESTA FUNCION PARA ARMAR LAS UI CON LOS DATOS DE USUARIOS Y PROGRESOS
            //PARSEO LA RESPUESTA, OBTENIENDO UN OBJETO QUE A SU VEZ LO TRANSFORMO EN ARRAY PARA PODER USAR SUS POSICIONES 
            progress = Object.values(JSON.parse(xhr_progress.responseText));
            
        }

    }
}

const usersWithStats =  window.computeUsersStats(window.users, window.progress);

// MUESTRA DATOS DE USUARIOS Y PROGRESO EN LA INTERFAZ
function pagination() {
    let total_row = document.getElementById('total_row').value = users.length;
    //MUESTRA LOS PRIMEROS 15 USUARIOS
    //EVENTOS DE PAGINACIÓN
    //DEBERIA IMPRIMIR LOS 15 USUARIOS ANTERIORES
    const prev = document.getElementById('prev').addEventListener('click', function () {

        printData(window.users, window.progress, init, final);
    });
    //DEBERIA IMPRIMIR LOS 15 PRIMEROS USUARIOS
    const first = document.getElementById('first').addEventListener('click', function () {
        printData(window.users, window.progress, 0, 10);
    });
    //IMPRIME SOLO LOS 15 ULTIMOS USUARIOS
    const last = document.getElementById('last').addEventListener('click', function () {
        let final = total_row;
        let init = final - 10;
        printData(window.users, window.progress, init, final);
    });
    //IMPRIME LOS 15 SIGUIENTES USUARIOS
    const next = document.getElementById('next').addEventListener('click', function () {
        // OBTENGO - DESDE DONDE INICIA EL SIGUIENTE BLOQUE
        let current_step = document.getElementById('current_step').value;
        let init = parseInt(current_step);
        let final = init + 10;
        document.getElementById('current_step').value = final;
        printData(window.users, window.progress, init, final);
    });
}
//IMPRIME LOS DATOS EN LA TABLA TOMANDO COMO PARAMETROS UN INTERVALO 
function printData(users, progress, init, final) {
    let body = document.getElementById('tbody');
    body.innerHTML = '';
    let cohortId = document.getElementById("generation").value;
    let courseGeneral = generalCourse(cohortId); 
    
    for (var i = 0; i < users.length; i++) {
        if (i >= init && i < final) {
            if (progress[i].intro) {
                // ME DEVUELVE LA POSICION INFORMACION DE UNITS 
                const introductionStats =  introductionCourse(progress[i].intro.units["01-introduction"].parts)
                const variablesStats = variablesCourse(progress[i].intro.units["02-variables-and-data-types"].parts);

                body.innerHTML += `
                <tr>
                    <td style="display: none;">users[i].id}</td>
                    <td>${users[i].signupCohort}</td>
                    <td style="display: none;">${users[i].timezone}</td>
                    <td>${users[i].name}</td>
                    <td>${courseGeneral["0"].coursesIndex.intro.title}</td>
                    <td>${progress[i].intro.percent}</td>
                    <td>${progress[i].intro.units["01-introduction"].percent}</td>
                    <td>${introductionStats.reads.percent}</td>
                    <td>${introductionStats.quiz.percent}</td>
                    <td>${progress[i].intro.units["02-variables-and-data-types"].percent}</td>
                    <td>${variablesStats.reads.percent}</td>
                    <td>${variablesStats.quiz.percent}</td>
                    <td>${variablesStats.exercise.percent}</td>
                    <td>${progress[i].intro.units["03-ux-design"].percent}</td>
                    <td>---</td>
                    <td>---</td>
                </tr>`;
                
            } else {
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

const generalCourse = (cohortsId) =>{
    const courses = window.cohorts.filter((element) => {
        if(element.id == cohortsId){
            return element;
        }
    });
    return courses;
}
const introductionCourse = (unitsParts) => {
    let objParts = Object.values(unitsParts);
    let totalReads = 0, introReadCompletition = 0 , totalQuiz = 0, introQuizCompletition = 0;
    for(let j in objParts){
        if(objParts[j].type == 'read'){
            introReadCompletition =  introReadCompletition + objParts[j].completed;
            totalReads++;
            
        }else if(objParts[j].type == 'quiz'){
            introQuizCompletition =  introQuizCompletition + objParts[j].completed;
            totalQuiz++;
        }
    }
    let porcentajeReadIntro = (introReadCompletition / totalReads) * 100 ;
    let porcentajeQuizIntro = (introQuizCompletition / totalQuiz) * 100;
    return {
        reads:{
            totalReads: totalReads,
            readsCompleted: introReadCompletition,
            percent: porcentajeReadIntro
        },
        quiz: {
            totalQuiz : totalQuiz,
            quizCompleted: introQuizCompletition,
            percent: porcentajeQuizIntro
        }
    } 
}

const variablesCourse = (unitsParts) =>{
    let objParts = Object.values(unitsParts);
    let totalReads = 0, variablesReadCompletition = 0 , totalQuiz = 0, variablesQuizCompletition = 0, 
        varExercisesCompletition = 0;
    for(let j in objParts){
        if(objParts[j].type == 'read'){
            variablesReadCompletition =  variablesReadCompletition + objParts[j].completed;
            totalReads++;
        }else if(objParts[j].type == 'quiz'){
            variablesQuizCompletition =  variablesQuizCompletition + objParts[j].completed;
            totalQuiz++;
        }else if(objParts[j].type == 'practice'){
            objParts[j].exercises ? varExercisesCompletition = varExercisesCompletition + objParts[j].completed : false;
        }
    }
    let porcentajeReadVar = (variablesReadCompletition / totalReads) * 100 ;
    let porcentajeQuizVar = (variablesQuizCompletition / totalQuiz) * 100;
    let porcentajeExercisesVar = (varExercisesCompletition) * 100;

    return {
        reads:{
            totalReads: totalReads,
            readsCompleted: variablesReadCompletition,
            percent: porcentajeReadVar
        },
        quiz: {
            totalQuiz : totalQuiz,
            quizCompleted: variablesQuizCompletition,
            percent: porcentajeQuizVar
        },
        exercise:{
            exerciseCompleted: varExercisesCompletition,
            percent: porcentajeExercisesVar
        }
    }
}


// Enlazando ambos select
document.getElementById("sedes").addEventListener("change", function(e){
    sede = event.target.value;
    if(sede !== "0"){
        loadCohortsData(sede);
    }else{
        alert("seleccione una sede");
    }
});

document.getElementById("generation").addEventListener("change", function(e){
    generation = event.target.value;
    if(generation !== "0"){
        if(generation === 'lim-2018-03-pre-core-pw'){
            loadUsersData();
            loadProgressData()
            
            setTimeout(function(){
                printData(window.users, window.progress, 0, 10)
                pagination();
            }, 1000)
        }else{
            alert("esta sede no tiene informacion");
        }
    }else{
        alert("seleccione una sede");
    }
    
});

// deberioa unirse