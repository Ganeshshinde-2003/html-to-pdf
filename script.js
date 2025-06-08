document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const jsonInput = document.getElementById('json-input');
    const loadButton = document.getElementById('load-button');
    const downloadButton = document.getElementById('download-button');
    const editorFormContainer = document.getElementById('editor-form-container');
    const pdfPreview = document.getElementById('pdf-preview');

    let currentData = {}; // Global variable to hold the parsed JSON data

    // --- Event Listeners ---
    loadButton.addEventListener('click', handleLoadData);
    downloadButton.addEventListener('click', handleDownloadPdf);

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
            editorFormContainer.innerHTML = '';
            pdfPreview.innerHTML = '<div class="placeholder"><p>Could not load data. Please check your JSON for errors.</p></div>';
        }
    }

    function handleDownloadPdf() {
        const element = document.getElementById('pdf-preview');
        const options = {
            margin:       0.5,
            filename:     'Health_Report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save();
    }

    function handleMarkup(text) {
        if (typeof text !== 'string') return text;
        return text.replace(/\*\*C(1|2)\[(.*?)\]C\1\*\*/g, '<span class="highlight">$2</span>');
    }

    // --- RENDER PREVIEW --- (Updated with conditional logic for lab_analysis)
    function renderPreview(data) {
        if (!data || !data.lab_analysis) {
            pdfPreview.innerHTML = '<div class="placeholder"><p>No data to preview.</p></div>';
            return;
        }

        let html = '';
        const lab = data.lab_analysis;

        // --- Conditional Lab Analysis Section ---
        html += `<div class="report-section"><h3>Lab Analysis</h3><p>${handleMarkup(lab.overall_summary)}</p>`;
        
        // Check if there's a lab report (i.e., detailed_biomarkers has items)
        if (lab.detailed_biomarkers && lab.detailed_biomarkers.length > 0) {
            // RENDER "WITH LAB REPORT" VIEW
            const summary = lab.biomarker_categories_summary;
            html += `
                <h4>Biomarker Summary</h4>
                <div class="summary-boxes">
                    <div class="summary-box optimal"><span class="count">${summary.optimal_count}</span> Optimal</div>
                    <div class="summary-box mind"><span class="count">${summary.keep_in_mind_count}</span> Keep in Mind</div>
                    <div class="summary-box attention"><span class="count">${summary.attention_needed_count}</span> Needs Attention</div>
                </div>
                <p>${handleMarkup(summary.description_text)}</p>

                <h4>Detailed Biomarker Results</h4>
                <div class="biomarkers-container">
                    ${lab.detailed_biomarkers.map(bm => `
                        <div class="biomarker-card status-${bm.status}">
                            <div class="biomarker-header">
                                <h5>${bm.name}</h5>
                                <span class="biomarker-result">${bm.result}</span>
                            </div>
                            <p><strong>Status:</strong> ${bm.status_label}</p>
                            <p><strong>Range:</strong> ${bm.range}</p>
                            <p><strong>Cycle Impact:</strong> ${handleMarkup(bm.cycle_impact)}</p>
                            <p><strong>Why it Matters:</strong> ${handleMarkup(bm.why_it_matters)}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // This section will render for BOTH versions, showing future tests or initial recommendations
        html += `
            <h4>Crucial Biomarkers to Measure</h4>
            <ul>${lab.crucial_biomarkers_to_measure.map(bm => `<li><strong>${bm.name}:</strong> ${handleMarkup(bm.importance)}</li>`).join('')}</ul>
            <h4>Health Recommendations</h4>
            <ul>${lab.health_recommendation_summary.map(rec => `<li>${handleMarkup(rec)}</li>`).join('')}</ul>
        </div>`;

        // --- Other Sections (Remain the same) ---
        const pillars = data.four_pillars;
        html += `
            <div class="report-section">
                <h3>The Four Pillars</h3>
                <p>${handleMarkup(pillars.introduction)}</p>
                ${pillars.pillars.map(pillar => `
                    <div class="pillar-subsection">
                        <h4>${pillar.name} (Score: ${pillar.score}/10)</h4>
                        <p><strong>Rationale:</strong> <em>${handleMarkup(pillar.score_rationale.join(' '))}</em></p>
                        <p><strong>Why it Matters:</strong> ${handleMarkup(pillar.why_it_matters)}</p>
                        <p><strong>Root Cause Correlation:</strong> ${handleMarkup(pillar.root_cause_correlation)}</p>
                        <p><strong>Science-Based Explanation:</strong> ${handleMarkup(pillar.science_based_explanation)}</p>
                        
                        <h5>Additional Guidance</h5>
                        <p>${handleMarkup(pillar.additional_guidance.description)}</p>
                        <div class="guidance-grid">
                            ${Object.entries(pillar.additional_guidance.structure).map(([key, value]) => `
                                <div class="guidance-category">
                                    <strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                                    <ul>
                                        ${value.map(item => `<li><strong>${item.name}:</strong> ${handleMarkup(item.description)}</li>`).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>`;

        const supps = data.supplements;
        html += `
            <div class="report-section">
                <h3>Supplement Recommendations</h3>
                <p>${handleMarkup(supps.description)}</p>
                ${supps.structure.recommendations.map(sup => `
                    <div>
                        <h4>${sup.name}</h4>
                        <p><strong>Rationale:</strong> ${handleMarkup(sup.rationale)}</p>
                        <p><strong>Expected Outcomes:</strong> ${handleMarkup(sup.expected_outcomes)}</p>
                        <p><strong>Dosage & Timing:</strong> ${handleMarkup(sup.dosage_and_timing)}</p>
                        <p><strong>Considerations:</strong> ${handleMarkup(sup.situational_cyclical_considerations)}</p>
                    </div>
                `).join('')}
                <p><strong>Conclusion:</strong> ${handleMarkup(supps.structure.conclusion)}</p>
            </div>`;

        const plan = data.action_plan;
        html += `
            <div class="report-section">
                <h3>Action Plan Summary</h3>
                <p>${handleMarkup(plan.description)}</p>
                <div class="action-plan-grid">
                    ${Object.entries(plan.structure).map(([key, value]) => `
                        <div>
                            <h5>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                            <ul>${value.map(item => `<li>${handleMarkup(item)}</li>`).join('')}</ul>
                        </div>
                    `).join('')}
                </div>
            </div>`;

        pdfPreview.innerHTML = html;
    }

    // --- RENDER EDITOR --- (No changes needed, the recursive function handles it)
    function renderEditor(data) {
        editorFormContainer.innerHTML = '';
        buildFormSection(data, '', editorFormContainer);
    }
    
    function buildFormSection(data, path, parentElement) {
        for (const key in data) {
            const currentPath = path ? `${path}.${key}` : key;
            const value = data[key];
    
            if (typeof value === 'string') {
                parentElement.appendChild(createField(currentPath, value, key, 'textarea'));
            } else if (typeof value === 'number') {
                parentElement.appendChild(createField(currentPath, value, key, 'text'));
            } else if (Array.isArray(value)) {
                const fieldset = createFieldset(key);
                value.forEach((item, index) => {
                    const itemPath = `${currentPath}[${index}]`;
                    if (typeof item === 'string') {
                        fieldset.appendChild(createField(itemPath, item, `${key} #${index + 1}`, 'textarea'));
                    } else if (typeof item === 'object' && item !== null) {
                        const itemFieldset = createFieldset(item.name || `${key.replace(/s$/, '')} #${index + 1}`);
                        buildFormSection(item, itemPath, itemFieldset);
                        fieldset.appendChild(itemFieldset);
                    }
                });
                parentElement.appendChild(fieldset);
            } else if (typeof value === 'object' && value !== null) {
                const fieldset = createFieldset(key);
                buildFormSection(value, currentPath, fieldset);
                parentElement.appendChild(fieldset);
            }
        }
    }

    function createFieldset(legendText) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = legendText.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        fieldset.appendChild(legend);
        return fieldset;
    }

    function createField(path, value, labelText, type = 'textarea') {
        const wrapper = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = labelText.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        wrapper.appendChild(label);
        
        const input = document.createElement(type);
        input.value = value;
        if(type === 'textarea') input.rows = 3;

        input.addEventListener('input', (e) => {
            updateDataObject(path, e.target.value);
            renderPreview(currentData);
        });

        wrapper.appendChild(input);
        return wrapper;
    }
    
    function updateDataObject(path, value) {
        let schema = currentData;
        const pList = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
        const len = pList.length;
        for (let i = 0; i < len - 1; i++) {
            let elem = pList[i];
            if (!schema[elem]) schema[elem] = {};
            schema = schema[elem];
        }
        schema[pList[len - 1]] = value;
    }
});