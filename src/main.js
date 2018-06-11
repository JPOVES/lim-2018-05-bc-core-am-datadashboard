function loadUsersData(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../data/cohorts/lim-2018-03-pre-core-pw/users.json", true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var users = JSON.parse(xhr.responseText);
            loadProgressData(users);
        }
    };
}
loadUsersData();
function loadProgressData(users){
    const xhr_progress = new XMLHttpRequest();
    xhr_progress.open("GET", "../data/cohorts/lim-2018-03-pre-core-pw/progress.json", true);
    xhr_progress.send();
    xhr_progress.onreadystatechange = function(){
        if (xhr_progress.readyState == 4 && xhr_progress.status == 200) {
            var progress = JSON.parse(xhr_progress.responseText);
            computeUsersStats(users, progress, courses = null)
        }
    } 
}
function computeUsersStats(users, progress, courses = null){
    console.log(progress);
    let body = document.getElementById('tbody');
    for(var i = 0; i < users.length; i++){
        if(i < 15){
            body.innerHTML += `
            <tr>
                <td>${users[i].id}</td>
                <td>${users[i].signupCohort}</td>
                <td>${users[i].timezone}</td>
                <td>${users[i].name}</td>
                <td>${users[i].locale}</td>
                <td>${users[i].role}</td>
            </tr>`;
        }
    }
}
