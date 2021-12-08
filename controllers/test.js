DateO.findOne({ day: day, userId: '61658bf028f15d21675ec0b7' })
    .then(date => {
        datef = date;
        //there is old date ( new date)
        if (!date) {
            return DateO.create({
                day: day,
                userId: '61658bf028f15d21675ec0b7'
            })
                .then(nDate => {

                    if (typeof (ftime) !== 'string') {
                        for (let i of times) {
                            i.dateId = nDate._id;
                        }
                    } else {
                        times[0].dateId = nDate._id;
                    }

                    TimeO.insertMany(times)
                        .then(timesArr => {
                            timesId = timesArr.map(i => {
                                return i._id;
                            })
                            nDate.times = timesId;
                            return nDate.save();
                        })
                        .then(result => console.log(result));
                })

        } else {
            if (typeof (ftime) !== 'string') {
                for (let i of times) {
                    i.dateId = date._id;
                }
            } else {
                times[0].dateId = date._id;
            }
            TimeO.insertMany(times)
                .then(timesArr => {
                    timesId = timesArr.map(i => {
                        return i._id;
                    })
                    for (let id of timesId) {
                        date.times.push(id);
                    }
                    return date.save()
                })
        }
    })
    .then(daten => {
        nDate = daten
        console.log("Logged Output ~ file: drivers.js ~ line 125 ~ nDate", nDate)

        return User.findById('61658bf028f15d21675ec0b7')


    })
    .then(user => {
        user.dates.push(nDate._id)
        user.save();
    })
    .then(result => {
        res.redirect("/drivers/schedule")
    })
    .catch(err => console.log(err))




let times = ['12:00-13:00', '13:01-14:00', '14:01-15:00']
let ftimes = ['12:05']
let ttimes = ['13:10']

let timesN = [720, 780, 781, 840, 841, 900]
let f = [725, 645]
let t = [790, 705]

// let j = 0;

let temp
for (let i = 0; i < f.length; i++) {
    for (let j = 0; j < timesN.length; j++) {
        if (f[i] >= timesN[j] && f[i] <= timesN[j + 1]) {

        } else {
            let temp = timesN.sort();
            if (t[i] < temp[0]) {

            }
        }
    }
}

for (let i = 0; i < timesN.length; i++) {
    if (f[j] >= timesN[i] && f[j] <= timesN[i + 1]) {
        //false

    } else {

    }
}
