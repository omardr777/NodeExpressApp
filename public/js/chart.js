const userId = document.getElementById('userId').value;
var select = document.getElementById('types');
let days = [];
let requests = new Array(31);
var type = 'bar';
for (let i = 1; i < 32; i++) {
    days.push(i)
    requests[i - 1] = 0;
}
let dateObj = new Date();
let title;
async function getData1() {
    const response = await fetch(location.protocol + '//' + location.host + "/user/chart-data");
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
            if (i.dateId.day.split('-')[1] == (dateObj.getMonth() + 1)) {
                let index = i.dateId.day.split('-')[2];
                requests[index - 1] += 1;
            }
        }
        title = "Your Accepted requests for this month (" + (dateObj.getMonth() + 1) + ")";
    }
}


drawChart(type);
async function drawChart(type) {
    await getData1(days)
    var data = {
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