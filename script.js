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

  // --- **** PDF DOWNLOAD FUNCTION Using html-to-image **** ---
  function handleDownloadPdf() {
    const element = document.getElementById("pdf-preview");
    const downloadBtn = document.getElementById("download-button");

    downloadBtn.textContent = "Generating...";
    downloadBtn.disabled = true;

    // Call the new htmlToImage library
    htmlToImage
      .toPng(element, { backgroundColor: "#ffffff", quality: 1.0 })
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

          doc.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
          doc.save("biomarker-analysis.pdf");
        };
      })
      .catch(function (error) {
        console.error("PDF Generation failed!", error);
        alert("Could not generate PDF. Please check the console for errors.");
      })
      .finally(() => {
        // This block ensures the button is always reset
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

  // --- RENDER PREVIEW (No changes needed here) ---
  function renderPreview(data) {
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
             <div class="meta-info"><span><strong>User:</strong> PUR GANESH</span><span><strong>Designed By:</strong> PUR GANESH</span></div>`;

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
                 const pageBreakClass = index > 0 ? "page-break-before" : "";
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
                     <p class="p-grey">${handleMarkup(bm.why_it_matters)}</p>
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
