let chart;

// 🏆 Top NASDAQ stocks (approx top 50 popular)
const stockList = [
    { name: "Apple", symbol: "AAPL" },
    { name: "Microsoft", symbol: "MSFT" },
    { name: "Amazon", symbol: "AMZN" },
    { name: "Google (Alphabet)", symbol: "GOOGL" },
    { name: "Meta", symbol: "META" },
    { name: "Tesla", symbol: "TSLA" },
    { name: "Nvidia", symbol: "NVDA" },
    { name: "Netflix", symbol: "NFLX" },
    { name: "Adobe", symbol: "ADBE" },
    { name: "Intel", symbol: "INTC" },
    { name: "AMD", symbol: "AMD" },
    { name: "Cisco", symbol: "CSCO" },
    { name: "PepsiCo", symbol: "PEP" },
    { name: "Costco", symbol: "COST" },
    { name: "Broadcom", symbol: "AVGO" },
    { name: "Qualcomm", symbol: "QCOM" },
    { name: "Texas Instruments", symbol: "TXN" },
    { name: "Starbucks", symbol: "SBUX" },
    { name: "Intuit", symbol: "INTU" },
    { name: "AMD", symbol: "AMD" },
    { name: "Booking Holdings", symbol: "BKNG" },
    { name: "PayPal", symbol: "PYPL" },
    { name: "Zoom", symbol: "ZM" },
    { name: "DocuSign", symbol: "DOCU" },
    { name: "eBay", symbol: "EBAY" },
    { name: "Micron", symbol: "MU" },
    { name: "Applied Materials", symbol: "AMAT" },
    { name: "KLA Corp", symbol: "KLAC" },
    { name: "ASML", symbol: "ASML" },
    { name: "Marvell", symbol: "MRVL" }
];

// 🔍 Autocomplete
function showSuggestions() {
    const input = document.getElementById("stock").value.toLowerCase();
    const box = document.getElementById("suggestions");

    box.innerHTML = "";

    if (!input) return;

    const filtered = stockList.filter(s =>
        s.name.toLowerCase().includes(input)
    );

    filtered.forEach(s => {
        const div = document.createElement("div");
        div.innerText = `${s.name} (${s.symbol})`;

        div.onclick = () => {
            document.getElementById("stock").value = s.symbol;
            box.innerHTML = "";
        };

        box.appendChild(div);
    });
}

// 📊 Fetch data
async function getStock() {
    let input = document.getElementById("stock").value.trim();

    document.getElementById("price").innerText = "Loading...";
    document.getElementById("change").innerText = "";
    document.getElementById("change7").innerText = "";

    const found = stockList.find(s =>
        s.name.toLowerCase() === input.toLowerCase() ||
        s.symbol.toLowerCase() === input.toLowerCase()
    );

    let stock = found ? found.symbol : input.toUpperCase();

    const apiKey = "1SELENH3JLSHU1H4";

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data["Time Series (Daily)"]) {
            document.getElementById("price").innerText = "API limit / Invalid stock!";
            return;
        }

        const timeSeries = data["Time Series (Daily)"];

        const dates = Object.keys(timeSeries).slice(0, 7).reverse();
        const prices = dates.map(d => parseFloat(timeSeries[d]["4. close"]));

        const current = prices[6];
        const yesterday = prices[5];
        const old = prices[0];

        // 🔢 Calculations
        const change1 = current - yesterday;
        const percent1 = ((change1 / yesterday) * 100).toFixed(2);

        const change7 = current - old;
        const percent7 = ((change7 / old) * 100).toFixed(2);

        // 🟢🔴 Color logic
        const color1 = change1 >= 0 ? "lime" : "red";
        const color7 = change7 >= 0 ? "lime" : "red";

        // 📊 Display
        document.getElementById("price").innerText =
            `${stock} Price: $ ${current}`;

        document.getElementById("change").innerHTML =
            `1-Day: <span style="color:${color1}">
            ${change1.toFixed(2)} (${percent1}%)
            </span>`;

        document.getElementById("change7").innerHTML =
            `7-Day: <span style="color:${color7}">
            ${change7.toFixed(2)} (${percent7}%)
            </span>`;

        // 🎨 Random gradient background
        const gradients = [
            "linear-gradient(135deg, #1f4037, #99f2c8)",
            "linear-gradient(135deg, #000428, #004e92)",
            "linear-gradient(135deg, #42275a, #734b6d)",
            "linear-gradient(135deg, #141e30, #243b55)",
            "linear-gradient(135deg, #0f2027, #2c5364)"
        ];

        document.body.style.background =
            gradients[Math.floor(Math.random() * gradients.length)];

        // 📈 Chart
        if (chart) chart.destroy();

        const ctx = document.getElementById("chart").getContext("2d");

        chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [{
            label: stock,
            data: prices,
            borderColor: color7,
            borderWidth: 2,
            tension: 0.3
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false   //
            }
        }
    }
});

    } catch (err) {
        document.getElementById("price").innerText = "Error fetching data!";
    }
}