document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const mainScreen = document.getElementById("mainScreen");
  const startBtn = document.getElementById("startBtn");
  const bgMusic = document.getElementById("bgMusic");

  const openLetterBtn = document.getElementById("openLetterBtn");
  const closeLetterBtn = document.getElementById("closeLetterBtn");
  const letterModal = document.getElementById("letterModal");

  // 1. "Tap to open" Click Handler
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // Audio play attempt (won't crash even if audio fails)
      if (bgMusic) {
        bgMusic.play().catch((err) => {
          console.log("Audio not ready or blocked:", err);
        });
      }

      // Confetti burst
      if (typeof confetti === "function") {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }

      // Hide welcome, show main screen
      welcomeScreen.classList.add("hidden");
      mainScreen.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Load SQL wishes
      loadWishes();
    });
  }

  // 2. Letter Modal Open/Close
  if (openLetterBtn && letterModal) {
    openLetterBtn.addEventListener("click", () => {
      letterModal.classList.remove("hidden");
      if (typeof confetti === "function") {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      }
    });

    closeLetterBtn.addEventListener("click", () => {
      letterModal.classList.add("hidden");
    });

    letterModal.addEventListener("click", (e) => {
      if (e.target === letterModal) {
        letterModal.classList.add("hidden");
      }
    });
  }

  // 3. Secret Memory Diary Unlocker (SQL Backend)
  const unlockForm = document.getElementById("unlockForm");
  if (unlockForm) {
    unlockForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("unlockCode").value;
      const resultDiv = document.getElementById("unlockResult");

      try {
        const res = await fetch("/api/unlock-diary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });
        const data = await res.json();
        resultDiv.classList.remove("hidden");

        if (res.ok && data.unlocked) {
          if (typeof confetti === "function") confetti({ particleCount: 70, spread: 70 });
          resultDiv.innerHTML = `
            <h3 style="color:#e11d48; margin-bottom:6px;">🔓 ${escapeHtml(data.memory.title)}</h3>
            <p>${escapeHtml(data.memory.secret_note)}</p>
          `;
        } else {
          resultDiv.innerHTML = `<p style="color:#e11d48;">❌ ${escapeHtml(data.error || "Incorrect clue.")}</p>`;
        }
      } catch (err) {
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `<p style="color:#e11d48;">Server not active for secret diary.</p>`;
      }
    });
  }

  // 4. Wishes Wall (SQL Backend)
  const wishForm = document.getElementById("wishForm");
  if (wishForm) {
    wishForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const author = document.getElementById("wishAuthor").value;
      const message = document.getElementById("wishMessage").value;

      try {
        const res = await fetch("/api/wishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author, message })
        });

        if (res.ok) {
          wishForm.reset();
          if (typeof confetti === "function") confetti({ particleCount: 40, spread: 50 });
          loadWishes();
        }
      } catch (err) {
        console.log("Could not post wish to server.");
      }
    });
  }

  async function loadWishes() {
    try {
      const res = await fetch("/api/wishes");
      if (!res.ok) return;
      const wishes = await res.json();
      const list = document.getElementById("wishesList");
      if (!list) return;
      list.innerHTML = "";

      if (wishes.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#e5e7eb; font-size:0.9rem;">No wishes yet. Be the first to leave one!</p>`;
        return;
      }

      wishes.forEach((w) => {
        const item = document.createElement("div");
        item.className = "wish-item";
        item.innerHTML = `
          <div class="wish-header">
            <strong>${escapeHtml(w.author)}</strong>
            <span>${new Date(w.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
          <p>${escapeHtml(w.message)}</p>
        `;
        list.appendChild(item);
      });
    } catch (err) {
      console.log("Static mode or server offline.");
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});