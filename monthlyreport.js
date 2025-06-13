document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const jsonInput = document.getElementById("json-input");
  const loadButton = document.getElementById("load-button");
  const downloadButton = document.getElementById("download-button");
  const editorFormContainer = document.getElementById("editor-form-container");
  const pdfPreview = document.getElementById("pdf-preview");

  let currentData = {};
  let radarChartInstance = null; // To hold the chart instance

  // // --- **** DEFAULT DATA FOR DEVELOPMENT **** ---
  // const defaultData = {
  //   monthly_overview_summary: {
  //     summary:
  //       "This month, you experienced fluctuations in mood and energy. While you reported periods of feeling happy and energized, you also frequently logged feelings of anxiety, depression, and being down. **C1[Fatigue]C1** was a recurring symptom, alongside occasional headaches. The average sleep duration is not available, impacting sleep analysis. Limited data availability impacts the precision of this summary.",
  //     top_symptoms: ["anxiety", "depression", "fatigue", "cramps", "headaches"],
  //     health_reflection:
  //       "Your health this month shows a mix of positive and challenging periods. While there were days of high energy and positive mood, the frequent recurrence of **C1[anxiety and fatigue]C1** suggests a need to focus on stress management and consistent self-care practices. Addressing these **C1[symptoms]C1** may improve overall well-being.",
  //   },
  //   hormonal_balance_insight: {
  //     score_or_message:
  //       "**C1[Needs Attention]C1** due to **C2[high stress]C2** and **C1[irregular eating patterns]C1**.",
  //     tied_to_logs: [
  //       "Frequent reports of **C1[anxiety and depression]C1** in Logged Symptoms",
  //       "Reports of feeling **C1[nauseous and uncomfortable]C1** after meals in Eat Well",
  //       "**C1[High stress]C1** reported in Recover Well",
  //       "**C1[Trouble falling asleep]C1** in Sleep Well",
  //     ],
  //     likely_root_causes: [
  //       "**C2[High stress]C2** levels impacting hormonal balance",
  //       "**C1[Inconsistent meal timing and potential nutrient deficiencies]C1** affecting energy and mood",
  //     ],
  //   },
  //   logged_patterns: {
  //     eat_well: {
  //       did_well: [
  //         "Trying to reduce sugar intake",
  //         "Taking supplements (Vitamin D or Omega-3)",
  //         "Staying hydrated",
  //       ],
  //       areas_to_improve: [
  //         "Experiencing nausea and discomfort after meals",
  //         "Inconsistent meal satisfaction",
  //         "Reports of unhealthy food choices",
  //         "Skipping meals",
  //       ],
  //       recommendations: [
  //         "Focus on balanced meals with whole foods",
  //         "Identify food sensitivities contributing to nausea",
  //         "Eat regularly to stabilize blood sugar",
  //       ],
  //       Guidance: [
  //         "Focus on incorporating **C1[whole, unprocessed foods]C1** into your diet to support overall health and hormonal balance.",
  //         "Experiment with different foods and meal timings to identify any triggers for **C1[nausea and discomfort]C1**.",
  //         "Plan your meals ahead to ensure you're getting adequate nutrients and avoiding **C1[skipping meals]C1**.",
  //       ],
  //       metrics: {
  //         days_logged: 20,
  //         average_meal_satisfaction_score: 2,
  //         processed_food_days_percentage: 10,
  //       },
  //     },
  //     sleep_well: {
  //       did_well: [
  //         "Practicing breathing exercises",
  //         "Aiming for 7-9 hours of sleep on some nights",
  //         "Good sunlight exposure on some days",
  //       ],
  //       areas_to_improve: [
  //         "Trouble falling asleep",
  //         "Inconsistent sleep quality",
  //         "Late-night work",
  //         "Late-night snacks",
  //         "Working out just before sleep",
  //         "Inadequate hydration",
  //       ],
  //       recommendations: [
  //         "Establish a relaxing bedtime routine",
  //         "Avoid screens and heavy meals before bed",
  //         "Ensure adequate hydration throughout the day",
  //       ],
  //       Guidance: [
  //         "Create a **C1[consistent bedtime routine]C1** to signal your body that it's time to wind down and prepare for sleep.",
  //         "Avoid **C1[screen time and heavy meals]C1** at least an hour before bed to improve sleep quality.",
  //         "Consider incorporating **C1[relaxation techniques]C1**, such as meditation or deep breathing, into your evening routine.",
  //       ],
  //       metrics: {
  //         days_logged: 17,
  //         average_sleep_quality_score: 3,
  //         average_sleep_hours: 7,
  //         consistent_bedtime_percentage: 20,
  //       },
  //     },
  //     move_well: {
  //       did_well: [
  //         "Engaging in regular workouts",
  //         "Enjoying physical activity",
  //         "Balancing cardio and strength training",
  //       ],
  //       areas_to_improve: [
  //         "Feeling tired during or after workouts",
  //         "Limited sunlight exposure",
  //         "Balancing workouts with rest",
  //       ],
  //       recommendations: [
  //         "Incorporate rest days into your workout routine",
  //         "Ensure adequate hydration and nutrition to support energy levels",
  //         "Prioritize outdoor workouts for sunlight exposure",
  //       ],
  //       Guidance: [
  //         "Balance your **C1[workouts with rest and recovery]C1** to prevent burnout and support muscle repair.",
  //         "Ensure you're adequately hydrated and nourished to fuel your workouts and maintain **C2[energy levels]C2**.",
  //         "Incorporate **C1[outdoor activities]C1** to enjoy the benefits of sunlight and fresh air.",
  //       ],
  //       metrics: {
  //         days_logged: 19,
  //         activity_days_percentage: 100,
  //         average_activity_intensity_score: 4,
  //       },
  //     },
  //     recover_well: {
  //       did_well: [
  //         "Practicing aromatherapy",
  //         "Scheduling me-time",
  //         "Spending time outdoors",
  //         "Journaling",
  //         "Taking breaks",
  //         "Listening to music",
  //       ],
  //       areas_to_improve: [
  //         "Experiencing high stress levels",
  //         "Overuse of social media",
  //         "Skipping meals",
  //         "Isolating from social connections",
  //         "Constant multitasking",
  //         "Procrastinating",
  //         "Overworking",
  //         "Perfectionism",
  //       ],
  //       recommendations: [
  //         "Prioritize stress-reducing activities",
  //         "Limit social media use",
  //         "Maintain regular social connections",
  //         "Practice mindfulness and time management",
  //       ],
  //       Guidance: [
  //         "Prioritize stress-reducing activities, such as **C1[meditation, yoga, or spending time in nature]C1**, to promote relaxation and emotional well-being.",
  //         "Limit your **C1[social media use]C1** to reduce exposure to stressors and promote a more positive mindset.",
  //         "Maintain **C1[regular social connections]C1** to combat feelings of isolation and foster a sense of belonging.",
  //       ],
  //       metrics: {
  //         days_logged: 20,
  //         average_stress_level_score: 3,
  //         recovery_activity_days_percentage: 100,
  //       },
  //     },
  //   },
  //   root_cause_tags: [
  //     {
  //       tag: "Stress-related hormonal disruption",
  //       explanation:
  //         "The frequent reports of **C1[high stress]C1** in your Recover Well logs, combined with feelings of **C1[anxiety and depression]C1**, suggest a potential disruption in hormonal balance due to **C2[chronic stress]C2**.",
  //     },
  //     {
  //       tag: "Blood sugar instability",
  //       explanation:
  //         "Your Eat Well logs indicate **C1[inconsistent meal timing and reports of nausea and discomfort]C1**, which could contribute to **C2[blood sugar fluctuations and hormonal imbalances]C2**.",
  //     },
  //   ],
  //   actionable_next_steps: {
  //     food_to_enjoy: [
  //       "**C1[Leafy greens]C1** for nutrient density",
  //       "**C1[Healthy fats like avocado]C1** to support hormonal balance",
  //       "**C1[Fiber-rich foods]C1** to promote digestive health",
  //       "**C1[Whole, unprocessed foods]C1**",
  //     ],
  //     food_to_limit: [
  //       "**C1[Sugary snacks]C1** to stabilize **C2[blood sugar]C2**",
  //       "**C1[Excessive caffeine]C1** to reduce **C2[anxiety]C2**",
  //       "**C1[Processed foods]C1**",
  //     ],
  //     rest_and_recovery: [
  //       "**C1[Try 10-minute daily meditation]C1**",
  //       "**C1[Schedule downtime]C1** to lower **C2[stress]C2**",
  //       "**C1[Prioritize sleep hygiene]C1**",
  //       "**C1[Limit social media use]C1**",
  //     ],
  //     daily_habits: [
  //       "**C1[Drink water first thing in the morning]C1**",
  //       "**C1[Set a consistent bedtime routine]C1**",
  //       "**C1[Practice mindful eating]C1**",
  //       "**C1[Take regular breaks during the day]C1**",
  //     ],
  //     movements: [
  //       "**C1[Add 15-minute daily walks]C1**",
  //       "**C1[Try low-impact yoga]C1** for flexibility",
  //       "**C1[Balance cardio and strength training]C1**",
  //       "**C1[Incorporate outdoor activities]C1**",
  //     ],
  //     behavior_goals: [
  //       "**C1[Get 7-8 hours of sleep nightly]C1**",
  //       "**C1[Eat meals at regular times]C1** to balance **C2[insulin]C2**",
  //       "**C1[Manage stress levels effectively]C1**",
  //       "**C1[Prioritize self-care activities]C1**",
  //     ],
  //     encouragement_message:
  //       "You're taking important steps to improve your well-being. Keep prioritizing your **C1[health]C1** and remember that small changes can make a big difference!",
  //   },
  //   radar_chart_data: {
  //     scores: {
  //       eat_well: 3.33,
  //       sleep_well: 3.33,
  //       move_well: 6.67,
  //       recover_well: 6.67,
  //     },
  //     key_behaviors: {
  //       eat_well: [
  //         "Reported feeling **C1[nauseous after meals]C1**",
  //         "Tried to reduce **C2[sugar intake]C2**",
  //       ],
  //       sleep_well: [
  //         "Averaged around **C2[7 hours of sleep]C2**",
  //         "Reported **C1[trouble falling asleep]C1**",
  //       ],
  //       move_well: [
  //         "Logged workouts on most days",
  //         "Balanced cardio and strength training",
  //       ],
  //       recover_well: [
  //         "Practiced aromatherapy",
  //         "Experienced **C2[high stress levels]C2**",
  //       ],
  //     },
  //     label: "Needs Attention",
  //     caption: "Your routines need more support to improve hormonal health.",
  //   },
  // };

  // // --- **** INITIALIZE APP ON PAGE LOAD **** ---
  // // This block automatically loads the default data for you.
  // function initializeApp() {
  //   // Put the default data into the text area
  //   jsonInput.value = JSON.stringify(defaultData, null, 2);
  //   // Set the currentData object to the default data
  //   currentData = defaultData;
  //   // Render the editor and the preview with the default data
  //   renderEditor(currentData);
  //   renderPreview(currentData);
  // }

  // initializeApp();

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

  function handleMarkup(text, dynamicColor, color) {
    if (typeof text !== "string") return text;

    return text.replace(/\*\*C(1|2)\[(.*?)\]C\1\*\*/g, (match, p1, p2) => {
      // If dynamicColor is false and a color value is given, apply the color directly.
      if (dynamicColor === false && color) {
        return `<span class="c${p1}" style="color: ${color};">${p2}</span>`;
      }
      // Otherwise, use the default class-based coloring.
      return `<span class="c${p1}">${p2}</span>`;
    });
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
    const insight = data.hormonal_balance_insight;
    const rootcause = data.root_cause_tags;
    const pillars = data.logged_patterns;
    const actionplan = data.actionable_next_steps;

    const svgHtmlHeading = createCircularSegmentedSVG({
      isEat: true,
      isMove: true,
      isSleep: true,
      isRecover: true,
      size: 50, // A smaller size might be better here
    });
    html += `
            <div class="report-section">
               <div class="report-title">
               ${svgHtmlHeading}
                 <h1>Monthly Health Report</h1>
               </div>
                <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}</span></p>
              </div>`;

    // Hormonal Balance Insight
    html += `
    <div>
            <div class="report-section-body">
                <div class="meta-info">
                  <span><strong>Designed By:</strong> Researchers,
Holistic <br/>Coaches, Clinicians</span>
                </div>
                
                <div class="report-section-content">
                  <div class="overview-summary">
                    <h3>Monthly overview summary</h3>
                    <div class="overview-content">
                      <p>${handleMarkup(overview.summary)}</p>
                    </div>
                  </div>

                  <div class="report-section-chart">
                      <h3>Your 4 Pillars Score</h3>
                      <div id="radarChartContainer">
                        <canvas id="radarChart"></canvas>
                      </div>
                  </div>
                  
                  ${
                    overview.top_symptoms && overview.top_symptoms.length > 0
                      ? `
                    <div class="top-symptoms">
                        <h3>Top symptoms</h3>
                        <div class="symptoms-wrapper">
                            <h3>Most reported symptoms this month</h3>
                            <div class="symptoms-list">
                                ${overview.top_symptoms
                                  .map(
                                    (symptom) =>
                                      `<div class="symtom-wrapper"><span class="symptom-tag">${
                                        symptom.charAt(0).toUpperCase() +
                                        symptom.slice(1)
                                      }</span></div>`
                                  )
                                  .join("")}
                            </div>
                        </div>
                    </div>
                    `
                      : ""
                  }

                  ${
                    overview.health_reflection
                      ? `
                    <div class="top-symptoms">
                        <h3>Health reflecition</h3>
                        <div class="symptoms-wrapper reflection-wrapper">
                            <p>${handleMarkup(
                              overview.health_reflection,
                              false,
                              "white"
                            )}</p>
                        </div>
                    </div>
                    `
                      : ""
                  }

                  ${
                    rootcause && rootcause.length > 0
                      ? `
                    <div class="top-symptoms">
                        <h3>Root cause</h3>
                        <div class="rootcause-wrapper">
                                   ${rootcause
                                     .map(
                                       (cause) => `
                                                    <div class="root-cause-card">
                                                      <h3>${cause.tag}</h3>
                                                      <p>${handleMarkup(
                                                        cause.explanation
                                                      )}</p>
                                                    </div>
                                                  `
                                     )
                                     .join("")}
                        </div>
                    </div>
                    `
                      : ""
                  }


                  ${
                    insight && insight.tied_to_logs.length > 0
                      ? `
                    
                      <div class="insight-wrapper">
                        <h2>Potentially imbalanced</h2>
                        ${insight.tied_to_logs
                          .map(
                            (log) => `
                              <div class="tied-log">
                                <img src="icons/polygon.svg" alt="Recommendation Icon" class="polygon">
                                <p>${handleMarkup(log)}</p>
                              </div>
                            `
                          )
                          .join("")}
                      </div>
                    `
                      : ""
                  }
                </div>
            </div>
                ${
                  pillars
                    ? `
                    <div class="pillars-wrapper">
                      ${Object.keys(pillars)
                        .map((pillarName) => {
                          const svgHtml = createCircularSegmentedSVG({
                            isEat: pillarName === "eat_well",
                            isSleep: pillarName === "sleep_well",
                            isMove: pillarName === "move_well",
                            isRecover: pillarName === "recover_well",
                            size: 50, // A smaller size might be better here
                          });

                          const metrics = pillars[pillarName].metrics;
                          const didwell = pillars[pillarName].did_well;
                          const losingbalance =
                            pillars[pillarName].areas_to_improve;
                          const recommendation =
                            pillars[pillarName].recommendations;
                          const guidance = pillars[pillarName].Guidance;

                          return `
                          <div class="pillar-content">
                            <div class="pillar-name">
                              <h4>${pillarName
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </h4>
                              ${svgHtml}
                            </div>
                              
                            ${
                              metrics
                                ? `
                                <div class="logged-summary">
                                    <h3>Logged summary</h3>
                                    <div class="pillar-metrics">
                                      ${Object.entries(metrics)
                                        .map(
                                          ([key, value]) => `
                                            <div class="matric">
                                              <p class="metric-key">${key
                                                .replace(/_/g, " ")
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                )}</p>
                                              <p class="metric-value">${value}</p>
                                            </div>
                                          `
                                        )
                                        .join("")}
                                    </div>
                                  </div>
                                `
                                : ""
                            }

                            ${
                              didwell
                                ? `
                                <div class="did-well">
                                    <div class="pillar-did-well">
                                    ${svgHtml}
                                      <h3>Did well (${didwell.length})</h3>
                                    </div>
                                    <div class="pillar-didwell">
                                      ${didwell
                                        .map(
                                          (value) => `
                                          <div class="didwell"><p>&bull;</p>
                                              <p>${handleMarkup(value)}</p>
                                              </div>
                                          `
                                        )
                                        .join("")}
                                    </div>
                                  </div>
                                `
                                : ""
                            }

                            ${
                              losingbalance
                                ? `
                                <div class="did-well">
                                    <div class="pillar-did-well">
                                    ${svgHtml}
                                      <h3>Losing balance (${
                                        losingbalance.length
                                      })</h3>
                                    </div>
                                    <div class="pillar-didwell">
                                      ${losingbalance
                                        .map(
                                          (value) => `
                                          <div class="didwell"><p>&bull;</p>
                                              <p>${handleMarkup(value)}</p>
                                              </div>
                                          `
                                        )
                                        .join("")}
                                    </div>
                                  </div>
                                `
                                : ""
                            }
                            ${
                              guidance
                                ? `
                                <div class="guidance">
                                    <div class="guidance-heading">
                                      <h3>Guidance</h3>
                                      <img src="icons/union.svg" alt="Recommendation Icon" >
                                    </div>
                                    <div class="pillar-didwell">
                                      ${guidance
                                        .map(
                                          (value) => `
                                          <div class="guidance-points"><p>&bull;</p>
                                              <p>${handleMarkup(
                                                value,
                                                false,
                                                "white"
                                              )}</p>
                                              </div>
                                          `
                                        )
                                        .join("")}
                                    </div>
                                  </div>
                                `
                                : ""
                            }
                            ${
                              recommendation
                                ? `
                                <div class="recommendation">
                                    <div class="recommendation-heading">
                                      <h3>Improve this</h3>
                                    </div>
                                    <div class="recommendation-content">
                                      ${recommendation
                                        .map(
                                          (value, index, array) => `
                                            <div class="recommendation-points ${
                                              index === array.length - 1
                                                ? ""
                                                : "border-added"
                                            }">
                                              <img src="icons/guidance.svg" alt="Recommendation Icon" >
                                              <p>${handleMarkup(value)}</p>
                                            </div>
                                          `
                                        )
                                        .join("")}
                                    </div>
                                  </div>
                                `
                                : ""
                            }
                          </div>
                        `;
                        })
                        .join("")}
                    </div>
                  `
                    : ""
                } 

            <div class="actionplan">
              <h3>Action plan</h3>
              <div class="actionplan-wrapper">
                ${Object.entries(actionplan)
                  .filter(([key]) => key !== "encouragement_message")
                  .map(
                    ([key, points]) => `
                                        <div class="action-category">
                                          <h3>${key
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, (l) => l.toUpperCase())}</h3>
                                          <div class="action-points">
                                            ${points.map((point) => `<p>${handleMarkup(point)}</p>`).join("")}
                                          </div>
                                        </div>
                                      `
                  )
                  .join("")}
              </div>
            </div>
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
            backgroundColor: "#02393666", // Teal fill
            borderColor: "#023936", // Teal line
            // --- UPDATED: Increased border width to make rounding visible ---
            borderWidth: 3,
            // --- UPDATED: This property rounds the corners where lines meet ---
            borderJoinStyle: "round",
            // --- UPDATED: Ensure lines are straight ---
            tension: 0,
            // --- To hide the dots ---
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
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
            ticks: {
              display: false,
              stepSize: 2, // Keep the logic for ring creation
            },
            // Keep the concentric grid lines
            grid: {
              color: "rgba(0, 0, 0, 0.08)",
              lineWidth: 2,
            },
            pointLabels: {
              font: {
                size: 20,
              },
              color: "#A1A9BC",
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
          },
        },
        maintainAspectRatio: false,
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

/**
 * Creates and returns an SVG string for the circular segmented border.
 * This function ONLY returns the SVG code as a string.
 *
 * @param {object} options - Configuration for the component.
 * @param {boolean} [options.isSleep=false] - Whether the sleep segment is active.
 * @param {boolean} [options.isEat=false] - Whether the eat segment is active.
 * @param {boolean} [options.isMove=false] - Whether the move segment is active.
 * @param {boolean} [options.isRecover=false] - Whether the recover segment is active.
 * @param {number} [options.size=200] - The width and height of the component in pixels.
 * @returns {string} The SVG code as an HTML string.
 */
function createCircularSegmentedSVG(options = {}) {
  const {
    isSleep = false,
    isEat = false,
    isMove = false,
    isRecover = false,
    size = 200,
  } = options;

  // Generate and return the SVG string with dynamic opacity values
  return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 30 31" fill="none">
            <path opacity="${
              isRecover ? "1.0" : "0.2"
            }" d="M4.46972 17.1495H0C0.52115 26.0347 7.49153 30.2434 13.0939 30.2434V26.0347C6.0793 24.6317 4.67638 19.9554 4.46972 17.1495Z" fill="url(#paint0_linear_4025_22473)"/>
            <path opacity="${
              isMove ? "1.0" : "0.2"
            }" d="M25.5303 17.1495H30C29.4789 26.0347 22.5085 30.2434 16.9061 30.2434V26.0347C23.9207 24.6317 25.3236 19.9554 25.5303 17.1495Z" fill="url(#paint1_linear_4025_22473)"/>
            <path opacity="${
              isEat ? "1.0" : "0.2"
            }" d="M25.5303 13.6073L30 13.6073C29.4789 4.72217 22.5085 0.513428 16.9061 0.513428L16.9061 4.72217C23.9207 6.12509 25.3236 10.8015 25.5303 13.6073Z" fill="url(#paint2_linear_4025_22473)"/>
            <path opacity="${
              isSleep ? "1.0" : "0.2"
            }" d="M4.46972 13.6073L0 13.6073C0.52115 4.72217 7.49153 0.513429 13.0939 0.51343L13.0939 4.72217C6.0793 6.12509 4.67638 10.8015 4.46972 13.6073Z" fill="url(#paint3_linear_4025_22473)"/>
            <defs>
                <linearGradient id="paint0_linear_4025_22473" x1="6.54694" y1="17.1495" x2="6.54694" y2="30.2434" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#023936"/>
                    <stop offset="0.57" stop-color="#5E163C"/>
                    <stop offset="0.975" stop-color="#637993"/>
                </linearGradient>
                <linearGradient id="paint1_linear_4025_22473" x1="23.4531" y1="17.1495" x2="23.4531" y2="30.2434" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#023936"/>
                    <stop offset="0.57" stop-color="#5E163C"/>
                    <stop offset="0.975" stop-color="#637993"/>
                </linearGradient>
                <linearGradient id="paint2_linear_4025_22473" x1="23.4531" y1="13.6073" x2="23.4531" y2="0.513428" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#023936"/>
                    <stop offset="0.57" stop-color="#5E163C"/>
                    <stop offset="0.975" stop-color="#637993"/>
                </linearGradient>
                <linearGradient id="paint3_linear_4025_22473" x1="6.54694" y1="13.6073" x2="6.54694" y2="0.513429" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#023936"/>
                    <stop offset="0.57" stop-color="#5E163C"/>
                    <stop offset="0.975" stop-color="#637993"/>
                </linearGradient>
            </defs>
        </svg>
    `;
}
