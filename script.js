const popup = document.getElementById("tipPopup");
const saveTip = document.getElementById("saveTip");
const closePopup = document.getElementById("closePopup");
const tipTitle = document.getElementById("tipTitle");
const tipDesc = document.getElementById("tipDesc");
let currentContainer = null;

document.querySelectorAll(".add-tip-button").forEach(button => {
    button.addEventListener("click", () => {
        const containerSelector = button.getAttribute("data-container");
        currentContainer = document.querySelector(containerSelector);

        if (!currentContainer) {
            console.error("⚠ Could not find container:", containerSelector);
            return;
        }

        popup.style.display = "flex";
    });
});

// Close popup
closePopup.addEventListener("click", () => {
    popup.style.display = "none";
    tipTitle.value = "";
    tipDesc.value = "";
    currentContainer = null;
});

// Save tip (create card)
saveTip.addEventListener("click", () => {
    const title = tipTitle.value.trim();
    const desc = tipDesc.value.trim();

    if (!title || !desc) {
        alert("Please fill out both fields.");
        return;
    }

    if (!currentContainer) {
        alert("Error: No container selected.");
        return;
    }

    // Build new card
    const newCard = document.createElement("div");
    newCard.classList.add(
        "one_individual_card_that_displays_an_image_and_text",
        "the_expandable_card",
        "user-added-card"
    );

    newCard.innerHTML = `
        <div class="user-tip-badge">User Tip</div>
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="the_hidden_expanded_content">
            <p>${desc}</p>
        </div>
        <button class="remove-card-button">Remove</button>
    `;

    currentContainer.appendChild(newCard);

    popup.style.display = "none";
    tipTitle.value = "";
    tipDesc.value = "";
    currentContainer = null;
});

document.addEventListener("click", e => {
    // Expandable card toggle
    if (e.target.closest(".the_expandable_card") && 
        !e.target.classList.contains("remove-card-button")) {
        const card = e.target.closest(".the_expandable_card");
        card.classList.toggle("open");
    }

    // Remove card
    if (e.target.classList.contains("remove-card-button")) {
        const card = e.target.closest(".one_individual_card_that_displays_an_image_and_text");
        card.remove();
    }
});

// ============================================
// 🎉 EASTER EGG: Ctrl/Cmd + M
// ============================================
let devMode = false;
let devInterval = null; // 🔥 FIXED: declared properly!
const devContainer = document.getElementById('devEffectsContainer');
const resetBtn = document.getElementById('resetDevMode');

if (devContainer && resetBtn) {
    const emojis = [
        "🌈", "💜", "🎉", "✨", "🔮", "🧋", "💔", "❤️‍🩹", "❤️‍🔥",
        "☕️", "🍵", "💖", "💝", "🎀", "🩵", "💙",
        "🩷", "🤍", "🎉", "🧃", "❔", "🖤", "🥤",
        "🧊", "❄️", "🌺", "☀️", "🌷", "🌸", "🍁",
        "🦶", "😼", "🍓", "☁️", "🌧️", "⛅️", "🌨️", "☔️"
    ];

    function createDevEffect() {
        const span = document.createElement('span');
        span.classList.add('devEffectItem');
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + "vw";
        span.style.fontSize = (20 + Math.random() * 30) + "px";
        span.style.animationDuration = (3 + Math.random() * 3) + "s"; // Random speed
        devContainer.appendChild(span);
        setTimeout(() => { span.remove(); }, 5000);
    }

    // 🔥 CHANGED: Ctrl/Cmd + M instead of D
    // 🔥 FIXED: Works with Ctrl+M on Windows AND Cmd+M on Mac!
document.addEventListener("keydown", function(e) {
    // Check for Ctrl OR Cmd (metaKey)
    const isModifierPressed = e.ctrlKey || e.metaKey;
    const isMKey = e.key === 'm' || e.key === 'M';
    
    if (isModifierPressed && isMKey) {
        e.preventDefault();
        devMode = !devMode;

        document.body.classList.toggle("dev-mode", devMode);
        resetBtn.style.display = devMode ? "block" : "none";

        if (devMode) {
            console.log("🎉 EASTER EGG ACTIVATED! ✨");
            devInterval = setInterval(createDevEffect, 150);
            for (let i = 0; i < 10; i++) {
                setTimeout(createDevEffect, i * 50);
            }
        } else {
            console.log("😴 Easter egg deactivated.");
            clearInterval(devInterval);
            devInterval = null;
            document.querySelectorAll('.devEffectItem').forEach(el => el.remove());
        }
    }
});
    resetBtn.addEventListener("click", () => {
        document.body.classList.remove("dev-mode");
        resetBtn.style.display = "none";
        clearInterval(devInterval);
        devInterval = null;
        document.querySelectorAll('.devEffectItem').forEach(el => el.remove());
    });
}
//i hope this works
