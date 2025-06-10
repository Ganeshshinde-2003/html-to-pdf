document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const jsonInput = document.getElementById("json-input");
  const loadButton = document.getElementById("load-button");
  const downloadButton = document.getElementById("download-button");
  const editorFormContainer = document.getElementById("editor-form-container");
  const pdfPreview = document.getElementById("pdf-preview");

  let currentData = {};
  let radarChartInstance = null; // To hold the chart instance

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

  function handleDownloadPdf() {
    const element = document.getElementById("pdf-preview");
    const downloadBtn = document.getElementById("download-button");
    const canvas = document.getElementById("radarChart");
    const chartImage = document.getElementById("chartImage");

    downloadBtn.textContent = "Generating...";
    downloadBtn.disabled = true;

    // Temporarily replace canvas with a static image for PDF generation
    if (radarChartInstance) {
      chartImage.src = radarChartInstance.toBase64Image();
      canvas.style.display = "none";
      chartImage.style.display = "block";
    }

    // Use the htmlToImage method as you specified
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

          doc.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
          doc.save(`Monthly_Report.pdf`);
        };
      })
      .catch(function (error) {
        console.error("PDF Generation failed!", error);
        alert("Could not generate PDF. Please check the console for errors.");
      })
      .finally(() => {
        downloadBtn.textContent = "Download as PDF";
        downloadBtn.disabled = false;

        // Revert back to the interactive canvas after PDF is saved
        if (radarChartInstance) {
          canvas.style.display = "block";
          chartImage.style.display = "none";
        }
      });
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
