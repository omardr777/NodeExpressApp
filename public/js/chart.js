
const userId = document.getElementById('userId').value;
var select = document.getElementById('types');
let days = [];
let requests = new Array(31);
console.log("Logged Output ~ file: chart.js ~ line 5 ~ requests", requests)
var type = 'bar';
// select.addEventListener('change', () => {
//     type = select.options[select.selectedIndex].value;
// // })
// function myFunction() {
//     type = document.getElementById("types").value;
//     // document.getElementById("demo").innerHTML = "You selected: " + x;
//     console.log(type)
//     chart.destroy();
//     drawChart(type);

// }
for (let i = 1; i < 32; i++) {
    days.push(i)
    requests[i - 1] = 0;
}
console.log(requests)
// test();
// console.log('test')


// getData1();as
let dateObj = new Date();
let title;
async function getData1() {
    const response = await fetch('http://localhost:3000/user/chart-data');
    const data = await response.json();
    if (data.driver == false) {
        title = "Accepted requests for this month (" + (dateObj.getMonth() + 1) + ")";
        for (let i of data.test) {
            // console.log((dateObj.getMonth() + 1) + "==?" + i.dateId.day.split('-')[2])
            if (i.dateId.day.split('-')[1] == (dateObj.getMonth() + 1)) {
                let index = i.dateId.day.split('-')[2];
                requests[index - 1] += 1;
            }
        }
    }
    else {
        for (let i of data.test) {
            // console.log((dateObj.getMonth() + 1) + "==?" + i.dateId.day.split('-')[2])
            // console.log(i.dateId.day)
            if (i.dateId.day.split('-')[1] == (dateObj.getMonth() + 1)) {
                let index = i.dateId.day.split('-')[2];
                requests[index - 1] += 1;
            }
        }
        title = "Your Accepted requests for this month (" + (dateObj.getMonth() + 1) + ")";
    }

    //days = data.split('-')[1];

    console.log(response)
    console.log(days)
    console.log(data.test)
}


drawChart(type);
async function drawChart(type) {
    await getData1(days)
    var data = {
        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: days,
        datasets: [{
            label: title,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            pointStyle: "line",
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: requests
        }]
    };

    var options = {
        pointStyle: 'rectRounded',
        maintainAspectRatio: false,
        scales: {
            y: {
                stacked: true,
                grid: {
                    display: true,
                    color: "rgba(255,99,132,0.2)",

                },
                ticks: {
                    callback: function (value, index, values) {
                        return value
                    }
                },
                min: 0,
                max: 6
            },
            x: {
                grid: {
                    display: false
                }
            },

        }
    };

    new Chart('chart', {
        type: type,
        options: options,
        data: data
    });


}