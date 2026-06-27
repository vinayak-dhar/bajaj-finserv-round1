const API_URL = "https://bajaj-finserv-round1-backend.vercel.app/bfhl";

async function submitData() {

    const rawInput = document
        .getElementById("inputData")
        .value
        .trim();

    const loading = document.getElementById("loading");
    const result = document.getElementById("result");

    result.innerHTML = "";

    if (!rawInput) {
        result.innerHTML = `
            <div class="card error">
                Please enter some data.
            </div>
        `;
        return;
    }

    const data = rawInput
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

    try {

        loading.innerText = "Processing...";

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data })
        });

        const json = await response.json();

        loading.innerText = "";

        result.innerHTML = `
            <div class="card">
                <h3>Response</h3>
                <pre>${JSON.stringify(json, null, 2)}</pre>
            </div>
        `;

    } catch (err) {

        loading.innerText = "";

        result.innerHTML = `
            <div class="card error">
                Failed to connect to API.
            </div>
        `;

        console.error(err);
    }
}

function fillExample() {
    document.getElementById("inputData").value =
        "A->B,A->C,B->D,C->E,E->F";
}