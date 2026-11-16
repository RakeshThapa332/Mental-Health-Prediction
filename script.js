const API_URL = "http://127.0.0.1:8000/predict";

const form = document.getElementById("predictionForm");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const formError = document.getElementById("formError");
const resultPlaceholder = document.getElementById("resultPlaceholder");
const resultOutput = document.getElementById("resultOutput");
const loadingState = document.getElementById("loadingState");
const resultStatus = document.getElementById("resultStatus");
const scoreNumber = document.getElementById("scoreNumber");
const completionText = document.getElementById("completionText");
const completionPercent = document.getElementById("completionPercent");
const completionProgress = document.getElementById("completionProgress");
const completionBar = document.getElementById("completionBar");
const requiredFields = [...form.querySelectorAll("[required]")];

function showState(state) {
  resultPlaceholder.hidden = state !== "placeholder";
  resultOutput.hidden = state !== "result";
  loadingState.hidden = state !== "loading";
}

function updateCompletion() {
  const answered = requiredFields.filter((field) => field.value.trim() !== "").length;
  const percent = Math.round((answered / requiredFields.length) * 100);
  completionText.textContent = `${answered} of ${requiredFields.length} details answered`;
  completionPercent.textContent = `${percent}%`;
  completionProgress.setAttribute("aria-valuenow", answered);
  completionBar.style.width = `${percent}%`;
}

form.addEventListener("input", updateCompletion);
form.addEventListener("change", updateCompletion);
form.addEventListener("reset", () => {
  setTimeout(updateCompletion, 0);
});
updateCompletion();

function getPayload() {
  const data = new FormData(form);
  return {
    age: Number(data.get("age")),
    gender: data.get("gender"),
    country: data.get("country").trim(),
    academic_level: data.get("academic_level"),
    most_used_platform: data.get("most_used_platform"),
    purpose_of_use: data.get("purpose_of_use"),
    avg_daily_usage_hours: Number(data.get("avg_daily_usage_hours")),
    daily_unlocks: Number(data.get("daily_unlocks")),
    study_hours: Number(data.get("study_hours")),
    physical_activity_hours: Number(data.get("physical_activity_hours")),
    sleep_hours_per_night: Number(data.get("sleep_hours_per_night")),
    stress_level: data.get("stress_level")
  };
}

function validatePayload(payload) {
  if (!form.reportValidity()) return false;
  if (!Number.isInteger(payload.age) || payload.age < 10 || payload.age > 120) {
    formError.textContent = "Please enter a whole-number age of at least 10.";
    return false;
  }
  if (payload.avg_daily_usage_hours < 0 || payload.avg_daily_usage_hours > 24 ||
      payload.study_hours < 0 || payload.study_hours > 24 ||
      payload.sleep_hours_per_night < 0 || payload.sleep_hours_per_night > 24) {
    formError.textContent = "Daily hours must be between 0 and 24.";
    return false;
  }
  if (payload.physical_activity_hours < 0 || payload.physical_activity_hours > 2) {
    formError.textContent = "Physical activity must be between 0 and 2 hours to match your API validation.";
    return false;
  }
  if (payload.daily_unlocks < 0 || !Number.isInteger(payload.daily_unlocks)) {
    formError.textContent = "Daily unlocks must be a non-negative whole number.";
    return false;
  }
  return true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  const payload = getPayload();
  if (!validatePayload(payload)) return;

  showState("loading");
  resultStatus.textContent = "PROCESSING";
  submitBtn.disabled = true;
  resetBtn.disabled = true;
  submitBtn.querySelector("span:first-child").textContent = "Generating…";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => null);
    if (!response.ok) {
      const detail = responseData && typeof responseData === "object"
        ? responseData.detail
        : null;
      const message = Array.isArray(detail)
        ? detail.map(item => item && item.msg).filter(Boolean).join(", ")
        : typeof detail === "string" ? detail : "";
      throw new Error(message || `API request failed (${response.status})`);
    }
    const score = responseData && typeof responseData === "object"
      ? responseData.predicted_mental_health_score
      : undefined;
    if (typeof score !== "number" || !Number.isFinite(score)) {
      throw new Error("The API response did not contain predicted_mental_health_score.");
    }

    scoreNumber.textContent = score.toFixed(2);
    resultStatus.textContent = "PREDICTION READY";
    showState("result");
  } catch (error) {
    showState("placeholder");
    resultStatus.textContent = "REQUEST FAILED";
    const message = error instanceof Error ? error.message : String(error);
    formError.textContent = error instanceof TypeError ||
      /failed to fetch|load failed|networkerror/i.test(message)
      ? "Could not reach the API. Start your FastAPI server and check API_URL and CORS settings."
      : message || "An unexpected error occurred.";
  } finally {
    submitBtn.disabled = false;
    resetBtn.disabled = false;
    submitBtn.querySelector("span:first-child").textContent = "Generate prediction";
  }
});

resetBtn.addEventListener("click", () => {
  formError.textContent = "";
  resultStatus.textContent = "AWAITING INPUT";
  showState("placeholder");
});
