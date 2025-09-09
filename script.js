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
  // let pillarChartInstance = null;

  const defaultData = {
    lab_analysis: {
      overall_summary:
        "Your lab results show a few areas that need attention, particularly your **C1[chloride]C1** level being slightly high and your **C1[Mean Corpuscular Hemoglobin]C1** and **C1[MCH Concentration]C1** being low. These can sometimes be linked to nutrient levels. You also have a high **C2[LDL,Calc]C2** (**C2[122 mg/dL]C2**) and **C2[Non-HDL,Chol,Calc]C2** (**C2[131 mg/dL]C2**), which are important for heart health. Your **C2[Hemoglobin A1c]C2** (**C2[5.3 %]C2**) is in a good range, suggesting your blood sugar is well-managed. Given your symptoms of **C1[fatigue]C1**, **C1[mood swings]C1**, and **C1[difficulty concentrating]C1**, we'll focus on supporting your energy and hormonal balance.",
      biomarkers_tested_count: 50,
      biomarker_categories_summary: {
        description_text:
          "Out of 18 tests, 13 are good, 2 need watching, and 3 need action.",
        optimal_count: 45,
        keep_in_mind_count: 1,
        attention_needed_count: 4,
      },
      detailed_biomarkers: [
        {
          name: "Neutrophil Percent, Auto",
          status: "optimal",
          status_label: "Good (Green)",
          result: "69.4 %",
          range: "No Ref. Range %",
          cycle_impact:
            "Neutrophils are a type of white blood cell that helps fight infection. Their levels can fluctuate but are not directly tied to your menstrual cycle.",
          why_it_matters:
            "Your neutrophil percentage is within a typical range, indicating your immune system is functioning as expected.",
        },
        {
          name: "Lymphocyte Percent, Auto",
          status: "optimal",
          status_label: "Good (Green)",
          result: "19.1 %",
          range: "No Ref. Range %",
          cycle_impact:
            "Lymphocytes are another type of white blood cell involved in immune response. Their levels can change with stress or illness, which can indirectly affect your cycle.",
          why_it_matters:
            "Your lymphocyte percentage is within a normal range, suggesting a balanced immune response.",
        },
        {
          name: "Monocyte Percent, Auto",
          status: "optimal",
          status_label: "Good (Green)",
          result: "8.2 %",
          range: "No Ref. Range %",
          cycle_impact:
            "Monocytes are a type of white blood cell that helps clear out dead cells and fight infection. Fluctuations can occur with inflammation, which might indirectly influence hormonal balance.",
          why_it_matters:
            "Your monocyte percentage is within a normal range, indicating your body's cleanup and immune processes are working well.",
        },
        {
          name: "Eosinophil Percent, Auto",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2.6 %",
          range: "No Ref. Range %",
          cycle_impact:
            "Eosinophils are white blood cells that often increase during allergic reactions or parasitic infections. While not directly linked to your cycle, significant increases can indicate underlying inflammation.",
          why_it_matters:
            "Your eosinophil percentage is within a normal range, suggesting no significant allergic response or parasitic issue.",
        },
        {
          name: "Basophil Percent, Auto",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.4 %",
          range: "No Ref. Range %",
          cycle_impact:
            "Basophils are a type of white blood cell involved in allergic responses. Their levels are generally stable and not directly related to your menstrual cycle.",
          why_it_matters:
            "Your basophil percentage is within a normal range, indicating no significant allergic activity.",
        },
        {
          name: "Immature Granulocytes%",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.3 %",
          range: "0.00 - 0.04 %",
          cycle_impact:
            "Immature granulocytes are a sign of the bone marrow releasing new white blood cells. A small amount is normal, but higher amounts can indicate stress on the body.",
          why_it_matters:
            "Your level of immature granulocytes is within the normal range, suggesting your bone marrow is functioning well.",
        },
        {
          name: "Absolute Neut Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.72 x10E3/uL",
          range: "1.80 - 6.90 x10E3/uL",
          cycle_impact:
            "This count represents a specific type of white blood cell. While not directly tied to your cycle, significant changes can reflect overall health status.",
          why_it_matters:
            "Your absolute neutrophil count is within the normal range, indicating a healthy immune cell count.",
        },
        {
          name: "Absolute Lymphocyte Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "1.30 x10E3/uL",
          range: "1.30 - 3.40 x10E3/uL",
          cycle_impact:
            "This count reflects a type of white blood cell. Stress or illness can affect these levels, which might indirectly influence hormonal balance.",
          why_it_matters:
            "Your absolute lymphocyte count is at the lower end of the normal range, which is good. It suggests your immune system is balanced.",
        },
        {
          name: "Absolute Mono Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.56 x10E3/uL",
          range: "0.20 - 0.80 x10E3/uL",
          cycle_impact:
            "Monocytes are important for immune response and clearing debris. Their levels can be influenced by inflammation, which might affect hormonal health.",
          why_it_matters:
            "Your absolute monocyte count is within the normal range, indicating healthy immune cell function.",
        },
        {
          name: "Absolute Eos Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.18 x10E3/uL",
          range: "0.00 - 0.50 x10E3/uL",
          cycle_impact:
            "Eosinophils are involved in allergic responses and fighting parasites. Their levels are generally not directly related to your menstrual cycle.",
          why_it_matters:
            "Your absolute eosinophil count is within the normal range, suggesting no significant allergic reactions or parasitic infections.",
        },
        {
          name: "Absolute Baso Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.03 x10E3/uL",
          range: "0.00 - 0.10 x10E3/uL",
          cycle_impact:
            "Basophils are involved in allergic reactions. Their levels are usually stable and not directly linked to your menstrual cycle.",
          why_it_matters:
            "Your absolute basophil count is within the normal range, indicating no significant allergic activity.",
        },
        {
          name: "Absolute Immature Gran Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.02 x10E3/uL",
          range: "0.00 - 0.04 x10E3/uL",
          cycle_impact:
            "This count represents immature white blood cells. A small amount is normal, but higher levels can indicate the body is under stress.",
          why_it_matters:
            "Your absolute immature granulocyte count is within the normal range, suggesting your bone marrow is functioning well.",
        },
        {
          name: "White Blood Cell Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "6.81 x10E3/uL",
          range: "4.16 - 9.95 x10E3/uL",
          cycle_impact:
            "White blood cells are part of your immune system. Their levels can be affected by stress or illness, which can indirectly influence your hormonal balance.",
          why_it_matters:
            "Your white blood cell count is within the normal range, indicating your immune system is balanced.",
        },
        {
          name: "Red Blood Cell Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.77 x10E6/uL",
          range: "3.96 - 5.09 x10E6/uL",
          cycle_impact:
            "Red blood cells carry oxygen throughout your body. Adequate oxygen is crucial for energy production, which can impact how you feel during your cycle.",
          why_it_matters:
            "Your red blood cell count is within the normal range, suggesting good oxygen transport to your tissues.",
        },
        {
          name: "Hemoglobin",
          status: "optimal",
          status_label: "Good (Green)",
          result: "12.5 g/dL",
          range: "11.6 - 15.2 g/dL",
          cycle_impact:
            "Hemoglobin carries oxygen in your red blood cells. Low levels can lead to **C1[fatigue]C1** and can be more common with heavy periods.",
          why_it_matters:
            "Your hemoglobin level is good, indicating you have enough oxygen-carrying capacity in your blood.",
        },
        {
          name: "Hematocrit",
          status: "optimal",
          status_label: "Good (Green)",
          result: "40.9 %",
          range: "34.9 - 45.2 %",
          cycle_impact:
            "Hematocrit is the percentage of red blood cells in your blood. It's related to hemoglobin and oxygen transport, which can affect your energy levels throughout your cycle.",
          why_it_matters:
            "Your hematocrit level is within the normal range, supporting adequate oxygen delivery.",
        },
        {
          name: "Mean Corpuscular Volume",
          status: "optimal",
          status_label: "Good (Green)",
          result: "85.7 fL",
          range: "79.3 - 98.6 fL",
          cycle_impact:
            "This measures the average size of your red blood cells. It can be affected by nutrient deficiencies, which might influence your energy during your cycle.",
          why_it_matters:
            "Your red blood cells are a normal size, suggesting your body is producing them effectively.",
        },
        {
          name: "Mean Corpuscular Hemoglobin",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "26.2 pg",
          range: "26.4 - 33.4 pg",
          cycle_impact:
            "This measures the average amount of hemoglobin in each red blood cell. Low levels can contribute to **C1[fatigue]C1** and may be linked to iron or B12 deficiency, which can impact your cycle.",
          why_it_matters:
            "Your Mean Corpuscular Hemoglobin is slightly low. This could indicate a potential issue with iron or vitamin B12 absorption, which are important for energy and can affect your menstrual cycle.",
        },
        {
          name: "MCH Concentration",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "30.6 g/dL",
          range: "31.5 - 35.5 g/dL",
          cycle_impact:
            "This measures the concentration of hemoglobin in your red blood cells. A low value can be associated with **C1[fatigue]C1** and may suggest nutrient deficiencies that can affect your cycle.",
          why_it_matters:
            "Your MCH Concentration is slightly low. This, along with the low MCH, suggests you might benefit from checking your iron and B12 levels more closely, as these can impact your energy and menstrual cycle.",
        },
        {
          name: "Red Cell Distribution Width-SD",
          status: "optimal",
          status_label: "Good (Green)",
          result: "42.6 fL",
          range: "36.9 - 48.3 fL",
          cycle_impact:
            "This measures the variation in the size of your red blood cells. Significant changes can sometimes be linked to nutrient deficiencies that might affect energy levels during your cycle.",
          why_it_matters:
            "The variation in your red blood cell size is within the normal range, indicating consistent red blood cell production.",
        },
        {
          name: "Red Cell Distribution Width-CV",
          status: "optimal",
          status_label: "Good (Green)",
          result: "13.8 %",
          range: "11.1 - 15.5 %",
          cycle_impact:
            "This measures the variation in the size of your red blood cells as a percentage. It's related to RDW-SD and can be influenced by nutrient status, potentially affecting energy during your cycle.",
          why_it_matters:
            "The variation in your red blood cell size, as a percentage, is within the normal range.",
        },
        {
          name: "Platelet Count, Auto",
          status: "optimal",
          status_label: "Good (Green)",
          result: "313 x10E3/uL",
          range: "143 - 398 x10E3/uL",
          cycle_impact:
            "Platelets help your blood clot. While not directly tied to your cycle, significant changes can indicate underlying health issues.",
          why_it_matters:
            "Your platelet count is within the normal range, indicating your blood's clotting ability is functioning well.",
        },
        {
          name: "Mean Platelet Volume",
          status: "optimal",
          status_label: "Good (Green)",
          result: "10.8 fL",
          range: "9.3 - 13.0 fL",
          cycle_impact:
            "This measures the average size of your platelets. It can sometimes be related to inflammation or platelet production, which are not directly linked to your cycle.",
          why_it_matters:
            "Your mean platelet volume is within the normal range, suggesting your platelets are of a typical size.",
        },
        {
          name: "Nucleated RBC%, automated",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.0 %",
          range: "No Ref. Range %",
          cycle_impact:
            "Nucleated red blood cells are immature red blood cells. A small amount is normal, but higher levels can indicate stress on the bone marrow.",
          why_it_matters:
            "Your level of nucleated red blood cells is zero, which is normal.",
        },
        {
          name: "Absolute Nucleated RBC Count",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.00 x10E3/uL",
          range: "0.00 - 0.00 x10E3/uL",
          cycle_impact:
            "This count represents immature red blood cells. A zero count is normal and indicates healthy red blood cell production.",
          why_it_matters:
            "Your absolute nucleated red blood cell count is zero, which is normal.",
        },
        {
          name: "Neutrophil Abs (Prelim)",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.72 x10E3/uL",
          range: "See Absolute Neut Ct. x10E3/uL",
          cycle_impact:
            "This is a count of a specific type of white blood cell. While not directly tied to your cycle, significant changes can reflect overall health status.",
          why_it_matters:
            "Your absolute neutrophil count is within the normal range, indicating a healthy immune cell count.",
        },
        {
          name: "Sodium",
          status: "optimal",
          status_label: "Good (Green)",
          result: "139 mmol/L",
          range: "135 - 146 mmol/L",
          cycle_impact:
            "Sodium is an electrolyte important for fluid balance. Hormonal shifts can sometimes affect fluid balance, but this level is normal.",
          why_it_matters:
            "Your sodium level is within the normal range, indicating good hydration and electrolyte balance.",
        },
        {
          name: "Potassium",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.7 mmol/L",
          range: "3.6 - 5.3 mmol/L",
          cycle_impact:
            "Potassium is another electrolyte crucial for nerve and muscle function, including your heart. Hormonal changes can sometimes influence electrolyte balance.",
          why_it_matters:
            "Your potassium level is within the normal range, supporting healthy nerve and muscle function.",
        },
        {
          name: "Chloride",
          status: "keep_in_mind",
          status_label: "Keep in Mind (Yellow)",
          result: "107 mmol/L",
          range: "96 - 106 mmol/L",
          cycle_impact:
            "Chloride is an electrolyte that works with sodium to maintain fluid balance. Slight variations can occur, but it's not directly linked to your cycle.",
          why_it_matters:
            "Your chloride level is slightly high. This can sometimes be related to hydration or kidney function, but a slight elevation like this is often not a concern.",
        },
        {
          name: "Total CO2",
          status: "optimal",
          status_label: "Good (Green)",
          result: "23 mmol/L",
          range: "20 - 30 mmol/L",
          cycle_impact:
            "Total CO2 is related to your body's acid-base balance and can be influenced by breathing and metabolism. It's not directly tied to your menstrual cycle.",
          why_it_matters:
            "Your total CO2 level is within the normal range, indicating your body's acid-base balance is stable.",
        },
        {
          name: "Anion Gap",
          status: "optimal",
          status_label: "Good (Green)",
          result: "9 mmol/L",
          range: "8 - 19 mmol/L",
          cycle_impact:
            "The anion gap is a calculation that helps assess your body's acid-base balance. It's not directly related to your menstrual cycle.",
          why_it_matters:
            "Your anion gap is within the normal range, suggesting your body's acid-base balance is well-regulated.",
        },
        {
          name: "Glucose",
          status: "optimal",
          status_label: "Good (Green)",
          result: "97 mg/dL",
          range: "65 - 99 mg/dL",
          cycle_impact:
            "Glucose is your body's primary energy source. Stable blood sugar is important for consistent energy throughout your cycle, and yours looks good.",
          why_it_matters:
            "Your glucose level is within the normal range, indicating your body is managing blood sugar effectively.",
        },
        {
          name: "Creatinine",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.66 mg/dL",
          range: "0.60 - 1.30 mg/dL",
          cycle_impact:
            "Creatinine is a waste product from muscle activity. It's filtered by your kidneys. Kidney function is important for overall health, which can indirectly support hormonal balance.",
          why_it_matters:
            "Your creatinine level is within the normal range, suggesting your kidneys are filtering waste effectively.",
        },
        {
          name: "Estimated GFR",
          status: "optimal",
          status_label: "Good (Green)",
          result: ">89 mL/min/1.73m2",
          range: "See Comment",
          cycle_impact:
            "Your estimated Glomerular Filtration Rate (eGFR) indicates how well your kidneys are filtering waste. Healthy kidney function is important for overall detoxification, which can support hormonal balance.",
          why_it_matters:
            "Your eGFR is excellent, showing your kidneys are working very well.",
        },
        {
          name: "Urea Nitrogen",
          status: "optimal",
          status_label: "Good (Green)",
          result: "7 mg/dL",
          range: "7 - 22 mg/dL",
          cycle_impact:
            "Urea nitrogen is a waste product filtered by the kidneys. Normal levels indicate good kidney function, which is important for overall health and hormonal balance.",
          why_it_matters:
            "Your urea nitrogen level is at the lower end of the normal range, indicating good kidney function.",
        },
        {
          name: "Calcium",
          status: "optimal",
          status_label: "Good (Green)",
          result: "9.1 mg/dL",
          range: "8.6 - 10.4 mg/dL",
          cycle_impact:
            "Calcium is vital for bone health and muscle function. Hormonal changes, especially around menopause, can affect calcium levels and bone density.",
          why_it_matters:
            "Your calcium level is within the normal range, supporting bone and muscle health.",
        },
        {
          name: "Total Protein",
          status: "optimal",
          status_label: "Good (Green)",
          result: "7.2 g/dL",
          range: "6.1 - 8.2 g/dL",
          cycle_impact:
            "Total protein reflects the amount of protein in your blood, which is essential for many bodily functions, including hormone transport and immune support.",
          why_it_matters:
            "Your total protein level is within the normal range, indicating adequate protein for bodily functions.",
        },
        {
          name: "Albumin",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.4 g/dL",
          range: "3.9 - 5.0 g/dL",
          cycle_impact:
            "Albumin is a protein made by the liver that helps transport hormones and other substances. Good levels support overall hormonal balance.",
          why_it_matters:
            "Your albumin level is within the normal range, indicating your liver is producing enough protein for transport functions.",
        },
        {
          name: "Bilirubin,Total",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.5 mg/dL",
          range: "0.1 - 1.2 mg/dL",
          cycle_impact:
            "Bilirubin is a byproduct of red blood cell breakdown, processed by the liver. While not directly tied to your cycle, liver health is important for hormone metabolism.",
          why_it_matters:
            "Your total bilirubin level is within the normal range, indicating your liver is processing waste products effectively.",
        },
        {
          name: "Alkaline Phosphatase",
          status: "optimal",
          status_label: "Good (Green)",
          result: "58 U/L",
          range: "37 - 113 U/L",
          cycle_impact:
            "Alkaline phosphatase can be elevated with bone turnover or liver issues. While not directly linked to your cycle, it's a marker of overall metabolic health.",
          why_it_matters:
            "Your alkaline phosphatase level is within the normal range, suggesting no significant bone or liver issues.",
        },
        {
          name: "Aspartate Aminotransferase",
          status: "optimal",
          status_label: "Good (Green)",
          result: "24 U/L",
          range: "13 - 62 U/L",
          cycle_impact:
            "Aspartate Aminotransferase (AST) is an enzyme found in the liver and other tissues. Normal levels suggest good liver health, which is important for hormone metabolism.",
          why_it_matters:
            "Your AST level is within the normal range, indicating good liver health.",
        },
        {
          name: "Alanine Aminotransferase",
          status: "optimal",
          status_label: "Good (Green)",
          result: "13 U/L",
          range: "8 - 70 U/L",
          cycle_impact:
            "Alanine Aminotransferase (ALT) is an enzyme primarily found in the liver. Normal levels are a good indicator of liver health, which is crucial for processing hormones.",
          why_it_matters:
            "Your ALT level is within the normal range, indicating good liver health.",
        },
        {
          name: "Hemoglobin A1c",
          status: "optimal",
          status_label: "Good (Green)",
          result: "5.3 %",
          range: "below <5.7 % HbA1c",
          cycle_impact:
            "This test shows your average blood sugar over the last 3 months. Stable blood sugar is key for consistent energy and mood throughout your cycle.",
          why_it_matters:
            "Your Hgb A1c is excellent, meaning your blood sugar control is good. This is important for preventing energy crashes and supporting overall hormonal balance.",
        },
        {
          name: "Cholesterol",
          status: "optimal",
          status_label: "Good (Green)",
          result: "185 mg/dL",
          range: "See Comment",
          cycle_impact:
            "Cholesterol is a building block for hormones. While this total level is good, the breakdown (LDL and HDL) is more important for understanding heart health.",
          why_it_matters:
            "Your total cholesterol is in a good range. It's a building block for hormones, so having adequate levels is important.",
        },
        {
          name: "Cholesterol,LDL,Calc",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "122 mg/dL",
          range: "below <100 mg/dL",
          cycle_impact:
            "LDL is often called 'bad' cholesterol. High levels can contribute to inflammation, which can affect hormone balance and energy levels.",
          why_it_matters:
            "Your LDL cholesterol is higher than recommended. This can be linked to diet and lifestyle and is a factor in heart health, which is interconnected with overall hormonal well-being.",
        },
        {
          name: "Cholesterol, HDL",
          status: "optimal",
          status_label: "Good (Green)",
          result: "54 mg/dL",
          range: "above >50 mg/dL",
          cycle_impact:
            "HDL is 'good' cholesterol that helps clear out LDL. Higher levels are generally protective for heart health, which is linked to overall hormonal balance.",
          why_it_matters:
            "Your HDL cholesterol is in a good range, indicating your body has a healthy amount of 'good' cholesterol.",
        },
        {
          name: "Triglycerides",
          status: "optimal",
          status_label: "Good (Green)",
          result: "43 mg/dL",
          range: "below <150 mg/dL",
          cycle_impact:
            "Triglycerides are a type of fat in your blood. High levels can be linked to blood sugar issues and inflammation, which can impact hormonal balance and energy.",
          why_it_matters:
            "Your triglyceride level is excellent, suggesting your body is managing fats well, likely due to good blood sugar control.",
        },
        {
          name: "Non-HDL,Chol,Calc",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "131 mg/dL",
          range: "below <130 mg/dL",
          cycle_impact:
            "Non-HDL cholesterol includes all the 'bad' cholesterol particles. Higher levels are associated with increased risk for heart disease and can be linked to inflammation that affects hormones.",
          why_it_matters:
            "Your Non-HDL cholesterol is slightly elevated. This, along with the high LDL, suggests focusing on heart-healthy habits is important for your overall well-being and hormonal balance.",
        },
        {
          name: "TSH",
          status: "optimal",
          status_label: "Good (Green)",
          result: "1.3 mcIU/mL",
          range: "0.3 - 4.7 mcIU/mL",
          cycle_impact:
            "TSH is a hormone that tells your thyroid to make thyroid hormones. Thyroid hormones regulate metabolism and energy, which can significantly impact your cycle and how you feel.",
          why_it_matters:
            "Your TSH is in a great range, suggesting your thyroid is functioning well and producing enough thyroid hormone to support your metabolism and energy levels.",
        },
        {
          name: "Vitamin B12",
          status: "optimal",
          status_label: "Good (Green)",
          result: "453 pg/mL",
          range: "254 - 1,060 pg/mL",
          cycle_impact:
            "Vitamin B12 is crucial for energy production and nerve function. Low levels can cause **C1[fatigue]C1** and neurological symptoms, and can affect your cycle.",
          why_it_matters:
            "Your Vitamin B12 level is within the normal range, which is good for energy and nerve health. However, given your low MCH and MCH concentration, it's still worth ensuring you're absorbing it well.",
        },
      ],
      crucial_biomarkers_to_measure: [
        {
          name: "Iron Panel (Ferritin, Serum Iron, TIBC)",
          importance:
            "Test your Iron Panel, especially Ferritin, to understand your iron stores. Low iron can cause **C1[fatigue]C1**, **C1[mood swings]C1**, and **C1[difficulty concentrating]C1**, which you're experiencing. This is important because your MCH and MCH concentration are low.",
        },
        {
          name: "Vitamin D (25-hydroxy)",
          importance:
            "Test your Vitamin D levels. Low Vitamin D is common and can affect mood, energy, and immune function, which may be contributing to your **C1[fatigue]C1** and **C1[mood swings]C1**.",
        },
        {
          name: "Magnesium",
          importance:
            "Test your Magnesium levels. Magnesium plays a role in energy production, stress management, and hormone balance. Low magnesium can worsen **C1[fatigue]C1**, **C1[mood swings]C1**, and **C1[anxiety]C1**.",
        },
      ],
      health_recommendation_summary: [
        "Focus on nutrient-dense foods to support your energy and address low MCH/MCH concentration. Think colorful fruits and vegetables, lean proteins, and healthy fats.",
        "Prioritize consistent meal times. Eating at regular intervals helps stabilize blood sugar and energy levels, which can reduce afternoon crashes and **C1[fatigue]C1**.",
        "Incorporate stress-management techniques daily. Since you report high stress, practices like yoga, meditation, or deep breathing can help improve your **C1[mood swings]C1** and **C1[anxiety]C1**.",
        "Aim for 7-9 hours of sleep per night. While you get 6 hours, improving sleep quality can significantly boost your energy and reduce daytime **C1[fatigue]C1**.",
        "Stay hydrated by drinking more water. Aim for at least 64 oz daily to support energy levels and overall bodily functions.",
        "Retest your Iron Panel (especially Ferritin), Vitamin D, and Magnesium to get a clearer picture of your nutrient status and address your symptoms of **C1[fatigue]C1** and **C1[mood swings]C1**.",
        "Consider a follow-up with your doctor to discuss your elevated LDL and Non-HDL cholesterol, as heart health is linked to hormonal well-being.",
        "Continue your current exercise routine of 4-5 times per week, as physical activity is excellent for managing stress and improving energy.",
      ],
    },
    four_pillars: {
      introduction:
        "Stefanie, your health journey shows a few key areas we can focus on to help you feel your best. Your energy levels and mood swings suggest we need to pay close attention to how you eat, sleep, move, and recover. Your labs show a slightly elevated LDL cholesterol, which is your 'bad' cholesterol, and your Non-HDL cholesterol is also high. While your other labs are within normal ranges, these lipid results, combined with your reported **C1[after-meal fatigue]C1** and **C1[afternoon energy dips]C1**, suggest we can optimize your nutrition and stress management to improve your overall well-being.",
      pillars: [
        {
          name: "Eat Well",
          score: 4,
          score_rationale: [
            "Your Eat Well score is 4 because you mentioned having an **C1[irregular meal schedule]C1** and sometimes skipping or delaying meals.",
            "Eating consistently helps stabilize your energy and mood, which is important for managing your **C1[mood swings]C1** and **C1[afternoon energy dips]C1**.",
          ],
          why_it_matters:
            "Eating regular, balanced meals helps keep your blood sugar steady, which is like keeping a steady flow of energy to your brain and body. This can directly impact your **C1[fatigue]C1** and **C1[difficulty concentrating]C1**.",
          root_cause_correlation:
            "An irregular eating pattern can disrupt your body's natural rhythms, potentially affecting hormone balance and contributing to **C1[bloating]C1** and **C1[mood swings]C1**.",
          science_based_explanation:
            "When you skip meals or eat irregularly, your body might not get the consistent fuel it needs, leading to energy crashes. Stable blood sugar also helps your brain function better, reducing **C1[difficulty concentrating]C1**.",
          additional_guidance: {
            description:
              "To support your energy and hormonal balance, here are some food recommendations and foods to be mindful of.",
            structure: {
              recommended_foods: [
                {
                  name: "Whole Grains",
                  description:
                    "Like oats, quinoa, and brown rice. They provide sustained energy and fiber, which can help with **C1[bloating]C1** and keep your blood sugar stable.",
                },
                {
                  name: "Lean Proteins",
                  description:
                    "Such as chicken, fish, beans, and lentils. Protein helps you feel full and supports muscle health, which is important for your **C1[resistance training]C1**.",
                },
                {
                  name: "Healthy Fats",
                  description:
                    "Found in avocados, nuts, seeds, and olive oil. These are important for hormone production and can help manage your **C1[intense food cravings]C1**.",
                },
                {
                  name: "Fruits and Vegetables",
                  description:
                    "Aim for a variety of colors to get a wide range of vitamins and minerals. They are rich in fiber and antioxidants, which can help with **C1[fatigue]C1** and overall well-being.",
                },
              ],
              cautious_foods: [
                {
                  name: "Refined Sugars and Processed Foods",
                  description:
                    "These can cause rapid spikes and crashes in blood sugar, worsening **C1[afternoon energy dips]C1** and potentially impacting your mood.",
                },
                {
                  name: "Excessive Saturated and Trans Fats",
                  description:
                    "These can contribute to higher LDL cholesterol, as seen in your labs (**C2[LDL,Calc]C2[122 mg/dL]C2** is high). Focus on unsaturated fats instead.",
                },
                {
                  name: "Large Meals Late at Night",
                  description:
                    "These can interfere with sleep quality and digestion, potentially worsening **C1[bloating]C1** and **C1[acid reflux]C1**.",
                },
              ],
            },
          },
        },
        {
          name: "Sleep Well",
          score: 5,
          score_rationale: [
            "Your Sleep Well score is 5 because while you get 6 hours of sleep, you describe your sleep quality as 'fair' and experience **C1[frequent daytime fatigue]C1**.",
            "This suggests that even though you're in bed, you might not be getting restorative sleep, which impacts your energy and **C1[mood swings]C1**.",
          ],
          why_it_matters:
            "Quality sleep is crucial for hormone regulation, stress management, and energy restoration. Poor sleep can worsen **C1[fatigue]C1**, **C1[anxiety]C1**, and **C1[difficulty concentrating]C1**.",
          root_cause_correlation:
            "Stress and an irregular schedule can disrupt your natural sleep-wake cycle, leading to less restful sleep and contributing to your **C1[daytime fatigue]C1**.",
          science_based_explanation:
            "During deep sleep, your body repairs itself and regulates hormones like cortisol and melatonin. Not getting enough quality sleep can throw these off, making you feel tired and irritable, and potentially worsening **C1[mood swings]C1**.",
          additional_guidance: {
            description:
              "To improve your sleep quality and combat daytime fatigue, here are some tips.",
            structure: {
              recommended_recovery_tips: [
                {
                  name: "Consistent Sleep Schedule",
                  description:
                    "Try to go to bed and wake up around the same time every day, even on weekends. This helps regulate your body's internal clock.",
                },
                {
                  name: "Create a Relaxing Bedtime Routine",
                  description:
                    "Engage in calming activities like reading, gentle stretching, or taking a warm bath before bed to signal to your body that it's time to wind down.",
                },
                {
                  name: "Optimize Your Sleep Environment",
                  description:
                    "Ensure your bedroom is dark, quiet, and cool. Consider blackout curtains or earplugs if needed.",
                },
                {
                  name: "Limit Screen Time Before Bed",
                  description:
                    "The blue light from screens can interfere with melatonin production, making it harder to fall asleep. Your **C1[excessive screen time]C1** might be a factor.",
                },
              ],
              avoid_habits_rest_recover: [
                {
                  name: "Late-Night Caffeine or Alcohol",
                  description:
                    "While you don't consume much caffeine, be mindful of timing. Alcohol can disrupt sleep architecture, leading to less restful sleep.",
                },
                {
                  name: "Heavy Meals Close to Bedtime",
                  description:
                    "This can cause digestive discomfort and make it harder to fall asleep, potentially worsening **C1[bloating]C1**.",
                },
              ],
            },
          },
        },
        {
          name: "Move Well",
          score: 7,
          score_rationale: [
            "Your Move Well score is 7 because you exercise 4-5 times per week with a mix of resistance training, yoga, and walking.",
            "This is a good foundation, but your reported **C1[frequent daytime fatigue]C1** and **C1[afternoon energy dips]C1** suggest we can fine-tune your movement to better support your energy levels.",
          ],
          why_it_matters:
            "Regular movement helps manage stress, improve mood, and can positively influence hormone balance and energy levels. It's also great for cardiovascular health, which is important given your family history of **C1[heart disease]C1**.",
          root_cause_correlation:
            "While exercise is generally beneficial, if it's not balanced with adequate recovery or if done at too high an intensity without proper nutrition, it can sometimes contribute to **C1[fatigue]C1**.",
          science_based_explanation:
            "Exercise helps your body become more efficient at using energy and can improve insulin sensitivity, which helps prevent blood sugar crashes. Yoga, in particular, can help manage stress, which is a major contributor to your **C1[mood swings]C1** and **C1[anxiety]C1**.",
          additional_guidance: {
            description:
              "You have a good exercise routine. Let's focus on how to optimize it for energy and stress management.",
            structure: {
              recommended_workouts: [
                {
                  name: "Continue Resistance Training",
                  description:
                    "This is excellent for building muscle, which helps with metabolism and body composition. Aim for 2-3 sessions per week.",
                },
                {
                  name: "Prioritize Yoga and Mindfulness",
                  description:
                    "Given your **C1[high stress levels]C1** and **C1[mood swings]C1**, continuing and perhaps deepening your yoga practice is highly recommended. It directly addresses stress and can improve your **C1[sleep quality]C1**.",
                },
                {
                  name: "Incorporate Brisk Walking",
                  description:
                    "Aim for 30 minutes of brisk walking most days of the week. This is a great way to boost energy, improve cardiovascular health, and manage stress without being overly taxing.",
                },
              ],
              avoid_habits_move: [
                {
                  name: "Overtraining",
                  description:
                    "If you feel excessively fatigued after workouts, it might be a sign of overtraining. Ensure you're allowing adequate rest between intense sessions.",
                },
                {
                  name: "Exercising Too Close to Bedtime",
                  description:
                    "While you don't mention this, intense exercise too close to bedtime can sometimes interfere with sleep for some individuals.",
                },
              ],
            },
          },
        },
        {
          name: "Recover Well",
          score: 3,
          score_rationale: [
            "Your Recover Well score is 3 because you report **C1[high stress levels]C1** that frequently impact your mood, energy, or ability to relax.",
            "You also experience **C1[frequent daytime fatigue]C1** and **C1[afternoon energy dips]C1**, indicating your body isn't recovering effectively from daily stressors.",
          ],
          why_it_matters:
            "Effective recovery is essential for managing stress, balancing hormones, and preventing burnout. When you don't recover well, it can exacerbate **C1[fatigue]C1**, **C1[anxiety]C1**, and **C1[irritability]C1**.",
          root_cause_correlation:
            "High stress, irregular sleep, and an inconsistent routine can all prevent your body from entering a restorative state, leading to persistent **C1[fatigue]C1** and **C1[mood swings]C1**.",
          science_based_explanation:
            "When you're stressed, your body releases cortisol. While short-term cortisol is helpful, chronic high levels can disrupt sleep, impair cognitive function (leading to **C1[difficulty concentrating]C1**), and contribute to weight gain around the midsection. Your listed stress-reducing techniques are great, but their effectiveness might be limited by other factors like sleep and nutrition.",
          additional_guidance: {
            description:
              "You're already practicing many great stress-reducing techniques! Let's refine them and ensure they're working effectively for you.",
            structure: {
              recommended_recovery_tips: [
                {
                  name: "Prioritize Your Stress Management Techniques",
                  description:
                    "You listed many excellent techniques like yoga, meditation, journaling, and deep breathing. Make sure you're scheduling these into your week, especially during times of high stress, to combat **C1[anxiety]C1** and **C1[irritability]C1**.",
                },
                {
                  name: "Mindful Eating Practices",
                  description:
                    "Pay attention to how you feel after eating. Your report of feeling **C1[extremely tired or sluggish after eating]C1** suggests that your body may be struggling to digest or process your meals efficiently. Eating slowly and mindfully can help.",
                },
                {
                  name: "Hydration",
                  description:
                    "You're consuming 48-64 oz of water, which is a good start. Ensure you're staying consistently hydrated throughout the day, as dehydration can worsen **C1[fatigue]C1** and **C1[difficulty concentrating]C1**.",
                },
                {
                  name: "Address Environmental Stressors",
                  description:
                    "You mentioned exposure to **C1[harsh lighting or excessive screen time]C1**. Consider using blue light filters on your devices, taking regular breaks from screens, and ensuring your workspace lighting is comfortable.",
                },
              ],
              avoid_habits_rest_recover: [
                {
                  name: "Irregular Meal Schedule",
                  description:
                    "As mentioned in 'Eat Well,' an irregular schedule can contribute to stress on your body and impact energy levels, worsening **C1[afternoon energy dips]C1**.",
                },
                {
                  name: "Reliance on Caffeine/Sugar for Energy",
                  description:
                    "You mentioned needing caffeine or sugar to combat afternoon crashes. While you don't consume much caffeine, relying on quick fixes can create a cycle of energy highs and lows, rather than addressing the root cause of your **C1[fatigue]C1**.",
                },
              ],
            },
          },
        },
      ],
    },
    supplements: {
      description:
        "Based on your health goals and lab results, here are some supplement suggestions that might help you feel your best. Remember, these are like adding extra tools to your toolbox to support your body's natural processes.",
      structure: {
        recommendations: [
          {
            name: "Magnesium",
            rationale:
              "You mentioned experiencing **C1[mood swings]C1**, **C1[fatigue]C1**, and **C1[difficulty concentrating]C1**. Magnesium is known to help calm the nervous system, which can be really helpful for managing stress and improving mood. It's like a natural chill pill for your body.",
            expected_outcomes:
              "May help improve **C1[sleep quality]C1**, reduce **C1[anxiety]C1**, and support energy levels.",
            dosage_and_timing:
              "Consider 200-400 mg daily, preferably in the evening, as it can promote relaxation.",
            situational_cyclical_considerations:
              "Some women find it particularly helpful in the week leading up to their period to ease **C1[bloating]C1** and **C1[cramps]C1**.",
          },
          {
            name: "Vitamin B12",
            rationale:
              "You're experiencing **C1[frequent daytime fatigue]C1**. Vitamin B12 is crucial for energy production in your body, helping your cells convert food into fuel. Think of it as a spark plug for your energy.",
            expected_outcomes:
              "Can help boost **C1[energy levels]C1** and combat **C1[fatigue]C1**.",
            dosage_and_timing:
              "A daily dose of 500-1000 mcg is common. It can be taken anytime during the day.",
            situational_cyclical_considerations:
              "No specific cyclical considerations, but consistent daily intake is key for energy support.",
          },
          {
            name: "Vitamin D",
            rationale:
              "You're experiencing **C1[mood swings]C1** and **C1[anxiety]C1**. Vitamin D plays a role in mood regulation and overall well-being. It's like sunshine for your mood.",
            expected_outcomes:
              "May help improve **C1[mood]C1**, support immune function, and contribute to overall vitality.",
            dosage_and_timing:
              "A common recommendation is 2000-4000 IU daily. Taking it with a meal that contains fat can improve absorption.",
            situational_cyclical_considerations:
              "No specific cyclical considerations, but consistent daily intake is important.",
          },
          {
            name: "Iron",
            rationale:
              "Your lab results show **C2[Mean Corpuscular Hemoglobin Low]C2** (**C2[26.2 pg]C2**) and **C2[MCH Concentration Low]C2** (**C2[30.6 g/dL]C2**), which can be indicators of lower iron levels. This can contribute to **C1[fatigue]C1** and **C1[hair loss]C1**, which you've reported.",
            expected_outcomes:
              "Can help improve **C1[energy levels]C1**, reduce **C1[fatigue]C1**, and support healthy **C1[hair growth]C1**.",
            dosage_and_timing:
              "Dosage varies, but often around 25-65 mg of elemental iron daily. It's best taken on an empty stomach for absorption, but if it causes upset, take it with a small amount of food. Avoid taking it with calcium or caffeine.",
            situational_cyclical_considerations:
              "Continue daily, especially if your periods are moderate to heavy, as this is a common way iron is lost.",
          },
          {
            name: "Zinc",
            rationale:
              "You've mentioned **C1[hair loss]C1** and **C1[mood swings]C1**. Zinc is important for hair follicle health and can also play a role in mood regulation. It's like a building block for healthy hair and a stabilizer for your mood.",
            expected_outcomes:
              "May help reduce **C1[hair loss]C1** and support emotional balance.",
            dosage_and_timing:
              "A typical dose is 15-30 mg daily. It's often best absorbed when taken with food.",
            situational_cyclical_considerations:
              "No specific cyclical considerations, but consistent daily intake is beneficial.",
          },
          {
            name: "Omega-3 Fatty Acids (EPA/DHA)",
            rationale:
              "You experience **C1[bloating]C1**, **C1[mood swings]C1**, and **C1[anxiety]C1**. Omega-3s are anti-inflammatory and can help calm the body, potentially easing digestive discomfort and supporting a more stable mood.",
            expected_outcomes:
              "Can help reduce **C1[inflammation]C1**, improve **C1[mood]C1**, and support overall hormonal balance.",
            dosage_and_timing:
              "Aim for 1000-2000 mg of combined EPA and DHA daily. Taking with a meal is recommended.",
            situational_cyclical_considerations:
              "No specific cyclical considerations, but consistent daily intake is beneficial.",
          },
        ],
        conclusion:
          "These supplements are like a gentle nudge to help your body function optimally. It's always a good idea to chat with your doctor before starting any new supplement, just to make sure they're the perfect fit for you and won't interact with anything else.",
      },
    },
  };

  jsonInput.value = JSON.stringify(defaultData, null, 2);
  // Render the initial view on page load
  updateActiveTab();
  renderContentForActiveTab();
  renderEditor(currentData);

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

  /**
   * --- **** FINAL AND BEST PDF DOWNLOAD FUNCTION **** ---
   * This creates a PDF with the fewest pages possible by using custom,
   * maximum-height pages. This provides a single, continuous scrolling experience
   * while respecting the PDF library's technical limits.
   */
  async function handleDownloadPdf() {
    const element = document.getElementById("pdf-preview");
    const downloadBtn = document.getElementById("download-button");
    const tabButtons = document.querySelectorAll(".tab-button");

    downloadBtn.textContent = "Generating PDF...";
    downloadBtn.disabled = true;
    tabButtons.forEach((btn) => (btn.disabled = true));

    try {
      // ✅ If active tab is "biomarkers", call the API directly
      if (activeTab === "biomarkers") {
        const response = await fetch("http://localhost:3000/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ htmlDiv: element.innerHTML }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate PDF from API");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeTab}-analysis.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        return; // ✅ Stop here so normal flow doesn’t run
      }

      // 🔹 Your original htmlToImage → jsPDF flow
      const sourceCanvas = await htmlToImage.toCanvas(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const { jsPDF } = window.jspdf;

      const sourceCanvasWidth = sourceCanvas.width;
      const sourceCanvasHeight = sourceCanvas.height;

      const px_to_pt_ratio = 0.75;
      const maxPageHeightInPt = 14400;

      const pdfWidthInPt = sourceCanvasWidth * px_to_pt_ratio;

      let y_pos_in_px = 0;
      let isFirstPage = true;
      let pdf = null;

      while (y_pos_in_px < sourceCanvasHeight) {
        const sliceHeightInPx = Math.min(
          sourceCanvasHeight - y_pos_in_px,
          maxPageHeightInPt / px_to_pt_ratio
        );
        const sliceHeightInPt = sliceHeightInPx * px_to_pt_ratio;

        if (isFirstPage) {
          pdf = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: [pdfWidthInPt, sliceHeightInPt],
          });
          isFirstPage = false;
        } else {
          pdf.addPage([pdfWidthInPt, sliceHeightInPt]);
        }

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = sourceCanvasWidth;
        pageCanvas.height = sliceHeightInPx;
        const pageCtx = pageCanvas.getContext("2d");

        pageCtx.drawImage(
          sourceCanvas,
          0,
          y_pos_in_px,
          sourceCanvasWidth,
          sliceHeightInPx,
          0,
          0,
          sourceCanvasWidth,
          sliceHeightInPx
        );

        const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthInPt, sliceHeightInPt);

        y_pos_in_px += sliceHeightInPx;
      }

      pdf.save(`${activeTab}-analysis.pdf`);
    } catch (error) {
      console.error("PDF Generation failed!", error);
      alert(
        `Could not generate PDF. Please check the console for errors. Error: ${error.message}`
      );
    } finally {
      downloadBtn.textContent = "Download as PDF";
      downloadBtn.disabled = false;
      tabButtons.forEach((btn) => (btn.disabled = false));
    }
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
        <div class="report-title">
          <h1>Holistic Health</h1>
          <img src="icons/actionPlan.svg" alt="actionPlan Icon" class="report-icon">
        </div>
        <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
          "en-US",
          { month: "long", day: "numeric", year: "numeric" }
        )}</span></p>
    </div>
    <div class="report-section">
        <div class="biomarker-warraper pillers-wrapper">
            <div class="meta-info pillar-meta-info">
            <span><strong>Designed By:</strong> Researchers,Holistic <br/>Coaches, Clinicians</span>
            </div>
            <div class="pillar-intro-container">
              <h4>Introduction</h4>
            ${
              pillarsData.introduction
                ? `<p class="pillar-intro">${handleMarkup(
                    pillarsData.introduction
                  )}</p>`
                : ""
            }
            </div>
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
        `;

    if (pillarsData.pillars && pillarsData.pillars.length > 0) {
      const pillarOrder = [
        "Eat Well",
        "Move Well",
        "Recover Well",
        "Sleep Well",
      ];

      pillarsData.pillars.sort((a, b) => {
        const aIndex = pillarOrder.indexOf(a.name);
        const bIndex = pillarOrder.indexOf(b.name);
        return aIndex - bIndex;
      });
      html += pillarsData.pillars
        .map((pillar) => {
          // Generate the SVG for the current pillar
          const svgHtml = createCircularSegmentedSVG({
            isEat: pillar.name === "Eat Well",
            isMove: pillar.name === "Move Well",
            isSleep: pillar.name === "Sleep Well",
            isRecover: pillar.name === "Recover Well",
            size: 50, // A smaller size might be better here
          });
          const svgHtml2 = createCircularSegmentedSVG({
            isEat: pillar.name === "Eat Well",
            isMove: pillar.name === "Move Well",
            isSleep: pillar.name === "Sleep Well",
            isRecover: pillar.name === "Recover Well",
            size: 35, // A smaller size might be better here
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
              <div class="pillar-score-container">
              ${svgHtml2}
                <h4>${pillar.name} - ${getCaption(pillar.score)}(${
            pillar.score
          }/10)
              </h4>
              </div>
              <div class="score-why-list">
                ${
                  pillar.score_rationale
                    .map(
                      (rationale) =>
                        `<div class="scroe-points">
                <img src="icons/polygon2.svg" alt="Recommendation Icon" class="inline-icon"><p> ${handleMarkup(
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
                <img src="icons/rootcausew.svg" alt="Recommendation Icon" class="inline-icon">
              </div>
              <div class="recommnedation-list">              
              <img src="icons/guidance.svg" alt="Recommendation Icon" class="inline-icon">
              <p>${handleMarkup(pillar.root_cause_correlation)}</p>
              </div>
          </div>

          <div class="pillar-seciton-two">
              <div class="heading-section">
                <h4>Science-Based Explanation</h4>
                <img src="icons/scibasedexpw.svg" alt="Recommendation Icon" class="inline-icon">
              </div>
              <div class="recommnedation-list">
              <img src="icons/guidance.svg" alt="Recommendation Icon" class="inline-icon">
              <p>${handleMarkup(pillar.science_based_explanation)}</p>
              </div>
          </div>

          <div class="pillar-seciton-three">
              <div class="heading-section">
                <h4>Guidance</h4>
                <img src="icons/guidance.svg" alt="Recommendation Icon" class="inline-icon">
              </div>
              ${
                // First, check if additional_guidance and its description exist before rendering
                pillar.additional_guidance &&
                pillar.additional_guidance.description
                  ? `<p class="guidance-description">${handleMarkup(
                      pillar.additional_guidance.description
                    )}</p>`
                  : ""
              }
              <div class="guidance-section">                  
                  <div class="guidance-wrapper">
                  ${
                    // Now, check if the structure exists to render the categories
                    pillar.additional_guidance &&
                    pillar.additional_guidance.structure
                      ? // Loop over each key in the structure object (e.g., 'recommended_foods', 'cautious_foods')
                        Object.keys(pillar.additional_guidance.structure)
                          .map((key, index) => {
                            const items =
                              pillar.additional_guidance.structure[key];

                            // Don't render anything if a category is empty
                            if (!items || items.length === 0) return "";

                            // Create a readable title from the object key (e.g., "Recommended Foods")
                            const title = key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase());

                            const imageUrl =
                              index === 0
                                ? "icons/crucialg.svg"
                                : "icons/crucial.svg";
                            const colorOfGuidance =
                              index === 0 ? "green" : "pink";

                            // Return a container for the category
                            return `
                            <div class="guidance-category">
                              <div class="guidance-category-header-wrapper">
                                <div class="guidance-category-header">                              
                                <img src=${imageUrl} alt="actionPlan Icon" class="report-icon">
                                <h5>${title}</h5>
                                </div>
                                ${svgHtml}
                              </div>
                              ${
                                // Map over the items in the category array
                                items
                                  .map(
                                    (item) =>
                                      // Create a <p> tag for each item with its name and description
                                      `<div class="guidance-item"><p class="guidance-item-name ${colorOfGuidance}">${handleMarkup(
                                        item.name
                                      )}:</p> <div class="guidance-item-description"><span>•</span><p> ${handleMarkup(
                                        item.description
                                      )}</p></div></div>`
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
                lineWidth: 2,
              },
              pointLabels: {
                font: {
                  size: 20,
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
    if (!data || !data.supplements) {
      pdfPreview.innerHTML =
        '<div class="placeholder"><p>No Supplements data to preview.</p></div>';
      return;
    }

    const supplements = data.supplements;

    const recommendationsHtml = supplements.structure.recommendations
      .map(
        (rec) => `
      <div class="supplement-recommendation-card-wrapper">
            <div class="recommendation-name">
              <h4>${rec.name}</h4>
              <img src="icons/guidance.svg" alt="Recommendation Icon" class="inline-icon">
            </div>
              
            <div class="supplement-recommendation-card">
              <div>
                <div class="supplement-ind-header">
                    <img src="icons/crucialg.svg" alt="actionPlan Icon" class="crucial-icon">
                    <p class="recommendation-ind-name">Rationale</p>
                </div>
                <p> ${handleMarkup(rec.rationale)}</p>
              </div>
               <div>
                <div class="supplement-ind-header">
                    <img src="icons/crucialg.svg" alt="actionPlan Icon" class="crucial-icon">
                    <p class="recommendation-ind-name">Expected Outcomes</p>
                </div>
                <p> ${handleMarkup(rec.expected_outcomes)}</p>
              </div>
               <div>
                <div class="supplement-ind-header">
                    <img src="icons/crucialg.svg" alt="actionPlan Icon" class="crucial-icon">
                    <p class="recommendation-ind-name">Dosage & Timing</p>
                </div>
                <p> ${handleMarkup(rec.dosage_and_timing)}</p>
              </div>
               <div>
                <div class="supplement-ind-header">
                    <img src="icons/crucialg.svg" alt="actionPlan Icon" class="crucial-icon">
                    <p class="recommendation-ind-name">Situational/Cyclical Considerations</p>
                </div>
                <p> ${handleMarkup(rec.situational_cyclical_considerations)}</p>
              </div>
        </div>
      </div>
      `
      )
      .join("");

    let html = `
              <div class="report-header">
              <div class="report-title">
                <h1>Supplements</h1>
                <img src="icons/suppliment.svg" alt="actionPlan Icon" class="report-icon">
              </div>
                <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}</span></p>
              </div>
              <div class="biomarker-warraper pillers-wrapper suppliment-wrapper">
                <div class="meta-info suppliment-meta-info">
                  <span><strong>Designed By:</strong> Researchers,
Holistic <br />Coaches, Clinicians</span>
                </div>
                <h4>Introduction</h4>
                  ${
                    supplements.description
                      ? `<div class="pillar-intro"><p>${handleMarkup(
                          supplements.description
                        )}</p></div>`
                      : ""
                  }
              </div>
              <div class="recommendations-container">
              <h3>Suppliment Recommendations:</h3>
                ${recommendationsHtml}
              </div>

              <div class="supplement-disclaimer-wrapper">
                  <p>⚠️ Supplement Disclaimer for Bewell</p>
                  <p>Disclaimer:</p>
                  <p>The supplement recommendations provided by Bewell are for general wellness and informational purposes only. They are not intended to diagnose, treat, cure, or prevent any disease. These suggestions are not a substitute for professional medical advice or care, and no doctor-patient relationship is established through the use of this service.</p>
                  <p>Always consult with your primary care physician, licensed healthcare provider, or qualified practitioner before beginning any new supplement, especially if you are pregnant, nursing, taking medications, or have an existing medical condition.</p>
                  <p>By using Bewell, you acknowledge that all supplement guidance is part of a lifestyle and wellness strategy—not a medical treatment plan.</p>
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
              <div class="report-title">
                <h1>Biomarker Analysis</h1>
                <img src="icons/biomerker.svg" alt="actionPlan Icon" class="report-icon">
              </div>
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
Holistic <br />Coaches, Clinicians</span>
                 </div>`;

      // Only show the biomarker count and chart if there are biomarkers
      if (totalBiomarkers > 0) {
        const maxCount = Math.max(
          1,
          summary.optimal_count,
          summary.keep_in_mind_count,
          summary.attention_needed_count
        );
        const optimalHeight = (summary.optimal_count / maxCount) * 260 + 15;
        const mindHeight = (summary.keep_in_mind_count / maxCount) * 260 + 15;
        const attentionHeight =
          (summary.attention_needed_count / maxCount) * 260 + 15;

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
                   <div class="biomarker-overall-summary">
                   <p>${handleMarkup(lab.overall_summary)}</p></div>
             </div>
       </div>`;
    }

    if (lab.detailed_biomarkers && lab.detailed_biomarkers.length > 0) {
      const summary = lab.biomarker_categories_summary;
      html += `
                   <div class="categories-wrapper page-break-before">
                         <h4>Lab Result Breakdown</h4>
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
                               <p class="range-p">Range: ${bm.range
                                 .replace(":", ":</b><br>")
                                 .replaceAll(", ", "<br>")}</p>
                               <div class="result-show"><h1 class="result-value-${
                                 bm.status
                               }">${value}</h1><span class="result-unit-${
                         bm.status
                       }">${unit}</span></div>
                               <div class="range-show"><div class="range-indicator range-indicator-${
                                 bm.status
                               }"></div><div class="range-content">
                                    <p>${bm.status_label
                                      .replace(/\s*\(.*?\)\s*/g, "")
                                      .trim()}</p>
                                    <p class="last-update">${new Date().toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}</p></div></div>
                         </div>
  ${
    bm.cycle_impact
      ? `<h4>Cycle Impact</h4>
     <p class="p-grey">${handleMarkup(bm.cycle_impact)}</p>`
      : ""
  }
  ${
    bm.why_it_matters
      ? `<h4 class="why-it-matters-h4">Why It Matters</h4>
     <p class="p-grey">${handleMarkup(bm.why_it_matters)}</p>`
      : ""
  }

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
                        <div class="crucial-header-wrapper">
                        <div class="crucial-header">
                              <h4>Crucial Biomarkers to Measure</h4>
                              <img src="icons/crucial.svg" alt="actionPlan Icon" class="report-icon">
                        </div>
                         <div class="biomarkers-container">
                               ${lab.crucial_biomarkers_to_measure
                                 .map(
                                   (bm) => `
                               <div class="crucial-ind">
                                     <div class="crucial-ind-header">
                                      <img src="icons/crucial.svg" alt="actionPlan Icon" class="crucial-icon">
                                     <p class="crucial-name">${bm.name}</p>
                                     </div>
                                     <p class="p-grey">${handleMarkup(
                                       bm.importance
                                     )}</p>
                               </div>`
                                 )
                                 .join("")}
                         </div>
                        </div>
                   </div>`;
    }

    if (
      lab.health_recommendation_summary &&
      lab.health_recommendation_summary.length > 0
    ) {
      html += `
                   <div class="categories-wrapper health-recommendation ${
                     lab.crucial_biomarkers_to_measure.length > 5
                       ? "page-break-before"
                       : ""
                   }">
                         <h4>Health Recommendation Summary</h4>
                         <div class="biomarkers-container health-recommendation-container">
                               ${lab.health_recommendation_summary
                                 .map(
                                   (
                                     bm
                                   ) => `<div class="health-recommendation-item">
                                  
        <img src="icons/guidance.svg" alt="Recommendation Icon" class="inline-icon">
                                  <p>${handleMarkup(bm)}</p>
                                 </div>`
                                 )
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
