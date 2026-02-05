const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const body = document.body;

themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-mode");
  themeLabel.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("terrain-theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("terrain-theme") === "dark") {
  body.classList.add("dark-mode");
  themeLabel.textContent = "☀️ Light Mode";
}

// -------- Image Upload Logic --------
const input = document.getElementById("imageInput");
const preview = document.getElementById("inputPreview");
const segmentedPreview = document.getElementById("segmentedPreview");
const status = document.getElementById("status");
const reportStats = document.getElementById("reportStats");
const alertBox = document.getElementById("alertBox");
const riskLevel = document.getElementById("riskLevel");
const riskAdvice = document.getElementById("riskAdvice");
const confidenceBox = document.getElementById("confidenceBox");
const confidenceBar = document.getElementById("confidenceBar");
const confidencePercent = document.getElementById("confidencePercent");

input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  status.classList.remove("hidden");
  status.textContent = "📡 INITIALIZING_SCAN...";

  reader.onload = () => {
    preview.src = reader.result;
    setTimeout(() => {
      generateAnalysis();
    }, 500);
  };
  reader.readAsDataURL(file);
});

// -------- BACKEND INTEGRATION --------
async function generateAnalysis() {
  const file = input.files[0];
  if (!file) return;

  status.textContent = "📡 ANALYZING_TERRAIN...";

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://127.0.0.1:8001/analyze", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  // -------- Instructions --------
  reportStats.innerHTML = "";
  data.instructions.forEach(msg => {
    const p = document.createElement("p");
    p.textContent = "• " + msg;
    reportStats.appendChild(p);
  });

  // -------- Segmented Image --------
  segmentedPreview.src = `http://127.0.0.1:8001${data.segmented_image}`;

  // -------- Severity Logic --------
  // -------- Severity Logic (5m Look-Ahead Approximation) --------

// Keywords that indicate real danger
const dangerKeywords = ["drop", "steep", "slippery", "high-risk", "cluster"];

// Count danger-related instructions
const dangerCount = data.instructions.filter(i =>
  dangerKeywords.some(k => i.toLowerCase().includes(k))
).length;

// Count rock-related warnings separately
const rockWarnings = data.instructions.filter(i =>
  i.toLowerCase().includes("rock")
).length;

let level = "SAFE";
let color = "#10b981";

// DANGER only if multiple serious indicators
if (dangerCount >= 2 || rockWarnings >= 3) {
  level = "DANGER";
  color = "#ef4444";
}
// CAUTION for moderate nearby risk
else if (dangerCount === 1 || rockWarnings === 1 || data.instructions.length > 4) {
  level = "CAUTION";
  color = "#f59e0b";
}

alertBox.classList.remove("hidden");
riskLevel.textContent = `STATUS: ${level}`;
riskAdvice.textContent = "Assessment based on near-field (~5m) terrain analysis.";
alertBox.style.borderColor = color;

// -------- Calculate Dynamic Confidence Based on Instructions --------
let confidence = 50; // Base confidence

// Count instruction types
const safetyHints = data.instructions.filter(i =>
  i.toLowerCase().includes("visibility") || 
  i.toLowerCase().includes("good") ||
  i.toLowerCase().includes("clear")
).length;

const hazardHints = data.instructions.filter(i =>
  i.toLowerCase().includes("rock") || 
  i.toLowerCase().includes("vegetation") ||
  i.toLowerCase().includes("sand")
).length;

const dangerHints = data.instructions.filter(i =>
  i.toLowerCase().includes("danger") || 
  i.toLowerCase().includes("reduce speed") ||
  i.toLowerCase().includes("drop") ||
  i.toLowerCase().includes("steep")
).length;

// Confidence calculation:
// - Safety hints boost confidence (+15% each)
// - Hazard hints keep it moderate (+5% each)
// - Danger hints reduce confidence (-20% each)
confidence = 50;
confidence += (safetyHints * 15);  // Good visibility boosts trust
confidence += (hazardHints * 5);   // Identified hazards increase data confidence
confidence -= (dangerHints * 20);  // Real dangers reduce overall confidence
confidence += (data.instructions.length * 3); // More data = more confidence

// Cap between 20% and 98%
confidence = Math.max(20, Math.min(confidence, 98));

// Adjust based on status level
if (level === "DANGER") {
  confidence = Math.max(confidence - 15, 30);
} else if (level === "CAUTION") {
  confidence = Math.max(confidence - 5, 45);
}

confidenceBox.classList.remove("hidden");
confidencePercent.textContent = `${confidence}%`;
confidenceBar.style.width = `${confidence}%`;
confidenceBar.style.backgroundColor = color;
}