var inputdate = document.getElementById("date_input")
inputdate.setAttribute("max", new Date().toLocaleDateString('fr-ca'))

var canvas = document.getElementById('crypto_chart').getContext('2d');
var TransacBtn = document.getElementById('transac_btn');
var currency = "bitcoin";
var graph = 0
var labelsSelectDate = [];
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
        data: [],
        borderColor: '#000000',
        fill: true,
        tension: 0.25
    }]
};

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

function DataUpdate(date, graph = 0, currency = 'bitcoin') {
    chartData.datasets[graph].data = [];
    fetch('https://api.coingecko.com/api/v3/coins/' + currency + '/history?date=' + date)
        .then(response => response.json())
        .then(data => {
            const prices = data.market_data.current_price.eur;

            chartData.datasets[graph].data.push(prices);

            chart.data = chartData;
            chart.update();
        })
        .catch(error => console.error(error));
}


function DayPerDay() {
    chartData.labels = labelsDays;
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
    DataUpdate(date2, 0, currency)
    console.log(chartData.datasets[0].data)
}

function SelectDate() {
    var divinput = document.getElementById("date");
    divinput.classList.toggle("dateshow")
}

function SelectCurrencyOne() {
    var Input_Currency_One = document.getElementById("currency_one");
    currency = Input_Currency_One.value
    if (document.getElementById("DayThird").classList == "active") {
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
            DataUpdate(date2, 0, currency)
        }
        console.log(chartData.datasets[graph].data)
    }    
    else {
        chartData.labels = labelsDays;
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
            DataUpdate(date2, 0, currency)
        }
        console.log(chartData.datasets[0].data)
    }
}

function SelectCurrencyTwo() {
    var Input_Currency_Two = document.getElementById("currency_two");
    currency = Input_Currency_Two.value
    if (document.getElementById("DayThird").classList == "active") {
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
            DataUpdate(date2, 1, currency)
        }
        console.log(chartData.datasets[1].data)
    }    
    else {
        chartData.labels = labelsDays;
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
            DataUpdate(date2, 1, currency)
        }
        console.log(chartData.datasets[1].data)
    }
}

var chart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: chartOptions
});

function BuildChart() {
    chart.update();
}

function BurgerShow() {
    var burgermenu = document.getElementById("burger_menu");
    var burgerlog = document.getElementById("burger_logout");
    burgermenu.classList.toggle("burgerActive")
    burgerlog.classList.toggle("logActive")
}

function TransacShow() {
    var burgermenu = document.getElementById("burger_menu");
    var burgerlog = document.getElementById("burger_logout");
    burgermenu.classList.remove("burgerActive")
    burgerlog.classList.remove("logActive")
    TransacBtn.classList.toggle("activeTransac");
    document.querySelector('.mid').classList.toggle("blur");
    document.querySelector('.profil_box').classList.toggle("transacShow");
    document.querySelector('.assets_box').classList.toggle("transacShow");
    document.querySelector('.recent_box').classList.toggle("transacShow");
    document.querySelector('.right').classList.toggle("show_transac")
    if (TransacBtn.classList == "transac") {
        document.getElementById("burger_btn").style.display="block";
    }
    if (TransacBtn.classList == "transac activeTransac") {
        document.getElementById("burger_btn").style.display="none";
    }
}

document.getElementById("Day").addEventListener("click", DayPerDay);
document.getElementById("DayThird").addEventListener("click", DayThirdDay);
document.getElementById("calendar").addEventListener("click", SelectDate);
document.getElementById("valid_calendar").addEventListener("click", SearchDate);
document.getElementById("currency_choice_one").addEventListener("click", SelectCurrencyOne);
document.getElementById("currency_choice_two").addEventListener("click", SelectCurrencyTwo);
document.getElementById("burger_btn").addEventListener("click", BurgerShow);
