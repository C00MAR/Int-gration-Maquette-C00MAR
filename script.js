var inputdate = document.getElementById("date_input")
inputdate.setAttribute("max", new Date().toLocaleDateString('fr-ca'))

var canvas = document.getElementById('crypto_chart').getContext('2d');

var labelsSelectDate = []

var labelsHours = [];

var labelsDays = [];

function LabelsDays() {
    var minDate = new Date();
    var minDatemodif = new Date(minDate);
    minDatemodif.setDate(minDatemodif.getDate()-9);
    for (let i = 0; i < 10; i++) {
        if (minDatemodif.getDate()+i > 9) {
            labelsDays.push("2023-02-"+(minDatemodif.getDate()+i))
        }
        else {
            labelsDays.push("2023-02-0"+(minDatemodif.getDate()+i))
        }
    }
}

LabelsDays()

var labels3Days = [];

function Labels3Days() {
    var currentDate = new Date();
    
    for (var i = 0; i < 10; i++) {
        labels3Days.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() - 3);
    }

    return labels3Days.reverse();
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}

Labels3Days()

var labelsWeek = [];

var labelsMonths = [];



var chartData = {
    labels: labelsDays,
    datasets: [{
        label: 'Bitcoin',
        data: [],
        fill: true,
        borderColor: '#FF8E04',
        tension: 0.25
    }
    , {
        label: 'Ethereum',
        data: [800, 1200, 900, 1000, 700, 600, 800, 1200, 900, 1150, 750],
        borderColor: '#000000',
        fill: true,
        tension: 0.25
    }
    ]
}

var chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'day'
            },
            min: labelsDays[0],
            max: new Date(),
            grid: {
                display: false
            },
            ticks: {
                stepSize: 1
            }
        },
        y: {
            grid: {
                display: false
            }
        }
    }
};

function DataUpdate(date) {
    chartData.datasets[0].data = [];
    fetch('https://api.coingecko.com/api/v3/coins/bitcoin/history?date='+date)
        .then(response => response.json())
        .then(data => {
            const prices = data.market_data.current_price.eur

            chartData.datasets[0].data.push(prices);

            chart.data = chartData;
            chart.update();
        })
        .catch(error => console.error(error));
    }


function DayPerDay() {
    chartData.labels = labelsDays
    chartOptions.scales.x.min = labelsDays[0];
    chartOptions.scales.x.ticks.stepSize = 1;
    document.getElementById("Hour").classList.remove("active");
    document.getElementById("DayThird").classList.remove("active");
    document.getElementById("Week").classList.remove("active");
    document.getElementById("Month").classList.remove("active");
    document.getElementById("valid_calendar").classList.remove("active");
    document.getElementById("Day").classList.add("active");
    for (var i = 0; i < 10; i++) {
        const parts = labelsDays[i].split('-');
        const date2 = parts.reverse().join('-');
        DataUpdate(date2)
    }
    console.log(chartData.datasets[0].data)
    chart.update();
}

function DayThirdDay() {
    chartData.labels = labels3Days
    chartOptions.scales.x.min = labels3Days[0];
    chartOptions.scales.x.ticks.stepSize = 3;
    document.getElementById("Hour").classList.remove("active");
    document.getElementById("Day").classList.remove("active");
    document.getElementById("Week").classList.remove("active");
    document.getElementById("Month").classList.remove("active");
    document.getElementById("valid_calendar").classList.remove("active");
    document.getElementById("DayThird").classList.add("active");
    for (var i = 0; i < 10; i++) {
        const parts = labels3Days[i].split('-');
        const date2 = parts.reverse().join('-');
        DataUpdate(date2)
    }
    console.log(chartData.datasets[0].data)
    chart.update();
}

function SearchDate(){
    chartData.labels = labelsSelectDate
    chartOptions.scales.x.ticks.stepSize = 1;
    document.getElementById("Hour").classList.remove("active");
    document.getElementById("DayThird").classList.remove("active");
    document.getElementById("Week").classList.remove("active");
    document.getElementById("Month").classList.remove("active");
    document.getElementById("Day").classList.add("active");
    const parts = document.getElementById("date_input").value.split('-');
    const date2 = parts.reverse().join('-');
    chartOptions.scales.x.min = date2;
    chartOptions.scales.x.max = date2;
    labelsSelectDate.push(document.getElementById("date_input").value)
    DataUpdate(date2)
    console.log(chartData)
    chart.update();
}

function SelectDate() {
    var divinput = document.getElementById("date");
    divinput.classList.toggle("dateshow")
}

var chart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: chartOptions
});

document.getElementById("Day").addEventListener("click", DayPerDay);
document.getElementById("DayThird").addEventListener("click", DayThirdDay);
document.getElementById("calendar").addEventListener("click", SelectDate);
document.getElementById("valid_calendar").addEventListener("click", SearchDate);
