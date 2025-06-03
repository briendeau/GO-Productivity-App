document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const missionInput = document.getElementById("missionInput");
  const deployBtn = document.getElementById("deployMission");
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startTimer");
  const resetBtn = document.getElementById("resetTimer");
  const timeSelect = document.getElementById("timeSelect");
  const logContainer = document.getElementById("logContainer");
  const weeklyPlan = document.getElementById("weeklyPlan");
  const longtermPlan = document.getElementById("longtermPlan");
  const planDisplay = document.getElementById("planDisplay");
  const savePlanBtn = document.getElementById("savePlan");
  const printPlanBtn = document.getElementById("printPlan");
  const clearAllBtn = document.getElementById("clearAll");
  const notesInput = document.getElementById("notesInput");
  const notesDisplay = document.getElementById("notesDisplay");
  const saveNotesBtn = document.getElementById("saveNotes");
  const streakNumber = document.querySelector(".streak-number");
  const selectedTimeSpan = document.getElementById("selectedTime");
  const lastUpdateSpan = document.getElementById("lastUpdate");

  // Timer variables
  let timerInterval;
  let timeLeft = 15 * 60; // 15 minutes in seconds
  let isRunning = false;
  let selectedDuration = 15;

  // Initialize
  loadSavedData();
  updateLastUpdateTime();

  // Update selected time display
  timeSelect.addEventListener("change", function () {
    selectedDuration = parseInt(timeSelect.value);
    selectedTimeSpan.textContent = selectedDuration;
    resetTimer();
  });

  // Mission deployment
  deployBtn.addEventListener("click", function () {
    const missionText = missionInput.value.trim();
    if (missionText) {
      deployMission(missionText);
      missionInput.value = "";
      updateStreak();
    }
  });

  // Timer controls
  startBtn.addEventListener("click", function () {
    if (isRunning) {
      pauseTimer();
      startBtn.textContent = "RESUME FOCUS";
    } else {
      startTimer();
      startBtn.textContent = "PAUSE FOCUS";
    }
  });

  resetBtn.addEventListener("click", resetTimer);

  // Plan saving
  savePlanBtn.addEventListener("click", savePlans);

  // Notes saving
  saveNotesBtn.addEventListener("click", saveNotes);

  // Print Battle Plan
  printPlanBtn.addEventListener("click", generatePDF);

  // Clear all data
  clearAllBtn.addEventListener("click", clearAllData);

  // Mission deployment function
  function deployMission(text) {
    const now = new Date();
    const dateString = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const missionEntry = document.createElement("div");
    missionEntry.className = "log-entry";
    missionEntry.innerHTML = `
              <div class="log-date">DEPLOYED: ${dateString}</div>
              <div class="log-content">${text.replace(/\n/g, "<br>")}</div>
          `;

    // Add to top of log
    if (logContainer.firstChild.classList?.contains("empty-log")) {
      logContainer.innerHTML = "";
    }
    logContainer.insertBefore(missionEntry, logContainer.firstChild);

    // Save to localStorage
    saveMission(now, text);
    updateLastUpdateTime();
  }

  // Timer functions
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      timerInterval = setInterval(function () {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerDisplay.textContent = "MISSION COMPLETE!";
          timerDisplay.style.color = "#00ff00";
          isRunning = false;
          startBtn.textContent = "INITIATE FOCUS";
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = selectedDuration * 60;
    updateTimerDisplay();
    isRunning = false;
    startBtn.textContent = "INITIATE FOCUS";
    timerDisplay.style.color = "#00ff00";
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Plan saving and display
  function savePlans() {
    const weeklyText = weeklyPlan.value.trim();
    const longtermText = longtermPlan.value.trim();

    localStorage.setItem("weeklyPlan", weeklyText);
    localStorage.setItem("longtermPlan", longtermText);

    // Display plans
    displayPlans(weeklyText, longtermText);
    updateLastUpdateTime();
  }

  function displayPlans(weeklyText, longtermText) {
    planDisplay.innerHTML = "";

    if (weeklyText || longtermText) {
      if (weeklyText) {
        const weeklyEntry = document.createElement("div");
        weeklyEntry.className = "plan-entry";
        weeklyEntry.innerHTML = `
                      <div class="plan-date">WEEKLY OBJECTIVES</div>
                      <div class="plan-content">${weeklyText.replace(
                        /\n/g,
                        "<br>"
                      )}</div>
                  `;
        planDisplay.appendChild(weeklyEntry);
      }

      if (longtermText) {
        const longtermEntry = document.createElement("div");
        longtermEntry.className = "plan-entry";
        longtermEntry.innerHTML = `
                      <div class="plan-date">LONG-TERM STRATEGIC TARGETS</div>
                      <div class="plan-content">${longtermText.replace(
                        /\n/g,
                        "<br>"
                      )}</div>
                  `;
        planDisplay.appendChild(longtermEntry);
      }
    } else {
      planDisplay.innerHTML =
        '<div class="empty-log">No strategic plans secured yet</div>';
    }
  }

  function saveNotes() {
    const notesText = notesInput.value.trim();
    if (notesText) {
      localStorage.setItem("notes", notesText);
      localStorage.setItem("notesDate", new Date().toISOString());

      // Display notes
      displayNotes(notesText);
      updateLastUpdateTime();
    }
  }

  function displayNotes(notesText) {
    notesDisplay.innerHTML = "";

    if (notesText) {
      const notesDate = new Date(
        localStorage.getItem("notesDate") || new Date()
      );
      const dateString = notesDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const notesEntry = document.createElement("div");
      notesEntry.className = "notes-entry";
      notesEntry.innerHTML = `
                  <div class="notes-date">RECORDED: ${dateString}</div>
                  <div class="notes-content">${notesText.replace(
                    /\n/g,
                    "<br>"
                  )}</div>
              `;
      notesDisplay.appendChild(notesEntry);
    } else {
      notesDisplay.innerHTML =
        '<div class="empty-log">No intelligence recorded yet</div>';
    }
  }

  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("STRATEGIC BATTLE PLAN", 105, 20, { align: "center" });

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 190, 15, {
      align: "right",
    });

    // Add line
    doc.setDrawColor(139, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    let yPosition = 35;

    // Missions
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("MISSION ARCHIVE", 20, yPosition);
    yPosition += 10;

    const missions = JSON.parse(localStorage.getItem("missions") || "[]");
    if (missions.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      missions.forEach((mission, index) => {
        const missionDate = new Date(mission.date);
        const dateString = missionDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        doc.setFont("helvetica", "bold");
        doc.text(dateString, 20, yPosition);
        yPosition += 7;

        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(mission.text, 170);
        doc.text(splitText, 25, yPosition);
        yPosition += splitText.length * 7 + 5;

        // Add space between missions
        if (index < missions.length - 1) {
          yPosition += 5;
        }

        // Add new page if needed
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
    } else {
      doc.setFont("helvetica", "italic");
      doc.text("No missions deployed", 20, yPosition);
      yPosition += 10;
    }

    // Weekly Plan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("WEEKLY OBJECTIVES", 20, yPosition);
    yPosition += 10;

    const weeklyText =
      localStorage.getItem("weeklyPlan") || "No weekly objectives set";
    doc.setFont("helvetica", "normal");
    const weeklySplit = doc.splitTextToSize(weeklyText, 170);
    doc.text(weeklySplit, 20, yPosition);
    yPosition += weeklySplit.length * 7 + 15;

    // Long-term Plan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("LONG-TERM STRATEGIC TARGETS", 20, yPosition);
    yPosition += 10;

    const longtermText =
      localStorage.getItem("longtermPlan") || "No long-term targets set";
    doc.setFont("helvetica", "normal");
    const longtermSplit = doc.splitTextToSize(longtermText, 170);
    doc.text(longtermSplit, 20, yPosition);
    yPosition += longtermSplit.length * 7 + 15;

    // Notes
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("INTELLIGENCE & NOTES", 20, yPosition);
    yPosition += 10;

    const notesText =
      localStorage.getItem("notes") || "No intelligence recorded";
    doc.setFont("helvetica", "normal");
    const notesSplit = doc.splitTextToSize(notesText, 170);
    doc.text(notesSplit, 20, yPosition);

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(
      "Generated by MISSION CONTROL - Discipline Equals Freedom",
      105,
      285,
      { align: "center" }
    );

    // Save the PDF
    doc.save("battle-plan.pdf");
  }

  function clearAllData() {
    if (
      confirm(
        "WARNING: This will erase all mission data. Confirm tactical reset?"
      )
    ) {
      localStorage.clear();

      // Clear inputs
      missionInput.value = "";
      weeklyPlan.value = "";
      longtermPlan.value = "";
      notesInput.value = "";

      // Clear displays
      logContainer.innerHTML =
        '<div class="empty-log">No missions deployed yet. Brief your first operation!</div>';
      planDisplay.innerHTML =
        '<div class="empty-log">No strategic plans secured yet</div>';
      notesDisplay.innerHTML =
        '<div class="empty-log">No intelligence recorded yet</div>';

      // Reset streak
      streakNumber.textContent = "0";

      updateLastUpdateTime();
    }
  }

  // Data storage functions
  function saveMission(date, text) {
    const missions = JSON.parse(localStorage.getItem("missions") || "[]");
    missions.unshift({
      date: date.toISOString(),
      text: text,
    });
    localStorage.setItem("missions", JSON.stringify(missions));
  }

  function loadSavedData() {
    // Load missions
    const missions = JSON.parse(localStorage.getItem("missions") || "[]");
    if (missions.length > 0) {
      logContainer.innerHTML = "";
      missions.forEach((mission) => {
        const missionDate = new Date(mission.date);
        const dateString = missionDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const missionEntry = document.createElement("div");
        missionEntry.className = "log-entry";
        missionEntry.innerHTML = `
                      <div class="log-date">DEPLOYED: ${dateString}</div>
                      <div class="log-content">${mission.text.replace(
                        /\n/g,
                        "<br>"
                      )}</div>
                  `;
        logContainer.appendChild(missionEntry);
      });
    }

    // Load plans
    const weeklyText = localStorage.getItem("weeklyPlan") || "";
    const longtermText = localStorage.getItem("longtermPlan") || "";
    weeklyPlan.value = weeklyText;
    longtermPlan.value = longtermText;
    displayPlans(weeklyText, longtermText);

    // Load notes
    const notesText = localStorage.getItem("notes") || "";
    notesInput.value = notesText;
    displayNotes(notesText);

    // Calculate streak
    updateStreak();
  }

  function updateStreak() {
    const missions = JSON.parse(localStorage.getItem("missions") || "[]");
    streakNumber.textContent = missions.length;
  }

  function updateLastUpdateTime() {
    const now = new Date();
    lastUpdateSpan.textContent = now.toLocaleTimeString();
  }
});
