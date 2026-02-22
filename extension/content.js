console.log("🔥 Micro Mentor loaded");

let mentorButton = null;
let mentorBubble = null;
let lastSelectionText = "";

document.addEventListener("mouseup", (e) => {
    if (mentorButton && mentorButton.contains(e.target)) return;

    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (!text) {
        removeButton();
        lastSelectionText = "";
        return;
    }

    if (text === lastSelectionText) return;
    lastSelectionText = text;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    removeButton();

    mentorButton = document.createElement("div");
    mentorButton.textContent = "🧠";

    mentorButton.style.position = "absolute";
    mentorButton.style.left = rect.right + window.scrollX + "px";
    mentorButton.style.top = rect.bottom + window.scrollY + "px";
    mentorButton.style.background = "black";
    mentorButton.style.color = "white";
    mentorButton.style.padding = "6px";
    mentorButton.style.borderRadius = "50%";
    mentorButton.style.cursor = "pointer";
    mentorButton.style.zIndex = "2147483647";
    mentorButton.style.userSelect = "none";

    mentorButton.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    mentorButton.addEventListener("mouseup", (e) => {
        e.stopPropagation();
    });

    mentorButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        showMentorBubble("Thinking…");

        fetch("http://localhost:8000/mentor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: lastSelectionText })
        })
            .then(res => res.json())
            .then(data => {
                updateBubble(data.question);
            })
            .catch(() => {
                updateBubble("Mentor is temporarily unavailable.");
            });
    });

    document.body.appendChild(mentorButton);
});

function removeButton() {
    if (mentorButton) {
        mentorButton.remove();
        mentorButton = null;
    }
}

function showMentorBubble(text) {
    if (mentorBubble) mentorBubble.remove();

    mentorBubble = document.createElement("div");
    mentorBubble.textContent = text;

    mentorBubble.style.position = "absolute";
    mentorBubble.style.left = mentorButton.style.left;
    mentorBubble.style.top = parseInt(mentorButton.style.top) + 40 + "px";
    mentorBubble.style.background = "#111";
    mentorBubble.style.color = "white";
    mentorBubble.style.padding = "10px 14px";
    mentorBubble.style.borderRadius = "8px";
    mentorBubble.style.maxWidth = "260px";
    mentorBubble.style.fontSize = "13px";
    mentorBubble.style.lineHeight = "1.4";
    mentorBubble.style.zIndex = "2147483647";
    mentorBubble.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

    document.body.appendChild(mentorBubble);
}

function updateBubble(text) {
    if (mentorBubble) mentorBubble.textContent = text;
}