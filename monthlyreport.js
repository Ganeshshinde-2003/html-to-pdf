document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const jsonInput = document.getElementById("json-input");
  const loadButton = document.getElementById("load-button");
  const downloadButton = document.getElementById("download-button");
  const editorFormContainer = document.getElementById("editor-form-container");
  const pdfPreview = document.getElementById("pdf-preview");

  let currentData = {};
  let radarChartInstance = null; // To hold the chart instance

  // --- **** DEFAULT DATA FOR DEVELOPMENT **** ---
    const defaultData = {
    "monthly_overview_summary": {
      "summary":
          "This month, you experienced fluctuations in mood and energy. While you reported periods of feeling happy and energized, you also frequently logged feelings of anxiety, depression, and being down. **C1[Fatigue]C1** was a recurring symptom, alongside occasional headaches. The average sleep duration is not available, impacting sleep analysis. Limited data availability impacts the precision of this summary.",
      "top_symptoms": [
        "anxiety",
        "depression",
        "fatigue",
        "cramps",
        "headaches"
      ],
      "health_reflection":
          "Your health this month shows a mix of positive and challenging periods. While there were days of high energy and positive mood, the frequent recurrence of **C1[anxiety and fatigue]C1** suggests a need to focus on stress management and consistent self-care practices. Addressing these **C1[symptoms]C1** may improve overall well-being."
    },
    "hormonal_balance_insight": {
      "score_or_message":
          "**C1[Needs Attention]C1** due to **C2[high stress]C2** and **C1[irregular eating patterns]C1**.",
      "tied_to_logs": [
        "Frequent reports of **C1[anxiety and depression]C1** in Logged Symptoms",
        "Reports of feeling **C1[nauseous and uncomfortable]C1** after meals in Eat Well",
        "**C1[High stress]C1** reported in Recover Well",
        "**C1[Trouble falling asleep]C1** in Sleep Well"
      ],
      "likely_root_causes": [
        "**C2[High stress]C2** levels impacting hormonal balance",
        "**C1[Inconsistent meal timing and potential nutrient deficiencies]C1** affecting energy and mood"
      ]
    },
    "logged_patterns": {
      "eat_well": {
        "did_well": [
          "Trying to reduce sugar intake",
          "Taking supplements (Vitamin D or Omega-3)",
          "Staying hydrated"
        ],
        "areas_to_improve": [
          "Experiencing nausea and discomfort after meals",
          "Inconsistent meal satisfaction",
          "Reports of unhealthy food choices",
          "Skipping meals"
        ],
        "recommendations": [
          "Focus on balanced meals with whole foods",
          "Identify food sensitivities contributing to nausea",
          "Eat regularly to stabilize blood sugar"
        ],
        "Guidance": [
          "Focus on incorporating **C1[whole, unprocessed foods]C1** into your diet to support overall health and hormonal balance.",
          "Experiment with different foods and meal timings to identify any triggers for **C1[nausea and discomfort]C1**.",
          "Plan your meals ahead to ensure you're getting adequate nutrients and avoiding **C1[skipping meals]C1**."
        ],
        "metrics": {
          "days_logged": 20,
          "average_meal_satisfaction_score": 2,
          "processed_food_days_percentage": 10
        }
      },
      "sleep_well": {
        "did_well": [
          "Practicing breathing exercises",
          "Aiming for 7-9 hours of sleep on some nights",
          "Good sunlight exposure on some days"
        ],
        "areas_to_improve": [
          "Trouble falling asleep",
          "Inconsistent sleep quality",
          "Late-night work",
          "Late-night snacks",
          "Working out just before sleep",
          "Inadequate hydration"
        ],
        "recommendations": [
          "Establish a relaxing bedtime routine",
          "Avoid screens and heavy meals before bed",
          "Ensure adequate hydration throughout the day"
        ],
        "Guidance": [
          "Create a **C1[consistent bedtime routine]C1** to signal your body that it's time to wind down and prepare for sleep.",
          "Avoid **C1[screen time and heavy meals]C1** at least an hour before bed to improve sleep quality.",
          "Consider incorporating **C1[relaxation techniques]C1**, such as meditation or deep breathing, into your evening routine."
        ],
        "metrics": {
          "days_logged": 17,
          "average_sleep_quality_score": 3,
          "average_sleep_hours": 7,
          "consistent_bedtime_percentage": 20
        }
      },
      "move_well": {
        "did_well": [
          "Engaging in regular workouts",
          "Enjoying physical activity",
          "Balancing cardio and strength training"
        ],
        "areas_to_improve": [
          "Feeling tired during or after workouts",
          "Limited sunlight exposure",
          "Balancing workouts with rest"
        ],
        "recommendations": [
          "Incorporate rest days into your workout routine",
          "Ensure adequate hydration and nutrition to support energy levels",
          "Prioritize outdoor workouts for sunlight exposure"
        ],
        "Guidance": [
          "Balance your **C1[workouts with rest and recovery]C1** to prevent burnout and support muscle repair.",
          "Ensure you're adequately hydrated and nourished to fuel your workouts and maintain **C2[energy levels]C2**.",
          "Incorporate **C1[outdoor activities]C1** to enjoy the benefits of sunlight and fresh air."
        ],
        "metrics": {
          "days_logged": 19,
          "activity_days_percentage": 100,
          "average_activity_intensity_score": 4
        }
      },
      "recover_well": {
        "did_well": [
          "Practicing aromatherapy",
          "Scheduling me-time",
          "Spending time outdoors",
          "Journaling",
          "Taking breaks",
          "Listening to music"
        ],
        "areas_to_improve": [
          "Experiencing high stress levels",
          "Overuse of social media",
          "Skipping meals",
          "Isolating from social connections",
          "Constant multitasking",
          "Procrastinating",
          "Overworking",
          "Perfectionism"
        ],
        "recommendations": [
          "Prioritize stress-reducing activities",
          "Limit social media use",
          "Maintain regular social connections",
          "Practice mindfulness and time management"
        ],
        "Guidance": [
          "Prioritize stress-reducing activities, such as **C1[meditation, yoga, or spending time in nature]C1**, to promote relaxation and emotional well-being.",
          "Limit your **C1[social media use]C1** to reduce exposure to stressors and promote a more positive mindset.",
          "Maintain **C1[regular social connections]C1** to combat feelings of isolation and foster a sense of belonging."
        ],
        "metrics": {
          "days_logged": 20,
          "average_stress_level_score": 3,
          "recovery_activity_days_percentage": 100
        }
      }
    },
    "root_cause_tags": [
      {
        "tag": "Stress-related hormonal disruption",
        "explanation":
            "The frequent reports of **C1[high stress]C1** in your Recover Well logs, combined with feelings of **C1[anxiety and depression]C1**, suggest a potential disruption in hormonal balance due to **C2[chronic stress]C2**."
      },
      {
        "tag": "Blood sugar instability",
        "explanation":
            "Your Eat Well logs indicate **C1[inconsistent meal timing and reports of nausea and discomfort]C1**, which could contribute to **C2[blood sugar fluctuations and hormonal imbalances]C2**."
      }
    ],
    "actionable_next_steps": {
      "food_to_enjoy": [
        "**C1[Leafy greens]C1** for nutrient density",
        "**C1[Healthy fats like avocado]C1** to support hormonal balance",
        "**C1[Fiber-rich foods]C1** to promote digestive health",
        "**C1[Whole, unprocessed foods]C1**"
      ],
      "food_to_limit": [
        "**C1[Sugary snacks]C1** to stabilize **C2[blood sugar]C2**",
        "**C1[Excessive caffeine]C1** to reduce **C2[anxiety]C2**",
        "**C1[Processed foods]C1**"
      ],
      "rest_and_recovery": [
        "**C1[Try 10-minute daily meditation]C1**",
        "**C1[Schedule downtime]C1** to lower **C2[stress]C2**",
        "**C1[Prioritize sleep hygiene]C1**",
        "**C1[Limit social media use]C1**"
      ],
      "daily_habits": [
        "**C1[Drink water first thing in the morning]C1**",
        "**C1[Set a consistent bedtime routine]C1**",
        "**C1[Practice mindful eating]C1**",
        "**C1[Take regular breaks during the day]C1**"
      ],
      "movements": [
        "**C1[Add 15-minute daily walks]C1**",
        "**C1[Try low-impact yoga]C1** for flexibility",
        "**C1[Balance cardio and strength training]C1**",
        "**C1[Incorporate outdoor activities]C1**"
      ],
      "behavior_goals": [
        "**C1[Get 7-8 hours of sleep nightly]C1**",
        "**C1[Eat meals at regular times]C1** to balance **C2[insulin]C2**",
        "**C1[Manage stress levels effectively]C1**",
        "**C1[Prioritize self-care activities]C1**"
      ],
      "encouragement_message":
          "You're taking important steps to improve your well-being. Keep prioritizing your **C1[health]C1** and remember that small changes can make a big difference!"
    },
    "radar_chart_data": {
      "scores": {
        "eat_well": 3.33,
        "sleep_well": 3.33,
        "move_well": 6.67,
        "recover_well": 6.67
      },
      "key_behaviors": {
        "eat_well": [
          "Reported feeling **C1[nauseous after meals]C1**",
          "Tried to reduce **C2[sugar intake]C2**"
        ],
        "sleep_well": [
          "Averaged around **C2[7 hours of sleep]C2**",
          "Reported **C1[trouble falling asleep]C1**"
        ],
        "move_well": [
          "Logged workouts on most days",
          "Balanced cardio and strength training"
        ],
        "recover_well": [
          "Practiced aromatherapy",
          "Experienced **C2[high stress levels]C2**"
        ]
      },
      "label": "Needs Attention",
      "caption": "Your routines need more support to improve hormonal health."
    }
  };

  // --- **** INITIALIZE APP ON PAGE LOAD **** ---
  // This block automatically loads the default data for you.
  function initializeApp() {
    // Put the default data into the text area
    jsonInput.value = JSON.stringify(defaultData, null, 2);
    // Set the currentData object to the default data
    currentData = defaultData;
    // Render the editor and the preview with the default data
    renderEditor(currentData);
    renderPreview(currentData);
  }

  initializeApp();

  // --- Event Listeners ---
  loadButton.addEventListener("click", handleLoadData);
  downloadButton.addEventListener("click", handleDownloadPdf);

  function handleLoadData() {
    try {
      const rawText = jsonInput.value;
      if (!rawText.trim()) {
        alert("Please paste your JSON data first.");
        return;
      }
      currentData = JSON.parse(rawText);
      renderEditor(currentData);
      renderPreview(currentData);
    } catch (error) {
      alert(`Invalid JSON format: ${error.message}`);
      editorFormContainer.innerHTML = "";
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>Could not load data. Please check your JSON for errors.</p></div>';
    }
  }

  /**
   * --- **** ROBUST PDF DOWNLOAD FUNCTION (with Chart Handling) **** ---
   * This function correctly handles long content for PDF generation by:
   * 1. Temporarily converting a live Chart.js canvas to a static image.
   * 2. Capturing the entire HTML content, regardless of its height.
   * 3. Slicing the captured content into maximum-height pages to avoid PDF limits.
   * 4. Ensuring the live chart is restored after the operation.
   */
  async function handleDownloadPdf() {
    const element = document.getElementById("pdf-preview");
    const downloadBtn = document.getElementById("download-button");
    const canvas = document.getElementById("radarChart");
    const chartImage = document.getElementById("chartImage");

    downloadBtn.textContent = "Generating...";
    downloadBtn.disabled = true;

    // --- Step 1: Temporarily replace the interactive chart with a static image ---
    // This is crucial for the htmlToImage library to capture the chart correctly.
    if (window.radarChartInstance) {
      // Use window.radarChartInstance for global scope
      chartImage.src = window.radarChartInstance.toBase64Image();
      canvas.style.display = "none";
      chartImage.style.display = "block";
    }

    try {
      // --- Step 2: Create a single, tall canvas of the entire HTML element ---
      // We wait for this to complete before proceeding.
      const sourceCanvas = await htmlToImage.toCanvas(element, {
        quality: 1,
        pixelRatio: 2, // A 2x pixel ratio provides excellent text clarity.
        backgroundColor: "#ffffff",
      });

      const { jsPDF } = window.jspdf;

      // --- Step 3: Prepare for slicing ---
      const sourceCanvasWidth = sourceCanvas.width;
      const sourceCanvasHeight = sourceCanvas.height;

      // Constants for conversion and PDF page limits.
      const px_to_pt_ratio = 0.75; // Ratio to convert pixels to points (72pt / 96dpi).
      const maxPageHeightInPt = 14400; // The absolute max height for a PDF page.

      // Calculate the width of the PDF in points.
      const pdfWidthInPt = sourceCanvasWidth * px_to_pt_ratio;

      let y_pos_in_px = 0; // Tracks our position as we slice the source canvas.
      let isFirstPage = true;
      let pdf = null;

      // --- Step 4: Loop through the source canvas and create PDF pages ---
      while (y_pos_in_px < sourceCanvasHeight) {
        // Determine the height of the next slice in pixels.
        const sliceHeightInPx = Math.min(
          sourceCanvasHeight - y_pos_in_px,
          maxPageHeightInPt / px_to_pt_ratio
        );
        // Convert the slice height to points.
        const sliceHeightInPt = sliceHeightInPx * px_to_pt_ratio;

        if (isFirstPage) {
          // Initialize the PDF using the dimensions of the first slice.
          pdf = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: [pdfWidthInPt, sliceHeightInPt],
          });
          isFirstPage = false;
        } else {
          // Add a new page for subsequent slices.
          pdf.addPage([pdfWidthInPt, sliceHeightInPt]);
        }

        // Create a temporary canvas for the current slice.
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = sourceCanvasWidth;
        pageCanvas.height = sliceHeightInPx;
        const pageCtx = pageCanvas.getContext("2d");

        // Draw the slice from the main source canvas onto the temporary canvas.
        pageCtx.drawImage(
          sourceCanvas,
          0,
          y_pos_in_px, // Start of slice on source
          sourceCanvasWidth,
          sliceHeightInPx, // Size of slice
          0,
          0, // Position on temporary canvas
          sourceCanvasWidth,
          sliceHeightInPx // Size on temporary canvas
        );

        // Convert the slice canvas to a JPEG image.
        const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);

        // Add the image to the current PDF page.
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthInPt, sliceHeightInPt);

        // Move our Y-position down for the next slice.
        y_pos_in_px += sliceHeightInPx;
      }

      // --- Step 5: Save the completed PDF ---
      pdf.save(`Monthly_Report.pdf`);
    } catch (error) {
      console.error("PDF Generation failed!", error);
      alert(
        `Could not generate PDF. Please check the console for errors. Error: ${error.message}`
      );
    } finally {
      // --- Step 6: ALWAYS revert the chart display ---
      // This 'finally' block ensures the interactive chart is always shown again,
      // even if the PDF generation fails.
      downloadBtn.textContent = "Download as PDF";
      downloadBtn.disabled = false;

      if (window.radarChartInstance) {
        canvas.style.display = "block";
        chartImage.style.display = "none";
      }
    }
  }

  function handleMarkup(text) {
    if (typeof text !== "string") return text;
    return text.replace(
      /\*\*C(1|2)\[(.*?)\]C\1\*\*/g,
      (match, p1, p2) => `<span class="c${p1}">${p2}</span>`
    );
  }

  // --- RENDER PREVIEW --- (For Monthly Report)
  function renderPreview(data) {
    if (!data || !data.monthly_overview_summary) {
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>No data to preview.</p></div>';
      return;
    }
    let html = "";

    // Monthly Overview
    const overview = data.monthly_overview_summary;
    html += `
            <div class="report-section">
                <h3>Monthly Overview</h3>
                <p>${handleMarkup(overview.summary)}</p>
                <h4>Top Symptoms Logged:</h4>
                <ul class="top-symptoms">${overview.top_symptoms
                  .map((s) => `<li>${s}</li>`)
                  .join("")}</ul>
                <h4>Health Reflection:</h4>
                <p>${handleMarkup(overview.health_reflection)}</p>
            </div>`;

    // Hormonal Balance Insight
    const insight = data.hormonal_balance_insight;
    html += `
            <div class="report-section">
                <h3>Hormonal Balance Insight</h3>
                <p><strong>Status:</strong> ${handleMarkup(
                  insight.score_or_message
                )}</p>
                <p><strong>Tied to Logs:</strong></p>
                <ul>${insight.tied_to_logs
                  .map((log) => `<li>${handleMarkup(log)}</li>`)
                  .join("")}</ul>
                <p><strong>Likely Root Causes:</strong></p>
                <ul>${insight.likely_root_causes
                  .map((cause) => `<li>${handleMarkup(cause)}</li>`)
                  .join("")}</ul>
            </div>`;

    // Radar Chart - Placeholder for the canvas
    html += `
            <div class="report-section">
                <h3>Wellness Scores</h3>
                <div id="radarChartContainer">
                    <canvas id="radarChart"></canvas>
                    <img id="chartImage" style="display:none; width:100%; height:auto;" />
                </div>
                <p style="text-align:center;"><strong>Label:</strong> ${data.radar_chart_data.label} - ${data.radar_chart_data.caption}</p>
            </div>`;

    // Logged Patterns
    html += `
            <div class="report-section">
                <h3>Logged Patterns</h3>
                <div class="logged-patterns-grid">
                    ${Object.entries(data.logged_patterns)
                      .map(
                        ([key, value]) => `
                        <div class="pattern-card">
                            <h5>${key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}</h5>
                            <strong>Did Well:</strong>
                            <ul class="did-well">${value.did_well
                              .map((i) => `<li>${handleMarkup(i)}</li>`)
                              .join("")}</ul>
                            <strong>Areas to Improve:</strong>
                            <ul class="areas-to-improve">${value.areas_to_improve
                              .map((i) => `<li>${handleMarkup(i)}</li>`)
                              .join("")}</ul>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>`;

    // Root Cause Tags
    html += `
            <div class="report-section">
                <h3>Potential Root Causes</h3>
                ${data.root_cause_tags
                  .map(
                    (tag) => `
                    <div class="root-cause-card">
                        <h4>${tag.tag}</h4>
                        <p>${handleMarkup(tag.explanation)}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>`;

    // Actionable Next Steps
    const actions = data.actionable_next_steps;
    html += `
            <div class="report-section">
                <h3>Actionable Next Steps</h3>
                <div class="action-steps-grid">
                    ${Object.entries(actions)
                      .filter(([key]) => key !== "encouragement_message")
                      .map(
                        ([key, value]) => `
                        <div>
                            <h4>${key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}</h4>
                            <ul>${value
                              .map((item) => `<li>${handleMarkup(item)}</li>`)
                              .join("")}</ul>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <h4>A Final Note</h4>
                <p><em>${handleMarkup(actions.encouragement_message)}</em></p>
            </div>`;

    pdfPreview.innerHTML = html;
    renderRadarChart(data.radar_chart_data);
  }

  function renderRadarChart(chartData) {
    const ctx = document.getElementById("radarChart").getContext("2d");
    if (radarChartInstance) {
      radarChartInstance.destroy(); // Destroy old chart before creating new one
    }
    radarChartInstance = new Chart(ctx, {
      type: "radar",
      data: {
        labels: Object.keys(chartData.scores).map((key) =>
          key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        ),
        datasets: [
          {
            label: "Wellness Score",
            data: Object.values(chartData.scores),
            fill: true,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(54, 162, 235)",
          },
        ],
      },
      options: {
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        scales: {
          r: {
            angleLines: { display: false },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: { stepSize: 2 },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  // --- RENDER EDITOR --- (Generic function, no changes needed)
  function renderEditor(data) {
    editorFormContainer.innerHTML = "";
    buildFormSection(data, "", editorFormContainer);
  }

  function buildFormSection(data, path, parentElement) {
    for (const key in data) {
      const currentPath = path ? `${path}.${key}` : key;
      const value = data[key];

      if (["string", "number"].includes(typeof value)) {
        parentElement.appendChild(
          createField(
            currentPath,
            value,
            key,
            typeof value === "string" ? "textarea" : "text"
          )
        );
      } else if (Array.isArray(value)) {
        const fieldset = createFieldset(key);
        value.forEach((item, index) => {
          const itemPath = `${currentPath}[${index}]`;
          if (typeof item === "string") {
            fieldset.appendChild(
              createField(
                itemPath,
                item,
                `${key.replace(/s$/, "")} #${index + 1}`,
                "textarea"
              )
            );
          } else if (typeof item === "object" && item !== null) {
            const itemFieldset = createFieldset(
              item.name || item.tag || `${key.replace(/s$/, "")} #${index + 1}`
            );
            buildFormSection(item, itemPath, itemFieldset);
            fieldset.appendChild(itemFieldset);
          }
        });
        parentElement.appendChild(fieldset);
      } else if (typeof value === "object" && value !== null) {
        const fieldset = createFieldset(key);
        buildFormSection(value, currentPath, fieldset);
        parentElement.appendChild(fieldset);
      }
    }
  }

  function createFieldset(legendText) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = legendText
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    fieldset.appendChild(legend);
    return fieldset;
  }

  function createField(path, value, labelText, type = "textarea") {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = labelText
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    wrapper.appendChild(label);

    const input = document.createElement(type);
    input.value = value;
    if (type === "textarea") input.rows = 3;

    input.addEventListener("input", (e) => {
      const newValue =
        type === "number" ? parseFloat(e.target.value) : e.target.value;
      updateDataObject(path, newValue);
      renderPreview(currentData);
    });

    wrapper.appendChild(input);
    return wrapper;
  }

  function updateDataObject(path, value) {
    let schema = currentData;
    const pList = path
      .replace(/\[(\w+)\]/g, ".$1")
      .replace(/^\./, "")
      .split(".");
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      let elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }
    schema[pList[len - 1]] = value;
  }
});
