window.computeUsersStats = (users, progress, courses) => {
    let usersWithStats = users.map((user) => {
        let intro = progress[user.id].intro;
        if (intro) {
            let orderedUnits = Object.keys(intro.units).sort().map((el, i) => {
                let parts = Object.keys(intro.units[el].parts).sort().map((e, i) => {
                    return intro.units[el].parts[e];
                })
                intro.units[el].parts = parts;
                return intro.units[el];
            })
            //contadores generales para la propiedad stats
            let totalUnits = orderedUnits.length;
            let totalRdsGeneral = 0, totalQuzGeneral = 0, totalExGeneral = 0, completedRdsGeneral = 0, 
                completedQuzGeneral = 0, completedExGeneral = 0, scoreSumGeneral = 0, percentGeneral = 0;
            let obj = orderedUnits.map((e, i) => {
                let parts = e.parts;
                percentGeneral = percentGeneral + e.percent;
                //contadores x unidades para la propiedad statsXcurso
                let reads= {}, quizzes = {}, exercises = {}, statsByCourse = {}
                totalEx = 0, completedEx = 0, percentEx = 0, 
                totalRds = 0, completedRds = 0, percentRds = 0,
                totalQuz = 0, completedQuz = 0, percentQuz = 0;
                statsByCourse.percent = e.percent;
                for (let a = 0; a < parts.length; a++) {
                    let partElement = parts[a];
                    let partElementType = partElement.type;
                    switch (partElementType){
                        case "practice" :
                            if ("exercises" in partElement) {
                                let exercisesArr = Object.values(partElement.exercises);
                                totalExGeneral = totalExGeneral + exercisesArr.length;
                                totalEx = totalEx + exercisesArr.length;
                                for (let i in exercisesArr) {
                                    if(exercisesArr[i].completed == 1){
                                        completedEx++;
                                        completedExGeneral++
                                    }
                                }
                                exercises.total= totalEx;
                                exercises.completed = completedEx;
                                percentEx = (completedEx / totalEx) * 100;
                                exercises.percent = percentEx;
                                statsByCourse.exercises = exercises;
                            }
                            break;
                        case "read":
                            totalRds++;
                            totalRdsGeneral++;
                            if(partElement.completed == 1){
                                completedRds++
                                completedRdsGeneral++
                            }
                            percentRds = (completedRds / totalRds) * 100;
                            reads.total = totalRds;
                            reads.completed = completedRds;
                            reads.percent = percentRds;
                            statsByCourse.reads = reads;
                            break;
                        case "quiz":
                            totalQuz++;
                            totalQuzGeneral++;
                            if (partElement.completed == 1) {
                                completedQuz++;
                                completedQuzGeneral++;
                                scoreSumGeneral = scoreSumGeneral + partElement.score;
                            }
                            percentQuz = (completedQuz / totalQuz) * 100;
                            quizzes.total = totalQuz;
                            quizzes.completed = completedQuz;
                            quizzes.percent = percentQuz;
                            statsByCourse.quizzes = quizzes;
                    }
                }
                return statsByCourse;
            });
            user.statsByCourse = obj;
            user.stats = {
                percent: Math.round(percentGeneral / totalUnits),
                exercises: {
                    total: totalExGeneral,
                    completed: completedExGeneral,
                    percent: Math.round((completedExGeneral / totalExGeneral) * 100)
                },
                quizzes: {
                    total: totalQuzGeneral,
                    completed: completedQuzGeneral,
                    percent: Math.round((completedQuzGeneral / totalQuzGeneral) * 100),
                    scoreSum: scoreSumGeneral,
                    scoreAvg: (scoreSumGeneral == 0 && completedQuzGeneral == 0) ? 0 : Math.round(scoreSumGeneral / completedQuzGeneral)
                },
                reads: {
                    total: totalRdsGeneral,
                    completed: completedRdsGeneral,
                    percent: Math.round((completedRdsGeneral / totalRdsGeneral) * 100)
                }
            }
        } else {
            user.stats = {
                percent: 0, exercises: { total: 0, completed: 0, percent: 0 }, quizzes: {total: 0, completed: 0, percent: 0, scoreSum: 0,
                    scoreAvg: 0 }, reads: { total: 0, completed: 0, percent: 0 }
            }
        }
        return user;
    });
    //console.log(usersWithStats);
    return usersWithStats;

}
window.sortUsers = (users, orderBy = 'name', orderDirection = 'ASC') => {

    const orderByProperty = (property, orderDirection) => {
        let sortOrder = 1;
        if(orderDirection === "DESC"){ sortOrder = -1 }
        
        if(property == "name"){
           return function (a,b) {
            var result = (a["name"] < b["name"]) ? -1 : (a["name"] > b["name"]) ? 1 : 0;
            return result * sortOrder;
           }
        }else if(property == "percent"){
            return function (a,b) {
                var result = (a['stats'].percent < b['stats'].percent) ? -1 : (a['stats'].percent > b['stats'].percent) ? 1 : 0;
                return result * sortOrder;
            }
        }else if(property == "exercises"){
          return function (a,b) {
            var result = (a['stats'].exercises.percent < b['stats'].exercises.percent) ? -1 : (a['stats'].exercises.percent > b['stats'].exercises.percent) ? 1 : 0;
            return result * sortOrder;
           }
        }else if(property == "quizzes"){
            return function (a,b) {
                var result = (a['stats'].quizzes.percent < b['stats'].quizzes.percent) ? -1 : (a['stats'].quizzes.percent > b['stats'].quizzes.percent) ? 1 : 0;
                return result * sortOrder;
            }
        }else if(property == "scoreAvg"){
            return function (a,b) {
                var result = (a['stats'].quizzes.scoreAvg < b['stats'].quizzes.scoreAvg) ? -1 : (a['stats'].quizzes.scoreAvg > b['stats'].quizzes.scoreAvg) ? 1 : 0;
                return result * sortOrder;
            }
        }else if(property == "reads"){
            return function (a,b) {
                var result = (a['stats'].reads.percent < b['stats'].reads.percent) ? -1 : (a['stats'].reads.percent > b['stats'].reads.percent) ? 1 : 0;
                return result * sortOrder;
            }
        }
       
    }
    let usersOrdered = users.sort(orderByProperty(orderBy, orderDirection))
    return usersOrdered;
}

window.filterUsers = (users, search = null) => {
    if(search != null){
        let usersFiltered = users.filter( user => {
            if(user.name.includes(search)){
                return user;
            }
        });
        return usersFiltered;
    }
    return users;
}

window.processCohortData = options => {
    let users = window.computeUsersStats(options.cohortData.users, options.cohortData.progress);
    users = window.sortUsers(users, options.orderBy, options.orderDirection);
    users = window.filterUsers(users, options.search);
    return users;
}