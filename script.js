document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const jsonInput = document.getElementById("json-input");
  const loadButton = document.getElementById("load-button");
  const downloadButton = document.getElementById("download-button");
  const editorFormContainer = document.getElementById("editor-form-container");
  const pdfPreview = document.getElementById("pdf-preview");
  const tabButtons = document.querySelectorAll(".tab-button");

  let currentData = {};
  let activeTab = "biomarkers"; // Default active tab
  let pillarChartInstance = null;

  // --- Event Listeners ---
  loadButton.addEventListener("click", handleLoadData);
  downloadButton.addEventListener("click", handleDownloadPdf);

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab;
      updateActiveTab();
      renderContentForActiveTab();
    });
  });

  function updateActiveTab() {
    tabButtons.forEach((button) => {
      if (button.dataset.tab === activeTab) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  function renderContentForActiveTab() {
    switch (activeTab) {
      case "biomarkers":
        renderBiomarkersPreview(currentData);
        break;
      case "4pillars":
        render4PillarsPreview(currentData);
        break;
      case "supplements":
        renderSupplementsPreview(currentData);
        break;
      default:
        pdfPreview.innerHTML =
          '<div class="placeholder"><p>No data to preview.</p></div>';
    }
  }

  function handleLoadData() {
    try {
      const rawText = jsonInput.value;
      if (!rawText.trim()) {
        alert("Please paste your JSON data first.");
        return;
      }
      currentData = JSON.parse(rawText);
      renderEditor(currentData);
      renderContentForActiveTab(); // Render content for the active tab
    } catch (error) {
      alert(`Invalid JSON format: ${error.message}`);
      editorFormContainer.innerHTML = "";
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>Could not load data. Please check your JSON for errors.</p></div>';
    }
  }

  // --- **** PDF DOWNLOAD FUNCTION Using html-to-image **** ---
  function handleDownloadPdf() {
    const element = document.getElementById("pdf-preview");
    const downloadBtn = document.getElementById("download-button");

    downloadBtn.textContent = "Generating...";
    downloadBtn.disabled = true;

    // --- OPTIMIZATION 1: Switch from .toPng to .toJpeg and set quality ---
    // JPEG is much better for file size than PNG. A quality of 0.9 provides
    // great compression with almost no noticeable difference in visual quality.
    htmlToImage
      .toJpeg(element, {
        backgroundColor: "#ffffff",
        quality: 1,
        pixelRatio: 3,
      })
      .then(function (dataUrl) {
        const { jsPDF } = window.jspdf;
        const img = new Image();
        img.src = dataUrl;

        img.onload = function () {
          const imgWidth = this.width;
          const imgHeight = this.height;
          const pdfWidth = 595.28; // A4 width in points
          const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

          const doc = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: [pdfWidth, pdfHeight],
          });

          // --- OPTIMIZATION 2: Change the image format to "JPEG" ---
          doc.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
          doc.save(`${activeTab}-analysis.pdf`);
        };
      })
      .catch(function (error) {
        console.error("PDF Generation failed!", error);
        alert("Could not generate PDF. Please check the console for errors.");
      })
      .finally(() => {
        downloadBtn.textContent = "Download as PDF";
        downloadBtn.disabled = false;
      });
  }

  function handleMarkup(text) {
    if (typeof text !== "string") return text;
    return text.replace(
      /\*\*C(1|2)\[(.*?)\]C\1\*\*/g,
      (match, p1, p2) => `<span class="c${p1}">${p2}</span>`
    );
  }

  function render4PillarsPreview(data) {
    if (!data || !data.four_pillars || !data.four_pillars.pillars) {
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>No 4 Pillars data to preview.</p></div>';
      return;
    }

    const pillarsData = data.four_pillars;
    const pillars = pillarsData.pillars;
    const pillarLabels = pillars.map((p) => p.name);
    const scores = pillars.map((p) => p.score);

    // Calculate Summary
    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    let summary = {};
    if (averageScore >= 9) {
      summary = {
        status: "Aligned",
        message: "Your habits are strongly supporting hormonal balance.",
      };
    } else if (averageScore >= 7) {
      summary = {
        status: "On Track",
        message: "You're doing well — just a few small tweaks will help.",
      };
    } else if (averageScore >= 5) {
      summary = {
        status: "Needs Alignment",
        message: "Some areas need attention to restore balance.",
      };
    } else {
      summary = {
        status: "Imbalance",
        message: "Several routines may be contributing to imbalance.",
      };
    }

    // Build HTML Structure
    let html = `
      <div class="report-header">
          <h1>Holistic Health</h1>
          <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric", year: "numeric" }
          )}</span></p>
      </div>
      <div class="report-section">
          <div class="biomarker-warraper pillers-wrapper">
              <div class="meta-info">
              <span><strong>Designed By:</strong> Researchers,
Holistic coaches, Clinicians</span>
              </div>
              <h4>Introduction</h4>
              ${
                pillarsData.introduction
                  ? `<p class="pillar-intro">${handleMarkup(
                      pillarsData.introduction
                    )}</p>`
                  : ""
              }
              <div class="pillars-chart-container">
                <h3>Your 4 Pillars Score</h3>
                <div class="pillars-chart-wrapper">
                    <canvas id="pillars-chart"></canvas>
                </div>
                <div class="pillars-summary status-${summary.status
                  .toLowerCase()
                  .replace(" ", "-")}">
                  <span class="status-dot"></span>
                  <p><span>${summary.status}:</span> ${summary.message}</p>
                </div>
              </div>
          </div>
          <div class="pillar-header">
                  <h4>Four pillars analysis</h4>
          </div>
          <!-- four pillers -->`;

    if (pillarsData.pillars && pillarsData.pillars.length > 0) {
      html += pillarsData.pillars
        .map((pillar) => {
          // Generate the SVG for the current pillar
          const svgHtml = createCircularSegmentedSVG({
            isEat: pillar.name === "Eat Well",
            isMove: pillar.name === "Move Well",
            isSleep: pillar.name === "Sleep Well",
            isRecover: pillar.name === "Recover Well",
            size: 40, // A smaller size might be better here
          });

          function getCaption(score) {
            if (score >= 9.0) {
              return "Strongly Aligned";
            }
            if (score >= 7.0) {
              return "On Track";
            }
            if (score >= 4.0) {
              return "Needs Attention";
            }
            return "Imbalance Likely";
          }

          // Return the HTML structure with the pillar name and its corresponding SVG
          return `
        <div class="pillar-wrapper">
          <div class="pillar-seciton-one">
            <div class="pillar-name-svg">
              <h4>${pillar.name}</h4>
              ${svgHtml}  
            </div>
            <div class="why-pillar">
              <h4>Why This Pillar Matters:</h4>
              <p>${handleMarkup(pillar.why_it_matters)}</p>
            </div>
            <div class="why-pillar pillar-status">
              <h4>${pillar.name} - ${getCaption(pillar.score)}(${
            pillar.score
          }/10)
              </h4>
              <div class="score-why-list">
                ${
                  pillar.score_rationale
                    .map(
                      (rationale) =>
                        `<div class="scroe-points"><span>•</span><p> ${handleMarkup(
                          rationale
                        )}</p></div>`
                    )
                    .join("") // .join('') combines them all into a single block of HTML
                }
              </div>
            </div>
            
            <div class="personal-recommnedation">
                <div class="heading-section">
                  <h4>Personalized Recommendations</h4>
                  <img src="icons/recommendation.svg" alt="Recommendation Icon" class="inline-icon">
                </div>
                <div class="recommnedation-list">
                ${
                  pillar.personalized_recommendations
                    .map(
                      (rationale) =>
                        `<div><span>•</span><p> ${handleMarkup(
                          rationale
                        )}</p></div>`
                    )
                    .join("") // .join('') combines them all into a single block of HTML
                }
               </div>
            </div>

          </div>

            <div class="pillar-seciton-two">
                <div class="heading-section">
                  <h4>Root Cause</h4>
                  <img src="icons/rootcause.svg" alt="Recommendation Icon" class="inline-icon">
                </div>
                <div class="recommnedation-list">
              <p>${handleMarkup(pillar.root_cause_correlation)}</p>
               </div>
            </div>

            <div class="pillar-seciton-two">
                <div class="heading-section">
                  <h4>Science-Based Explanation</h4>
                  <img src="icons/scibasedexp.svg" alt="Recommendation Icon" class="inline-icon">
                </div>
                <div class="recommnedation-list">
              <p>${handleMarkup(pillar.science_based_explanation)}</p>
               </div>
            </div>

<div class="pillar-seciton-two">
    <div class="heading-section">
        <h4>Guidance</h4>
        <img src="icons/guidance.svg" alt="Recommendation Icon" class="inline-icon">
    </div>
    <div class="recommnedation-list guidance-section">
        
        ${
          // First, check if additional_guidance and its description exist before rendering
          pillar.additional_guidance && pillar.additional_guidance.description
            ? `<p>${handleMarkup(pillar.additional_guidance.description)}</p>`
            : ""
        }
        <div class="guidance-wrapper">
        ${
          // Now, check if the structure exists to render the categories
          pillar.additional_guidance && pillar.additional_guidance.structure
            ? // Loop over each key in the structure object (e.g., 'recommended_foods', 'cautious_foods')
              Object.keys(pillar.additional_guidance.structure)
                .map((key) => {
                  const items = pillar.additional_guidance.structure[key];

                  // Don't render anything if a category is empty
                  if (!items || items.length === 0) return "";

                  // Create a readable title from the object key (e.g., "Recommended Foods")
                  const title = key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  // Return a container for the category
                  return `
                <div class="guidance-category">
                  <h5>${title}</h5>
                  ${
                    // Map over the items in the category array
                    items
                      .map(
                        (item) =>
                          // Create a <p> tag for each item with its name and description
                          `<p><span>${handleMarkup(
                            item.name
                          )}:</span> ${handleMarkup(item.description)}</p>`
                      )
                      .join("")
                  }
                </div>
              `;
                })
                .join("")
            : "" // If no structure exists, render nothing
        }
        </div>
    </div>
</div>

        </div>
      `;
        })
        .join("");
    }

    html += `</div>`;

    pdfPreview.innerHTML = html;

    // Create the Radar Chart
    const ctx = document.getElementById("pillars-chart");
    if (ctx) {
      // Destroy previous chart instance if it exists
      if (window.pillarChartInstance) {
        window.pillarChartInstance.destroy();
      }
      window.pillarChartInstance = new Chart(ctx, {
        type: "radar",
        data: {
          labels: pillarLabels,
          datasets: [
            {
              label: "Pillar Score",
              data: scores,
              backgroundColor: "#02393666", // Teal fill
              borderColor: "#023936", // Teal line
              // --- UPDATED: Increased border width to make rounding visible ---
              borderWidth: 2,
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
          scales: {
            r: {
              // --- To hide the axis lines (spokes) ---
              angleLines: {
                display: false,
              },
              // --- To hide the number labels ---
              ticks: {
                display: false,
                stepSize: 2, // Keep the logic for ring creation
              },
              // Keep the concentric grid lines
              grid: {
                color: "rgba(0, 0, 0, 0.08)",
                lineWidth: 1,
              },
              pointLabels: {
                font: {
                  size: 12,
                },
                color: "#A1A9BC",
              },
              suggestedMin: 0,
              suggestedMax: 10,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  }

  function renderSupplementsPreview(data) {
    if (!data || !data.supplements || !data.action_plan) {
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>No Supplements or Action Plan data to preview.</p></div>';
      return;
    }

    const supplements = data.supplements;
    const actionPlan = data.action_plan;

    const recommendationsHtml = supplements.structure.recommendations
      .map(
        (rec) => `
        <div class="supplement-recommendation-card">
            <h4>${rec.name}</h4>
            <div><span>Rationale:</span><p> ${handleMarkup(
              rec.rationale
            )}</p></div>
            <div><span>Expected Outcomes:</span><p> ${handleMarkup(
              rec.expected_outcomes
            )}</p></div>
            <div><span>Dosage & Timing:</span><p> ${handleMarkup(
              rec.dosage_and_timing
            )}</p></div>
            <div><span>Situational/Cyclical Considerations:</span><p> ${handleMarkup(
              rec.situational_cyclical_considerations
            )}</p></div>
        </div>
      `
      )
      .join("");

    let html = `
              <div class="report-header">
                <h1>Suppliment & Action Plan</h1>
                <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}</span></p>
              </div>
              <div class="biomarker-warraper pillers-wrapper suppliment-wrapper">
                <div class="meta-info">
                  <span><strong>Designed By:</strong> Researchers,
Holistic coaches, Clinicians</span>
                </div>
                <h4>Introduction</h4>
                  ${
                    supplements.description
                      ? `<p class="pillar-intro">${handleMarkup(
                          supplements.description
                        )}</p>`
                      : ""
                  }
              </div>
              <div class="recommendations-container">
                ${recommendationsHtml}
              </div>
              <div class="biomarker-warraper pillers-wrapper suppliment-wrapper action-wrapper">
                <h4>Introduction</h4>
                  ${
                    actionPlan.description
                      ? `<p class="pillar-intro">${handleMarkup(
                          actionPlan.description
                        )}</p>`
                      : ""
                  }
              </div>
              <div class="action-plan-details">
                ${Object.keys(actionPlan.structure)
                  .map((key) => {
                    const items = actionPlan.structure[key];
                    if (!items || items.length === 0) return "";
                    const title = key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());
                    return `
                      <div class="action-plan-category">
                        <h5>${title}</h5>
                        ${items
                          .map(
                            (item) => `
                          <div class="action-item">
                            <span class="bullet">•</span>
                            <p>${handleMarkup(item)}</p>
                          </div>
                        `
                          )
                          .join("")}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
    `;

    pdfPreview.innerHTML = html;
  }

  // --- RENDER PREVIEW (No changes needed here) ---
  function renderBiomarkersPreview(data) {
    if (!data || !data.lab_analysis) {
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>No data to preview.</p></div>';
      return;
    }

    let html = "";
    const lab = data.lab_analysis;

    html += `
         <div class="report-header">
               <h1>Biomarker Analysis</h1>
               <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
                 "en-US",
                 { month: "long", day: "numeric", year: "numeric" }
               )}</span></p>
         </div>`;

    html += `<div class="report-section">`;

    // --- Bar Chart Summary (Stays on first page) ---
    if (lab.biomarker_categories_summary) {
      const summary = lab.biomarker_categories_summary;
      const totalBiomarkers =
        summary.optimal_count +
        summary.keep_in_mind_count +
        summary.attention_needed_count;

      html += `
       <div class="biomarker-chart-container">
           <div class="biomarker-warraper">
                 <div class="meta-info">
                 <span><strong>Designed By:</strong> Researchers,
Holistic coaches, Clinicians</span>
                 </div>`;

      // Only show the biomarker count and chart if there are biomarkers
      if (totalBiomarkers > 0) {
        const maxCount = Math.max(
          1,
          summary.optimal_count,
          summary.keep_in_mind_count,
          summary.attention_needed_count
        );
        const optimalHeight = (summary.optimal_count / maxCount) * 180 + 15;
        const mindHeight = (summary.keep_in_mind_count / maxCount) * 180 + 15;
        const attentionHeight =
          (summary.attention_needed_count / maxCount) * 180 + 15;

        html += `
                   <h3>${totalBiomarkers} Biomarkers</h3>
                   <div class="chart-wrapper">
                         <div class="chart-area">
                               <div class="chart-bar-group"><div class="bar-label">${summary.optimal_count}</div><div class="bar-title">In Range</div><div class="bar optimal" style="height: ${optimalHeight}px;"></div></div>
                               <div class="chart-bar-group"><div class="bar-label">${summary.keep_in_mind_count}</div><div class="bar-title">Attention Needed</div><div class="bar mind" style="height: ${mindHeight}px;"></div></div>
                               <div class="chart-bar-group"><div class="bar-label">${summary.attention_needed_count}</div><div class="bar-title">Out of Range</div><div class="bar attention" style="height: ${attentionHeight}px;"></div></div>
                         </div>
                   </div>`;
      }

      // Always show the description and overall summary
      html += `
                   <p class="chart-summary">${handleMarkup(
                     summary.description_text
                   )}</p>
                   <h4>Overall Health Summary</h4>
                   <p>${handleMarkup(lab.overall_summary)}</p>
             </div>
       </div>`;
    }

    if (lab.detailed_biomarkers && lab.detailed_biomarkers.length > 0) {
      const summary = lab.biomarker_categories_summary;
      html += `
                   <div class="categories-wrapper page-break-before">
                         <h4>Categories</h4>
                         <div class="categoris-value">
                               <div class="categoris-value-right">
                                     <div class="missing-info-container"><div class="circular-indicatorO"></div><span>In Range:</span><span>${summary.optimal_count}</span></div>
                                     <div class="missing-info-container"><div class="circular-indicatorK"></div><span>Keep In Mind:</span><span>${summary.keep_in_mind_count}</span></div>
                                     <div class="missing-info-container"><div class="circular-indicatorA"></div><span>Out Of Range:</span><span>${summary.attention_needed_count}</span></div>
                               </div>
                               <div class="categoris-value-left">
                                     <div class="missing-info-container"><div class="circular-indicatorM"></div><span>Missing:</span><span>${lab.crucial_biomarkers_to_measure.length}</span></div>
                               </div>
                         </div>
                   </div>`;

      html += `<div class="biomarkers-container">
                   ${lab.detailed_biomarkers
                     .map((bm, index) => {
                       const resultParts = bm.result.split(/ (.*)/s);
                       const value = resultParts[0];
                       const unit = resultParts[1] || "";
                       const pageBreakClass =
                         index > 0 ? "page-break-before" : "";
                       const firstCardClass =
                         index === 0 ? "first-biomarker-card" : "";

                       return `
                   <div class="biomarker-card status-${
                     bm.status
                   } ${pageBreakClass} ${firstCardClass}">
                         <div class="biomarker-header"><h5>${bm.name}</h5></div>
                         <div class="biomarker-result-div"><div class="circular-indicator-${
                           bm.status
                         }"></div><span class="biomarker-result">${
                         bm.result
                       }</span></div>
                         <div class="biomarker-box-card biomarker-box-card-${
                           bm.status
                         }">
                               <h5>${bm.name}</h5>
                               <p>Range: ${bm.range}</p>
                               <div class="result-show"><h1 class="result-value-${
                                 bm.status
                               }">${value}</h1><span class="result-unit-${
                         bm.status
                       }">${unit}</span></div>
                               <div class="range-show"><div class="range-indicator range-indicator-${
                                 bm.status
                               }"></div><div class="range-content"><p>${
                         bm.status_label
                       }</p><p class="last-update">${new Date().toLocaleDateString(
                         "en-US",
                         { month: "long", day: "numeric", year: "numeric" }
                       )}</p></div></div>
                         </div>
                         <h4>Cycle Impact</h4>
                         <p class="p-grey">${handleMarkup(bm.cycle_impact)}</p>
                         <h4>Why It Matters</h4>
                         <p class="p-grey">${handleMarkup(
                           bm.why_it_matters
                         )}</p>
                   </div>`;
                     })
                     .join("")}
             </div>`;
    }

    if (
      lab.crucial_biomarkers_to_measure &&
      lab.crucial_biomarkers_to_measure.length > 0
    ) {
      html += `
                   <div class="categories-wrapper crucial page-break-before">
                         <h4>Crucial Biomerkers to Measure</h4>
                         <div class="biomarkers-container">
                               ${lab.crucial_biomarkers_to_measure
                                 .map(
                                   (bm) => `
                               <div class="crucial-ind">
                                     <p class="crucial-name">${bm.name}</p>
                                     <p class="p-grey">${handleMarkup(
                                       bm.importance
                                     )}</p>
                               </div>`
                                 )
                                 .join("")}
                         </div>
                   </div>`;
    }

    if (
      lab.health_recommendation_summary &&
      lab.health_recommendation_summary.length > 0
    ) {
      html += `
                   <div class="categories-wrapper ${
                     lab.crucial_biomarkers_to_measure.length > 5
                       ? "page-break-before"
                       : ""
                   }">
                         <h4>Health Recommendation Summary</h4>
                         <div class="biomarkers-container">
                               ${lab.health_recommendation_summary
                                 .map((bm) => `<p>${handleMarkup(bm)}</p>`)
                                 .join("")}
                         </div>
                   </div>`;
    }

    html += `</div>`;
    pdfPreview.innerHTML = html;
  }

  // --- (The rest of the helper functions for the editor remain unchanged) ---
  function renderEditor(data) {
    editorFormContainer.innerHTML = "";
    buildFormSection(data, "", editorFormContainer);
  }

  function buildFormSection(data, path, parentElement) {
    for (const key in data) {
      const currentPath = path ? `${path}.${key}` : key;
      const value = data[key];
      if (typeof value === "string") {
        parentElement.appendChild(
          createField(currentPath, value, key, "textarea")
        );
      } else if (typeof value === "number") {
        parentElement.appendChild(createField(currentPath, value, key, "text"));
      } else if (Array.isArray(value)) {
        const fieldset = createFieldset(key);
        value.forEach((item, index) => {
          const itemPath = `${currentPath}[${index}]`;
          if (typeof item === "string") {
            fieldset.appendChild(
              createField(itemPath, item, `${key} #${index + 1}`, "textarea")
            );
          } else if (typeof item === "object" && item !== null) {
            const itemFieldset = createFieldset(
              item.name || `${key.replace(/s$/, "")} #${index + 1}`
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
      updateDataObject(path, e.target.value);
      renderContentForActiveTab();
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
