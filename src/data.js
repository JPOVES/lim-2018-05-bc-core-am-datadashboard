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

            var totalRdsGeneral = 0, totalQuzGeneral = 0, totalExGeneral = 0
            completedRdsGeneral = 0, completedQuzGeneral = 0, completedExGeneral = 0,
                scoreSumGeneral = 0, percentGeneral = 0;
            let obj = orderedUnits.map((e, i) => {
                let parts = e.parts;
                percentGeneral = percentGeneral + e.percent;
                for (let a = 0; a < parts.length; a++) {
                    let partElement = parts[a];
                    let partElementType = partElement.type;
                    switch (partElementType){
                        case "practice" :
                            if ("exercises" in partElement) {
                                let exercisesArr = Object.values(partElement.exercises);
                                totalExGeneral = totalExGeneral + exercisesArr.length;
                                for (let i in exercisesArr) {
                                    if (exercisesArr[i].completed == 1) {
                                        completedExGeneral++;
                                    }
                                }
                            }
                            break;
                        case "read":
                            totalRdsGeneral++;
                            partElement.completed == 1 ?  completedRdsGeneral++ : false ;
                            break;
                        case "quiz":
                            totalQuzGeneral++;
                            if (partElement.completed == 1) {
                                completedQuzGeneral++;
                                scoreSumGeneral = scoreSumGeneral + partElement.score;
                            }
                    }
                }
            });
            user.stats = {
                percent: Math.round(percentGeneral / 3),
                exercises: {
                    total: totalExGeneral,
                    completed: completedExGeneral,
                    percent: Math.round((completedExGeneral / totalQuzGeneral) * 100)
                },
                quizzes: {
                    total: totalQuzGeneral,
                    completed: completedQuzGeneral,
                    percent: Math.round((completedQuzGeneral / totalQuzGeneral) * 100),
                    scoreSum: scoreSumGeneral,
                    scoreAvg: Math.round(scoreSumGeneral / completedQuzGeneral)
                },
                reads: {
                    total: totalRdsGeneral,
                    completed: completedRdsGeneral,
                    percent: Math.round((completedRdsGeneral / totalRdsGeneral) * 100)
                }
            }
        } else {
            user.stats = {
                percent: 0, exercises: { total: 0, completed: 0, percent: 0 }, quizzes: {
                    total: 0, completed: 0, percent: 0, scoreSum: 0,
                    scoreAvg: 0
                }, reads: { total: 0, completed: 0, percent: 0 }
            }
        }
        return user;
    });
    //console.log(usersWithStats);
    return usersWithStats;

}