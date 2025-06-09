document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const jsonInput = document.getElementById("json-input");
  const loadButton = document.getElementById("load-button");
  const downloadButton = document.getElementById("download-button");
  const editorFormContainer = document.getElementById("editor-form-container");
  const pdfPreview = document.getElementById("pdf-preview");

  let currentData = {};

  // --- Event Listeners ---
  loadButton.addEventListener("click", handleLoadData);
  downloadButton.addEventListener("click", handleDownloadPdf);

  // ... (handleLoadData and other functions remain the same) ...
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

  // --- **** THIS IS THE UPDATED FUNCTION **** ---
// In script.js, please replace the entire handleDownloadPdf function with this one.

function handleDownloadPdf() {
  const element = document.getElementById("pdf-preview");

  // Get the dynamic height of the content to create one long page.
  const contentHeight = element.scrollHeight;

  // Set a standard, stable width for the PDF (A4 width in points).
  // This will prevent the layout from collapsing and overlapping.
  const fixedWidth = 595;

  const options = {
    margin: 0,
    filename: "Biomarker_Analysis_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, letterRendering: true },
    jsPDF: {
      unit: "pt",
      // Use our STABLE fixed width and the DYNAMIC long page height.
      format: [fixedWidth, contentHeight],
      orientation: "portrait",
    },
  };

  html2pdf().set(options).from(element).save();
}

  function handleMarkup(text) {
    if (typeof text !== "string") return text;
    return text.replace(
      /\*\*C(1|2)\[(.*?)\]C\1\*\*/g,
      (match, p1, p2) => `<span class="c${p1}">${p2}</span>`
    );
  }

  // --- RENDER PREVIEW --- (No changes needed here from before)
  function renderPreview(data) {
    if (!data || !data.lab_analysis) {
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>No data to preview.</p></div>';
      return;
    }

    let html = "";
    const lab = data.lab_analysis;

    // --- Report Header ---
    html += `
            <div class="report-header">
                <h1>Biomarker Analysis</h1>
                <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}</span></p>
            </div>`;

    // --- Lab Analysis Section ---
    html += `<div class="report-section">`;

    // Bar Chart Summary
    if (lab.biomarker_categories_summary) {
      const summary = lab.biomarker_categories_summary;
      const totalBiomarkers =
        summary.optimal_count +
        summary.keep_in_mind_count +
        summary.attention_needed_count;

      const maxCount = Math.max(
        1,
        summary.optimal_count,
        summary.keep_in_mind_count,
        summary.attention_needed_count
      );

      const optimalHeight = (summary.optimal_count / maxCount) * 280 + 15;
      const mindHeight = (summary.keep_in_mind_count / maxCount) * 280 + 15;
      const attentionHeight =
        (summary.attention_needed_count / maxCount) * 280 + 15;
      html += `
                <div class="biomarker-chart-container">
                    <div class="biomarker-warraper">
                     <div class="meta-info">
                         <span><strong>User:</strong> PUR GANESH</span>
                         <span><strong>Designed By:</strong> PUR GANESH</span>
                     </div>
                    <h3>${totalBiomarkers} Biomarkers</h3>
                    <div class="chart-wrapper">
                        <div class="chart-area">
                            <div class="chart-bar-group">
                                <div class="bar-label">${
                                  summary.optimal_count
                                }</div>
                                <div class="bar-title">In Range</div>
                                <div class="bar optimal" style="height: ${optimalHeight}px;"></div>
                            </div>
                            <div class="chart-bar-group">
                                <div class="bar-label">${
                                  summary.keep_in_mind_count
                                }</div>
                                <div class="bar-title">Attention Needed</div>
                                <div class="bar mind" style="height: ${mindHeight}px;"></div>
                            </div>
                            <div class="chart-bar-group">
                                <div class="bar-label">${
                                  summary.attention_needed_count
                                }</div>
                                <div class="bar-title">Out of Range</div>
                                <div class="bar attention" style="height: ${attentionHeight}px;"></div>
                            </div>
                        </div>
                    </div>
                       <p class="chart-summary">${handleMarkup(
                         summary.description_text
                       )}</p>
                       <h4>Overall Health Summary</h4>
                     <p>${handleMarkup(lab.overall_summary)}</p>
                     </div>
                </div>
            `;
    }

    // Detailed Biomarker Cards
    if (lab.detailed_biomarkers && lab.detailed_biomarkers.length > 0) {
      const summary = lab.biomarker_categories_summary;
      const optimal_count = summary.optimal_count;
      const keep_in_mind_count = summary.keep_in_mind_count;
      const attention_needed_count = summary.attention_needed_count;
      const missing = lab.crucial_biomarkers_to_measure.length;

      html += `
      <div class="categories-wrapper">
              <h4>Categories</h4>
              <div class="categoris-value">
              <div class="categoris-value-right">
                  <div class="missing-info-container">
                  <div class="circular-indicatorO"></div>
                  <span>In Range:</span>
                  <span id="missing-count">${optimal_count}</span>
                  </div> 
                  <div class="missing-info-container">
                  <div class="circular-indicatorK"></div>
                  <span>Keep In Mind:</span>
                  <span id="missing-count">${keep_in_mind_count}</span>
                  </div> 
                  <div class="missing-info-container">
                  <div class="circular-indicatorA"></div>
                  <span>Out Of Range:</span>
                  <span id="missing-count">${attention_needed_count}</span>
                  </div>
               </div> 
              <div class="categoris-value-left">
                  <div class="missing-info-container">
                  <div class="circular-indicatorM"></div>
                  <span>Missing:</span>
                  <span id="missing-count">${missing}</span>
                  </div> 
              </div>
              </div>
              <div class="biomarkers-container">
                ${lab.detailed_biomarkers
                  .map((bm) => {
                    const resultParts = bm.result.split(/ (.*)/s);
                    const value = resultParts[0];
                    const unit = resultParts[1] || "";
                    return `
      <div class="biomarker-card status-${bm.status}"> 
          <div class="biomarker-header">
              <h5>${bm.name}</h5>
          </div>
          <div class="biomarker-result-div">
              <div class="circular-indicator-${bm.status}"></div>
              <span class="biomarker-result">${bm.result}</span>
          </div>
          <div class="biomarker-box-card biomarker-box-card-${bm.status}">
              <h5>${bm.name}</h5>
              <p>Range: ${bm.range}</p>
              <div class="result-show">
                <h1 class="result-value-${bm.status}">${value}</h1>
                <span class="result-unit-${bm.status}">${unit}</span>
              </div>
              <div class="range-show">
                <div class="range-indicator range-indicator-${bm.status}"></div>
                <div class="range-content">
                  <p>${bm.status_label}</p>
                  <p class="last-update">${new Date().toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" }
                  )}</p>
                </div>
              </div>
          </div>
          <h4>Cycle Impact</h4>
          <p class="p-grey"> ${handleMarkup(bm.cycle_impact)}</p>
          <h4>Why It Matters</h4>
          <p class="p-grey"> ${handleMarkup(bm.why_it_matters)}</p>
      </div>
    `;
                  })
                  .join("")}
              </div> </div>`;
    }

    // Crucial Biomarkers & Health Recommendations
    if (
      lab.crucial_biomarkers_to_measure &&
      lab.crucial_biomarkers_to_measure.length > 0
    ) {
      html += `
      <div class="categories-wrapper crucial">
          <h4>Crucial Biomerkers to Measure</h4>
          <div class="biomarkers-container">
            ${lab.crucial_biomarkers_to_measure
              .map((bm) => {
                return `
                  <div class="">
                    <div class="crucial-ind">
                      <p class="crucial-name">${bm.name}</p>
                      <p class="p-grey"> ${handleMarkup(bm.importance)}</p>
                    </div>
                  </div>`;
              })
              .join("")}
          </div> </div>`;
    }

    if (
      lab.health_recommendation_summary &&
      lab.health_recommendation_summary.length > 0
    ) {
      html += `
      <div class="categories-wrapper">
          <h4>Health Recommendation Summary</h4>
          <div class="biomarkers-container">
            ${lab.health_recommendation_summary
              .map((bm) => `<p> ${handleMarkup(bm)}</p>`)
              .join("")}
          </div> </div>`;
    }

    html += `</div>`; // End .report-section
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
