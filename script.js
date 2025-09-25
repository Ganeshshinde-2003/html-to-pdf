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
        "Hello Chaeyeon! Based on your lab results from July 2025 and your health assessment, we can see a few areas that might be contributing to your symptoms like fatigue, hair loss, and mood swings. Your thyroid-stimulating hormone (TSH) is within the normal range, but your free T3 and free T4 are also looking good, which is great for your metabolism and energy. However, your iron levels, specifically your ferritin, are on the lower side of optimal. Think of ferritin as your body's iron storage tank; when it's low, it's like running on an almost empty battery, which can definitely explain your **C1[fatigue]C1** and **C1[hair loss]C1**. Your lipid panel shows that your total cholesterol and LDL cholesterol are a bit high, and your non-HDL cholesterol is also elevated. These are important markers for heart health, and while they might not be directly causing your current symptoms, it's a good idea to keep an eye on them. Your Vitamin D level is optimal, which is fantastic for your immune system and mood. Your hormone levels (FSH, LH, Estradiol, Prolactin) appear to be within normal ranges for the follicular phase of your cycle, which is a good sign for hormonal balance. However, your testosterone is elevated, which can sometimes contribute to symptoms like hair loss and affect your energy. We also noted a slightly low MCHC, which is a measure of how much hemoglobin is in your red blood cells, and this could also play a role in your fatigue. Overall, focusing on improving your iron stores and supporting your hormonal balance will be key to helping you feel more energized and balanced.",
      biomarkers_tested_count: 93,
      biomarker_categories_summary: {
        description_text:
          "Out of your total 93 biomarker tests, 85 fall within optimal ranges, showing strong health markers. 3 need attention and monitoring to support your well-being. 5 require urgent action to address potential health concerns. This summary prioritizes your key health focus areas clearly.",
        optimal_count: 85,
        keep_in_mind_count: 3,
        attention_needed_count: 5,
      },
      detailed_biomarkers: [
        {
          name: "IRON, TOTAL",
          status: "optimal",
          status_label: "Good (Green)",
          result: "109 mcg/dL",
          range: "40-190 mcg/dL",
          why_it_matters:
            "Iron is crucial for carrying oxygen throughout your body, and low iron can lead to **C1[fatigue]C1**, **C1[hair loss]C1**, and **C1[mood swings]C1**. Your level is within the normal range, which is good, but for women, especially those experiencing fatigue, aiming for the higher end of the optimal range can be beneficial. Think of iron like the fuel for your red blood cells, helping them deliver energy to every part of your body. Keeping your iron levels robust supports sustained energy and can help prevent those afternoon energy crashes you mentioned.",
        },
        {
          name: "IRON BINDING CAPACITY",
          status: "optimal",
          status_label: "Good (Green)",
          result: "379 mcg/dL",
          range: "250-450 mcg/dL (calc)",
          why_it_matters:
            "Iron binding capacity (IBC) reflects how well your blood can transport iron. A good IBC means your body is ready to pick up and carry iron effectively. This works hand-in-hand with your iron levels to ensure your cells get the oxygen they need, which is vital for energy and overall well-being in women.",
        },
        {
          name: "% SATURATION",
          status: "optimal",
          status_label: "Good (Green)",
          result: "29 %",
          range: "16-45 % (calc)",
          why_it_matters:
            "Iron saturation tells us how much of your iron-binding capacity is actually being used to carry iron. Your level is in a good spot, indicating that your body is efficiently moving iron around. This is important for preventing **C1[fatigue]C1** and supporting healthy hair growth, common concerns for women.",
        },
        {
          name: "FERRITIN",
          status: "keep_in_mind",
          status_label: "Keep in Mind (Yellow)",
          result: "32 ng/mL",
          range: "16-154 ng/mL",
          why_it_matters:
            "Ferritin is your body's stored iron, like a backup supply. While your level is within the lab's normal range, for women, optimal levels are often considered higher, especially if you experience **C1[fatigue]C1** or **C1[hair loss]C1**. A level below 50 ng/mL can sometimes be associated with these symptoms. Think of ferritin as your iron savings account; even if you have enough for daily needs, a low savings account can make you vulnerable to energy dips.",
        },
        {
          name: "CREATININE, RANDOM URINE",
          status: "keep_in_mind",
          status_label: "Keep in Mind (Yellow)",
          result: "19 mg/dL",
          range: "20-275 mg/dL",
          why_it_matters:
            "Creatinine is a waste product from muscle activity. Your urine creatinine level is slightly below the reference range. While this isn't typically a major concern for women's health, it can sometimes indicate lower muscle mass or hydration levels. It's also used to help interpret other urine tests, like the albumin-to-creatinine ratio.",
        },
        {
          name: "ALBUMIN, URINE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "<0.2 mg/dL",
          range: "Not established",
          why_it_matters:
            "This test checks for protein in your urine. Finding very little or no protein is a good sign for your kidney health. Healthy kidneys are essential for filtering waste and maintaining balance in your body, which supports overall well-being for women.",
        },
        {
          name: "ALBUMIN/CREATININE RATIO, RANDOM URINE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "<30 mg/g creat",
          range: "<30 mg/g creat",
          why_it_matters:
            "This ratio helps assess kidney function by looking at protein in your urine relative to creatinine. Your result is excellent, indicating your kidneys are filtering waste effectively and not leaking significant protein. This is a positive sign for your overall health and supports the body's ability to manage hormones and energy.",
        },
        {
          name: "CHOLESTEROL, TOTAL",
          status: "attention_needed",
          status_label: "Needs Action (Red)",
          result: "238 mg/dL",
          range: "<200 mg/dL",
          why_it_matters:
            "Total cholesterol measures all the cholesterol in your blood. While cholesterol is essential for hormone production in women, a level above 200 mg/dL can increase your risk for heart disease over time. Think of it like the overall traffic volume on a highway; too much can lead to congestion. Managing this can support long-term cardiovascular health and hormonal balance.",
        },
        {
          name: "HDL CHOLESTEROL",
          status: "optimal",
          status_label: "Good (Green)",
          result: "85 mg/dL",
          range: "> OR = 50 mg/dL",
          why_it_matters:
            "HDL cholesterol is often called 'good' cholesterol because it helps remove excess cholesterol from your arteries. Your level is excellent! A high HDL is protective for heart health and is a great indicator of good metabolic function, which is important for women's energy and hormone regulation.",
        },
        {
          name: "TRIGLYCERIDES",
          status: "optimal",
          status_label: "Good (Green)",
          result: "67 mg/dL",
          range: "<150 mg/dL",
          why_it_matters:
            "Triglycerides are a type of fat in your blood. Keeping them below 150 mg/dL is important for heart health. Your level is great, suggesting your body is efficiently processing fats, which is a positive sign for your metabolism and energy levels.",
        },
        {
          name: "LDL-CHOLESTEROL",
          status: "attention_needed",
          status_label: "Needs Action (Red)",
          result: "137 mg/dL",
          range: "<100 mg/dL",
          why_it_matters:
            "LDL cholesterol is often referred to as 'bad' cholesterol because high levels can build up in your arteries. Your level is elevated, which can increase your risk for heart disease. For women, maintaining healthy cholesterol levels is key for long-term vitality and supporting the production of essential hormones.",
        },
        {
          name: "CHOL/HDLC RATIO",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2.8",
          range: "<5.0",
          why_it_matters:
            "This ratio compares your total cholesterol to your HDL ('good') cholesterol. A lower ratio is better for heart health. Your ratio is excellent, indicating a favorable balance between your cholesterol types, which is a positive sign for your cardiovascular system and overall metabolic health.",
        },
        {
          name: "NON HDL CHOLESTEROL",
          status: "attention_needed",
          status_label: "Needs Action (Red)",
          result: "153 mg/dL",
          range: "<130 mg/dL",
          why_it_matters:
            "Non-HDL cholesterol includes all the 'less healthy' cholesterol particles in your blood (like LDL and others). Your level is elevated, which means there's more 'unhealthy' cholesterol circulating. Managing this is important for reducing your long-term risk of heart disease and supporting overall hormonal health.",
        },
        {
          name: "HS CRP",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.6 mg/L",
          range: "<1.0",
          why_it_matters:
            "High-sensitivity C-reactive protein (hs-CRP) is a marker of inflammation in your body. Your level is excellent, indicating low inflammation. This is wonderful for your overall health, as chronic inflammation can impact energy, mood, and hormonal balance in women.",
        },
        {
          name: "HOMOCYSTEINE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "7.0 umol/L",
          range: "< or = 10.9 umol/L",
          why_it_matters:
            "Homocysteine is an amino acid that, when elevated, can be a marker for increased risk of heart disease and may be linked to deficiencies in B vitamins like folate and B12. Your level is optimal, which is great news for your cardiovascular health and suggests good B vitamin status.",
        },
        {
          name: "APOLIPOPROTEIN B",
          status: "attention_needed",
          status_label: "Needs Action (Red)",
          result: "98 mg/dL",
          range: "<90",
          why_it_matters:
            "Apolipoprotein B (ApoB) is a protein that carries cholesterol in your blood, particularly LDL. Your level is slightly elevated, indicating a higher number of these cholesterol-carrying particles. This is a strong indicator of cardiovascular risk, and managing it can support overall health, including hormonal balance and energy levels for women.",
        },
        {
          name: "GLUCOSE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "86 mg/dL",
          range: "65-99 mg/dL",
          why_it_matters:
            "Your fasting glucose level is excellent, indicating that your body is managing blood sugar well. Stable blood sugar is crucial for consistent energy throughout the day and can help prevent the afternoon energy crashes you've experienced. It also plays a role in hormone regulation.",
        },
        {
          name: "UREA NITROGEN (BUN)",
          status: "optimal",
          status_label: "Good (Green)",
          result: "8 mg/dL",
          range: "7-25 mg/dL",
          why_it_matters:
            "Blood Urea Nitrogen (BUN) is a measure of waste products in your blood, reflecting kidney function and hydration. Your level is well within the normal range, indicating your kidneys are working efficiently.",
        },
        {
          name: "CREATININE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.66 mg/dL",
          range: "0.50-0.96 mg/dL",
          why_it_matters:
            "Creatinine is a waste product from muscle metabolism, and this test helps assess kidney function. Your level is optimal, showing your kidneys are effectively filtering waste from your blood. Healthy kidney function is vital for overall detoxification and hormonal balance.",
        },
        {
          name: "EGFR",
          status: "optimal",
          status_label: "Good (Green)",
          result: "123 mL/min/1.73m2",
          range: "> OR = 60 mL/min/1.73m2",
          why_it_matters:
            "Estimated Glomerular Filtration Rate (eGFR) is a key indicator of kidney function. Your eGFR is excellent, meaning your kidneys are filtering waste efficiently. This is fundamental for overall health, including hormone metabolism and energy production.",
        },
        {
          name: "SODIUM",
          status: "optimal",
          status_label: "Good (Green)",
          result: "138 mmol/L",
          range: "135-146 mmol/L",
          why_it_matters:
            "Sodium is an electrolyte crucial for fluid balance, nerve function, and muscle contractions. Your level is perfectly balanced, which is important for maintaining hydration and energy levels.",
        },
        {
          name: "POTASSIUM",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.5 mmol/L",
          range: "3.5-5.3 mmol/L",
          why_it_matters:
            "Potassium is another vital electrolyte that plays a key role in nerve signaling, muscle function, and maintaining a healthy heart rhythm. Your level is well within the optimal range, supporting good energy and cellular function.",
        },
        {
          name: "CHLORIDE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "101 mmol/L",
          range: "98-110 mmol/L",
          why_it_matters:
            "Chloride works with sodium and potassium to maintain fluid balance and blood pressure. Your level is balanced, contributing to overall electrolyte harmony in your body.",
        },
        {
          name: "CARBON DIOXIDE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "28 mmol/L",
          range: "20-32 mmol/L",
          why_it_matters:
            "Carbon dioxide levels in your blood help maintain your body's acid-base balance, which is crucial for cellular function. Your level is within the optimal range, indicating good metabolic balance.",
        },
        {
          name: "CALCIUM",
          status: "optimal",
          status_label: "Good (Green)",
          result: "9.5 mg/dL",
          range: "8.6-10.2 mg/dL",
          why_it_matters:
            "Calcium is essential for bone health, muscle function, and nerve signaling. Your level is optimal, supporting strong bones and proper bodily functions. Adequate calcium is also important for women's hormonal health.",
        },
        {
          name: "PROTEIN, TOTAL",
          status: "optimal",
          status_label: "Good (Green)",
          result: "6.7 g/dL",
          range: "6.1-8.1 g/dL",
          why_it_matters:
            "Total protein levels reflect the amount of protein in your blood, which is vital for building and repairing tissues, immune function, and hormone transport. Your level is optimal, indicating good protein status, which supports muscle mass and overall bodily functions.",
        },
        {
          name: "ALBUMIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.1 g/dL",
          range: "3.6-5.1 g/dL",
          why_it_matters:
            "Albumin is a key protein in your blood that helps transport nutrients and hormones. Your level is optimal, suggesting good liver function and adequate protein intake, which supports hormone balance and energy.",
        },
        {
          name: "GLOBULIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2.6 g/dL",
          range: "1.9-3.7 g/dL (calc)",
          why_it_matters:
            "Globulins are proteins involved in immune function and transport. Your level is optimal, contributing to a healthy immune system and proper transport of substances in your blood.",
        },
        {
          name: "ALBUMIN/GLOBULIN RATIO",
          status: "optimal",
          status_label: "Good (Green)",
          result: "1.6",
          range: "1.0-2.5 (calc)",
          why_it_matters:
            "This ratio reflects the balance between albumin and globulin proteins in your blood. Your ratio is optimal, indicating a healthy balance between transport proteins and immune/other proteins, which is good for overall health and hormone balance.",
        },
        {
          name: "BILIRUBIN, TOTAL",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.7 mg/dL",
          range: "0.2-1.2 mg/dL",
          why_it_matters:
            "Bilirubin is a byproduct of red blood cell breakdown, and your level is within the normal range. This indicates your liver is processing waste products effectively.",
        },
        {
          name: "ALKALINE PHOSPHATASE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "40 U/L",
          range: "31-125 U/L",
          why_it_matters:
            "Alkaline phosphatase is an enzyme found in your liver, bones, and other tissues. Your level is optimal, suggesting good liver and bone health.",
        },
        {
          name: "AST",
          status: "optimal",
          status_label: "Good (Green)",
          result: "18 U/L",
          range: "10-30 U/L",
          why_it_matters:
            "AST is an enzyme found in the liver and other tissues. Your level is within the normal range, indicating good liver function.",
        },
        {
          name: "ALT",
          status: "optimal",
          status_label: "Good (Green)",
          result: "23 U/L",
          range: "6-29 U/L",
          why_it_matters:
            "ALT is another enzyme primarily found in the liver. Your level is within the normal range, which is a good sign for your liver health.",
        },
        {
          name: "HEMOGLOBIN A1c",
          status: "optimal",
          status_label: "Good (Green)",
          result: "5.4 %",
          range: "<5.7 %",
          why_it_matters:
            "Hemoglobin A1c gives us a picture of your average blood sugar levels over the past 2-3 months. Your result is excellent and indicates a low risk for diabetes. Stable blood sugar is crucial for consistent energy and can help prevent the afternoon energy dips you've experienced.",
        },
        {
          name: "URIC ACID",
          status: "optimal",
          status_label: "Good (Green)",
          result: "5.3 mg/dL",
          range: "2.5-7.0 mg/dL",
          why_it_matters:
            "Uric acid is a waste product in your blood. Your level is optimal, which is good for preventing issues like gout and indicates your body is processing purines effectively.",
        },
        {
          name: "GGT",
          status: "optimal",
          status_label: "Good (Green)",
          result: "8 U/L",
          range: "3-40 U/L",
          why_it_matters:
            "Gamma-Glutamyl Transferase (GGT) is an enzyme found mainly in the liver. Your level is well within the normal range, suggesting good liver health.",
        },
        {
          name: "AMYLASE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "29 U/L",
          range: "21-101 U/L",
          why_it_matters:
            "Amylase is an enzyme produced by your pancreas and salivary glands. Your level is normal, indicating your pancreas and salivary glands are functioning well.",
        },
        {
          name: "LIPASE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "9 U/L",
          range: "7-60 U/L",
          why_it_matters:
            "Lipase is another enzyme produced by your pancreas, crucial for digesting fats. Your level is normal, indicating your pancreas is working well.",
        },
        {
          name: "TSH",
          status: "optimal",
          status_label: "Good (Green)",
          result: "1.18 mIU/mL",
          range: "0.40-4.50",
          why_it_matters:
            "TSH (Thyroid Stimulating Hormone) is produced by your pituitary gland and tells your thyroid how much thyroid hormone to make. Your TSH is in a great spot, suggesting your thyroid is functioning well. This is important for regulating your metabolism, energy levels, and menstrual cycles.",
        },
        {
          name: "T4, FREE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "1.2 ng/dL",
          range: "0.8-1.8 ng/dL",
          why_it_matters:
            "Free T4 is a thyroid hormone that influences your metabolism and energy levels. Your level is optimal, which is great for maintaining consistent energy and supporting a healthy metabolism, important factors for women's well-being.",
        },
        {
          name: "T3, FREE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "3.1 pg/mL",
          range: "2.3-4.2 pg/mL",
          why_it_matters:
            "Free T3 is the active form of thyroid hormone that directly impacts your metabolism and energy. Your level is optimal, which is fantastic for ensuring your body's energy production is running smoothly, helping to combat **C1[fatigue]C1**.",
        },
        {
          name: "SED RATE BY MODIFIED WESTERGREN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2 mm/h",
          range: "< OR = 20 mm/h",
          why_it_matters:
            "The Sed Rate (Erythrocyte Sedimentation Rate) is a general marker for inflammation in the body. Your result is excellent, indicating no significant inflammation, which is great for your overall health and supports balanced hormonal function.",
        },
        {
          name: "WHITE BLOOD CELL COUNT",
          status: "optimal",
          status_label: "Good (Green)",
          result: "5.2 Thousand/uL",
          range: "3.8-10.8 Thousand/uL",
          why_it_matters:
            "White blood cells are key components of your immune system. Your count is within the normal range, indicating your immune system is functioning well.",
        },
        {
          name: "RED BLOOD CELL COUNT",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4.57 Million/uL",
          range: "3.80-5.10 Million/uL",
          why_it_matters:
            "Red blood cells are responsible for carrying oxygen throughout your body. Your count is optimal, which is great for energy levels and preventing **C1[fatigue]C1**.",
        },
        {
          name: "HEMOGLOBIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "13.1 g/dL",
          range: "11.7-15.5 g/dL",
          why_it_matters:
            "Hemoglobin is the protein in red blood cells that carries oxygen. Your level is optimal, which is excellent for energy production and preventing **C1[fatigue]C1**, especially important for women.",
        },
        {
          name: "HEMATOCRIT",
          status: "optimal",
          status_label: "Good (Green)",
          result: "41.8 %",
          range: "35.0-45.0 %",
          why_it_matters:
            "Hematocrit measures the percentage of your blood volume made up of red blood cells. Your level is optimal, supporting good oxygen transport and energy levels.",
        },
        {
          name: "MCV",
          status: "optimal",
          status_label: "Good (Green)",
          result: "91.5 fL",
          range: "80.0-100.0 fL",
          why_it_matters:
            "MCV (Mean Corpuscular Volume) indicates the average size of your red blood cells. Your MCV is optimal, suggesting your red blood cells are a healthy size, which is good for efficient oxygen delivery.",
        },
        {
          name: "MCH",
          status: "optimal",
          status_label: "Good (Green)",
          result: "28.7 pg",
          range: "27.0-33.0 pg",
          why_it_matters:
            "MCH (Mean Corpuscular Hemoglobin) measures the average amount of hemoglobin inside each red blood cell. Your level is optimal, indicating your red blood cells are carrying a good amount of oxygen-carrying protein.",
        },
        {
          name: "MCHC",
          status: "keep_in_mind",
          status_label: "Keep in Mind (Yellow)",
          result: "31.3 g/dL",
          range: "32.0-36.0 g/dL",
          why_it_matters:
            "MCHC (Mean Corpuscular Hemoglobin Concentration) reflects the concentration of hemoglobin within your red blood cells. Your level is slightly below the normal range. This can sometimes be associated with iron deficiency or affect how well your red blood cells carry oxygen, potentially contributing to **C1[fatigue]C1**.",
        },
        {
          name: "RDW",
          status: "optimal",
          status_label: "Good (Green)",
          result: "13.6 %",
          range: "11.0-15.0 %",
          why_it_matters:
            "RDW (Red Cell Distribution Width) measures the variation in the size of your red blood cells. Your RDW is within the optimal range, indicating your red blood cells are relatively uniform in size, which is good for efficient oxygen transport.",
        },
        {
          name: "PLATELET COUNT",
          status: "optimal",
          status_label: "Good (Green)",
          result: "270 Thousand/uL",
          range: "140-400 Thousand/uL",
          why_it_matters:
            "Platelets are essential for blood clotting. Your platelet count is within the normal range, indicating good blood clotting function.",
        },
        {
          name: "MPV",
          status: "optimal",
          status_label: "Good (Green)",
          result: "9.3 fL",
          range: "7.5-12.5 fL",
          why_it_matters:
            "MPV (Mean Platelet Volume) reflects the average size of your platelets. Your level is within the normal range, indicating healthy platelet size and function.",
        },
        {
          name: "ABSOLUTE NEUTROPHILS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2361 cells/uL",
          range: "1500-7800 cells/uL",
          why_it_matters:
            "Absolute neutrophils are a type of white blood cell that fights bacterial infections. Your count is within the normal range, indicating good immune function.",
        },
        {
          name: "ABSOLUTE LYMPHOCYTES",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2246 cells/uL",
          range: "850-3900 cells/uL",
          why_it_matters:
            "Absolute lymphocytes are another type of white blood cell important for immune responses, including fighting viruses. Your count is optimal, showing good immune system activity.",
        },
        {
          name: "ABSOLUTE MONOCYTES",
          status: "optimal",
          status_label: "Good (Green)",
          result: "442 cells/uL",
          range: "200-950 cells/uL",
          why_it_matters:
            "Absolute monocytes are a type of white blood cell that helps clear infections and debris. Your count is within the normal range, indicating healthy immune cell function.",
        },
        {
          name: "ABSOLUTE EOSINOPHILS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "109 cells/uL",
          range: "15-500 cells/uL",
          why_it_matters:
            "Absolute eosinophils are a type of white blood cell that can increase during allergic reactions or parasitic infections. Your count is normal, suggesting no significant allergic response or parasitic issue detected.",
        },
        {
          name: "ABSOLUTE BASOPHILS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "42 cells/uL",
          range: "0-200 cells/uL",
          why_it_matters:
            "Absolute basophils are a type of white blood cell involved in allergic responses. Your count is well within the normal range.",
        },
        {
          name: "NEUTROPHILS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "45.4 %",
          range: null,
          why_it_matters:
            "Neutrophils are a type of white blood cell that are a key part of your immune system. Your percentage is within a healthy range, indicating your immune system is functioning well.",
        },
        {
          name: "LYMPHOCYTES",
          status: "optimal",
          status_label: "Good (Green)",
          result: "43.2 %",
          range: null,
          why_it_matters:
            "Lymphocytes are another type of white blood cell crucial for your immune system. Your percentage is within a healthy range, supporting your body's defense mechanisms.",
        },
        {
          name: "MONOCYTES",
          status: "optimal",
          status_label: "Good (Green)",
          result: "8.5 %",
          range: null,
          why_it_matters:
            "Monocytes are a type of white blood cell that helps fight infections. Your percentage is within a healthy range, indicating good immune cell balance.",
        },
        {
          name: "EOSINOPHILS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2.1 %",
          range: null,
          why_it_matters:
            "Eosinophils are a type of white blood cell that can be involved in allergic responses. Your percentage is within a healthy range.",
        },
        {
          name: "BASOPHILS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0.8 %",
          range: null,
          why_it_matters:
            "Basophils are a type of white blood cell involved in allergic reactions. Your percentage is within a healthy range.",
        },
        {
          name: "COLOR",
          status: "optimal",
          status_label: "Good (Green)",
          result: "YELLOW",
          range: "YELLOW",
          why_it_matters:
            "The color of your urine is a simple indicator of hydration. Yellow is a good sign that you are well-hydrated.",
        },
        {
          name: "APPEARANCE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "CLEAR",
          range: "CLEAR",
          why_it_matters:
            "Clear urine appearance is normal and indicates good hydration and no significant abnormalities.",
        },
        {
          name: "SPECIFIC GRAVITY",
          status: "optimal",
          status_label: "Good (Green)",
          result: "1.003",
          range: "1.001-1.035",
          why_it_matters:
            "Specific gravity measures the concentration of solutes in your urine, reflecting hydration and kidney function. Your level is in a good range, indicating adequate hydration.",
        },
        {
          name: "PH",
          status: "optimal",
          status_label: "Good (Green)",
          result: "7.5",
          range: "5.0-8.0",
          why_it_matters:
            "The pH of your urine indicates its acidity or alkalinity. A pH of 7.5 is within the normal range, suggesting your body's acid-base balance is well-maintained.",
        },
        {
          name: "GLUCOSE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NEGATIVE",
          range: "NEGATIVE",
          why_it_matters:
            "Glucose in the urine is usually a sign of high blood sugar. Your result is negative, which is excellent and aligns with your normal blood glucose levels.",
        },
        {
          name: "BILIRUBIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NEGATIVE",
          range: "NEGATIVE",
          why_it_matters:
            "Bilirubin in urine can indicate liver issues. Your negative result is a good sign for your liver health.",
        },
        {
          name: "KETONES",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NEGATIVE",
          range: "NEGATIVE",
          why_it_matters:
            "Ketones in urine can indicate uncontrolled diabetes or prolonged fasting. Your negative result is normal and expected.",
        },
        {
          name: "OCCULT BLOOD",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NEGATIVE",
          range: "NEGATIVE",
          why_it_matters:
            "Blood in the urine can indicate various issues, including kidney problems or infection. Your negative result is a good sign for your urinary tract and kidney health.",
        },
        {
          name: "PROTEIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NEGATIVE",
          range: "NEGATIVE",
          why_it_matters:
            "Protein in the urine can be a sign of kidney damage. Your negative result is excellent for your kidney health.",
        },
        {
          name: "NITRITE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NEGATIVE",
          range: "NEGATIVE",
          why_it_matters:
            "Nitrites in urine can indicate a bacterial infection, like a UTI. Your negative result is a good sign that you do not have a common type of urinary tract infection.",
        },
        {
          name: "LEUKOCYTE ESTERASE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NEGATIVE",
          range: "NEGATIVE",
          why_it_matters:
            "Leukocyte esterase is an enzyme found in white blood cells, and its presence can indicate inflammation or infection in the urinary tract. Your negative result is a good sign.",
        },
        {
          name: "WBC",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NONE SEEN",
          range: "< OR = 5 /HPF",
          why_it_matters:
            "White blood cells in urine can indicate infection or inflammation. Your result of none seen is excellent for your urinary tract health.",
        },
        {
          name: "RBC",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NONE SEEN",
          range: "< OR = 2 /HPF",
          why_it_matters:
            "Red blood cells in urine can indicate bleeding in the urinary tract. Your result of none seen is excellent for your kidney and urinary tract health.",
        },
        {
          name: "SQUAMOUS EPITHELIAL CELLS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "0-5",
          range: "< OR = 5 /HPF",
          why_it_matters:
            "Squamous epithelial cells are normal cells found in the urinary tract. Seeing a few is normal; your result is within the expected range.",
        },
        {
          name: "BACTERIA",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NONE SEEN",
          range: "NONE SEEN /HPF",
          why_it_matters:
            "Bacteria in urine can indicate a urinary tract infection. Your result of none seen is excellent for your urinary tract health.",
        },
        {
          name: "HYALINE CAST",
          status: "optimal",
          status_label: "Good (Green)",
          result: "NONE SEEN",
          range: "NONE SEEN /LPF",
          why_it_matters:
            "Casts are tube-shaped particles that can form in the kidneys. Seeing none is normal and indicates healthy kidney function.",
        },
        {
          name: "VITAMIN B12",
          status: "optimal",
          status_label: "Good (Green)",
          result: "618 pg/mL",
          range: "200-1100 pg/mL",
          why_it_matters:
            "Vitamin B12 is essential for energy production, nerve function, and red blood cell formation. Your level is optimal, which is great for supporting your energy levels and nervous system health.",
        },
        {
          name: "FOLATE, SERUM",
          status: "optimal",
          status_label: "Good (Green)",
          result: ">24.0 ng/mL",
          range: ">5.4",
          why_it_matters:
            "Folate is crucial for cell growth, DNA synthesis, and energy production. Your serum folate level is excellent, indicating you have plenty of this important B vitamin, which supports energy and mood.",
        },
        {
          name: "LIPOPROTEIN (a)",
          status: "optimal",
          status_label: "Good (Green)",
          result: "15 nmol/L",
          range: "<75 nmol/L",
          why_it_matters:
            "Lipoprotein (a) is a particle that can increase your risk for heart disease. Your level is optimal, which is fantastic news for your cardiovascular health.",
        },
        {
          name: "CORTISOL, TOTAL",
          status: "optimal",
          status_label: "Good (Green)",
          result: "19.2 mcg/dL",
          range: "4.0-22.0",
          why_it_matters:
            "Cortisol is your body's primary stress hormone. Your level, measured in the morning, is within the optimal range. This suggests your body is managing stress effectively, which is important for energy, sleep, and hormonal balance in women.",
        },
        {
          name: "DHEA SULFATE",
          status: "optimal",
          status_label: "Good (Green)",
          result: "326 mcg/dL",
          range: "14-349 mcg/dL",
          why_it_matters:
            "DHEA-S is an adrenal hormone that is a precursor to other hormones like testosterone and estrogen. Your level is optimal, indicating your adrenal glands are producing this hormone well, which supports energy, mood, and libido.",
        },
        {
          name: "FSH",
          status: "optimal",
          status_label: "Good (Green)",
          result: "6.0 mIU/mL",
          range: "2.5-10.2",
          why_it_matters:
            "FSH (Follicle-Stimulating Hormone) helps regulate the menstrual cycle by stimulating the ovaries. Your level is within the normal range for the follicular phase, suggesting your reproductive signaling is on track.",
          cycle_impact: "Supports follicle development and ovulation.",
        },
        {
          name: "INSULIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "6.6 uIU/mL",
          range: "< or = 18.4",
          why_it_matters:
            "Insulin is a hormone that helps your body use glucose for energy. Your fasting insulin level is optimal, indicating your body is sensitive to insulin and managing blood sugar effectively. This is great for sustained energy and can help prevent hormonal imbalances.",
        },
        {
          name: "LH",
          status: "optimal",
          status_label: "Good (Green)",
          result: "11.4 mIU/mL",
          range: "1.9-12.5",
          why_it_matters:
            "LH (Luteinizing Hormone) plays a role in ovulation and hormone production in women. Your level is within the normal range for the follicular phase, indicating good communication between your brain and ovaries.",
          cycle_impact:
            "Triggers ovulation and supports progesterone production.",
        },
        {
          name: "PROLACTIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "7.0 ng/mL",
          range: "3.0-30.0",
          why_it_matters:
            "Prolactin is a hormone that can affect ovulation and menstrual cycles if it's too high. Your level is optimal for a non-pregnant female, which is great for regular periods and reproductive health.",
          cycle_impact:
            "High levels can disrupt ovulation and menstrual cycles.",
        },
        {
          name: "ESTRADIOL",
          status: "optimal",
          status_label: "Good (Green)",
          result: "79 pg/mL",
          range: "19-144",
          why_it_matters:
            "Estradiol is the primary estrogen hormone in women, crucial for reproductive health, bone strength, and mood. Your level is within the normal range for the follicular phase, supporting a healthy menstrual cycle and overall well-being.",
          cycle_impact:
            "Essential for follicle development, uterine lining growth, and mood regulation.",
        },
        {
          name: "SEX HORMONE BINDING GLOBULIN",
          status: "optimal",
          status_label: "Good (Green)",
          result: "102 nmol/L",
          range: "17-124 nmol/L",
          why_it_matters:
            "SHBG binds to sex hormones like testosterone and estrogen, influencing how much is available in your body. Your level is optimal, suggesting a good balance of free and bound hormones, which is important for energy and mood.",
        },
        {
          name: "MAGNESIUM, RBC",
          status: "optimal",
          status_label: "Good (Green)",
          result: "5.2 mg/dL",
          range: "4.0-6.4 mg/dL",
          why_it_matters:
            "Magnesium is a vital mineral involved in hundreds of bodily processes, including energy production, muscle function, and stress management. Your red blood cell magnesium level is optimal, which is great for supporting your energy, sleep, and mood, especially when dealing with stress.",
        },
        {
          name: "TESTOSTERONE, TOTAL, MS",
          status: "attention_needed",
          status_label: "Needs Action (Red)",
          result: "81 ng/dL",
          range: "2-45 ng/dL",
          why_it_matters:
            "Testosterone is an important hormone for women, influencing energy, mood, libido, and muscle mass. Your level is elevated, which can sometimes contribute to symptoms like **C1[hair loss]C1**, increased energy, or mood changes. Supporting hormonal balance is key to feeling your best.",
        },
        {
          name: "VITAMIN D,25-OH,TOTAL,IA",
          status: "optimal",
          status_label: "Good (Green)",
          result: "40 ng/mL",
          range: "30-100 ng/mL",
          why_it_matters:
            "Vitamin D is crucial for immune function, bone health, and mood regulation. Your level is optimal, which is fantastic for supporting your overall well-being and can help with energy and mood stability.",
        },
        {
          name: "MERCURY, BLOOD",
          status: "optimal",
          status_label: "Good (Green)",
          result: "4 mcg/L",
          range: "<=10 mcg/L",
          why_it_matters:
            "Mercury is a heavy metal that can accumulate in the body and potentially cause health issues. Your blood mercury level is well within the safe range, indicating no significant exposure or accumulation.",
        },
      ],
      crucial_biomarkers_to_measure: [
        {
          name: "FERRITIN",
          importance:
            "Test Ferritin to check your stored iron levels, as low levels can contribute to **C1[fatigue]C1** and **C1[hair loss]C1**.",
        },
        {
          name: "TESTOSTERONE, TOTAL, MS",
          importance:
            "Test Testosterone to understand its impact on your energy and mood, as your current level is elevated and may be contributing to **C1[hair loss]C1**.",
        },
        {
          name: "LDL CHOLESTEROL",
          importance:
            "Retest LDL Cholesterol to monitor your heart health, as your current level is elevated and may impact long-term well-being.",
        },
        {
          name: "NON HDL CHOLESTEROL",
          importance:
            "Retest Non-HDL Cholesterol to monitor your heart health, as your current level is elevated and may impact long-term well-being.",
        },
        {
          name: "APOLIPOPROTEIN B",
          importance:
            "Retest Apolipoprotein B to monitor your cardiovascular risk, as your current level is elevated and may impact long-term well-being.",
        },
        {
          name: "MCH",
          importance:
            "Retest MCH to assess red blood cell health, as your current level is slightly low and may contribute to **C1[fatigue]C1**.",
        },
        {
          name: "MCHC",
          importance:
            "Retest MCHC to assess red blood cell health, as your current level is slightly low and may contribute to **C1[fatigue]C1**.",
        },
      ],
      health_recommendation_summary: [
        "Focus on increasing your intake of iron-rich foods like lean red meat, spinach, and lentils to improve your ferritin levels and combat **C1[fatigue]C1** and **C1[hair loss]C1**.",
        "Consider a gentle iron supplement, like ferrous bisglycinate, if dietary changes aren't enough, but always check with your healthcare provider first.",
        "Incorporate stress-management techniques like yoga and meditation, which you already practice, to help balance hormones and improve energy.",
        "Review your diet to support heart health by reducing processed foods and focusing on whole, unprocessed options to help manage elevated cholesterol.",
        "Retest your iron panel (Ferritin, Iron, TIBC) in 3 months to see how your levels are responding to dietary changes.",
        "Consider retesting your hormone levels, particularly testosterone, during a specific phase of your cycle (e.g., day 3 of your period) for a more complete picture if symptoms persist.",
        "Discuss your elevated cholesterol markers (Total Cholesterol, LDL, Non-HDL, ApoB) with your healthcare provider to create a personalized plan.",
      ],
    },
    four_pillars: {
      introduction:
        "Your health journey shows a focus on hormonal balance and energy. While you're doing well with some aspects like sleep quality and regular exercise, we can focus on optimizing your nutrition, movement, and stress management to support your hormonal health and reduce fatigue.",
      pillars: [
        {
          name: "Eat Well",
          score: 5,
          score_rationale: [
            "Your 'Eat Well' score is 5 because while you eat occasionally processed foods and drink moderate caffeine, your meal schedule is somewhat irregular, and you experience afternoon energy crashes.",
            "Eating regular, balanced meals helps stabilize your blood sugar and energy levels throughout the day.",
          ],
          why_it_matters:
            "Eating nourishing foods helps provide your body with the building blocks it needs to create hormones, which can help with **C1[bloating]C1** and **C1[mood swings]C1**.",
          root_cause_correlation:
            "A balanced diet rich in fiber and nutrients can help regulate your digestion, addressing **C1[regular bloating]C1** and **C1[constipation]C1**.",
          science_based_explanation:
            "Fiber acts like a gentle broom for your digestive system, helping to move things along smoothly and bind to excess hormones, which can ease **C1[bloating]C1** and support hormonal balance.",
          additional_guidance: {
            description:
              "To support your hormonal balance and energy levels, here are some food recommendations.",
            structure: {
              recommended_foods: [
                {
                  name: "Leafy Greens",
                  description:
                    "Spinach, kale, and other greens are packed with vitamins and minerals that support hormone production and energy, like magnesium which can help with **C1[fatigue]C1**.",
                },
                {
                  name: "Lean Proteins",
                  description:
                    "Chicken, fish, beans, and lentils provide the amino acids your body needs to build hormones and help you feel full, supporting stable energy and reducing **C1[afternoon energy crashes]C1**.",
                },
                {
                  name: "Healthy Fats",
                  description:
                    "Avocado, nuts, seeds, and olive oil are crucial for hormone synthesis and can help reduce inflammation, which may contribute to **C1[headaches]C1**.",
                },
                {
                  name: "Complex Carbohydrates",
                  description:
                    "Whole grains, sweet potatoes, and quinoa provide sustained energy release, helping to prevent **C1[energy dips]C1** and support your mood.",
                },
              ],
              cautious_foods: [
                {
                  name: "Excessive Caffeine",
                  description:
                    "While you consume 1-2 cups of coffee, relying on it to combat **C1[frequent daytime fatigue]C1** can disrupt sleep and stress hormones. Consider gradually reducing intake or switching to herbal teas.",
                },
                {
                  name: "Refined Sugars",
                  description:
                    "These can cause rapid blood sugar spikes and crashes, worsening **C1[energy dips]C1** and potentially impacting mood. Limit sweets and sugary drinks.",
                },
                {
                  name: "Highly Processed Foods",
                  description:
                    "These often lack essential nutrients and can contribute to inflammation and digestive issues like **C1[bloating]C1**. Aim to reduce intake to less than once a week.",
                },
              ],
            },
          },
        },
        {
          name: "Move Well",
          score: 8,
          score_rationale: [
            "Your 'Move Well' score is 8 because you exercise 2-3 times per week with yoga and resistance training, which is great for building strength and managing stress.",
            "Consistent movement is key for hormonal balance and energy.",
          ],
          why_it_matters:
            "Regular movement helps your body use energy efficiently and can improve circulation, which is beneficial for managing **C1[fatigue]C1** and supporting overall hormonal health.",
          root_cause_correlation:
            "Strength training can help improve body composition and muscle mass, which is important for metabolism and can indirectly support hormonal balance, potentially helping with **C1[loss of muscle mass]C1**.",
          science_based_explanation:
            "Resistance training builds muscle, which acts like a metabolic engine, helping to regulate blood sugar and energy levels, thereby reducing **C1[afternoon energy crashes]C1**.",
          additional_guidance: {
            description:
              "You're already doing a great job with your exercise routine. Here are some ways to optimize it further.",
            structure: {
              recommended_workouts: [
                {
                  name: "Continue Yoga",
                  description:
                    "Your yoga practice is excellent for stress reduction and flexibility, which can help manage **C1[high stress levels]C1** and **C1[mood swings]C1**.",
                },
                {
                  name: "Incorporate Interval Training",
                  description:
                    "Adding short bursts of higher intensity exercise (like brisk walking or cycling intervals) 1-2 times a week can boost metabolism and improve cardiovascular health, helping with **C1[fatigue]C1**.",
                },
                {
                  name: "Focus on Compound Strength Movements",
                  description:
                    "Continue with resistance training, focusing on exercises that work multiple muscle groups (like squats, deadlifts, and rows) to maximize muscle building and metabolic benefits.",
                },
              ],
              avoid_habits_move: [
                {
                  name: "Overtraining",
                  description:
                    "While you exercise regularly, be mindful not to overdo it, as excessive exercise can sometimes disrupt hormonal balance and increase **C1[fatigue]C1**.",
                },
                {
                  name: "Sedentary Periods",
                  description:
                    "Try to break up long periods of sitting with short walks or stretches, especially if you experience **C1[daytime fatigue]C1**.",
                },
              ],
            },
          },
        },
        {
          name: "Sleep Well",
          score: 7,
          score_rationale: [
            "Your 'Sleep Well' score is 7 because you get 6-7 hours of sleep and describe your quality as good, with infrequent difficulty falling asleep.",
            "However, you do experience frequent daytime fatigue, suggesting sleep quality or timing could be optimized.",
          ],
          why_it_matters:
            "Quality sleep is crucial for hormone regulation, including stress hormones like cortisol, and can significantly impact your energy levels and **C1[mood swings]C1**.",
          root_cause_correlation:
            "Consistent sleep patterns help regulate your body's natural rhythms, which can improve energy and reduce **C1[frequent daytime fatigue]C1** and **C1[afternoon energy crashes]C1**.",
          science_based_explanation:
            "During sleep, your body repairs and regenerates, and hormone levels are balanced. Poor or insufficient sleep can disrupt this process, leading to increased **C1[fatigue]C1** and hormonal imbalances.",
          additional_guidance: {
            description:
              "While your sleep is generally good, the frequent daytime fatigue suggests we can enhance your sleep hygiene.",
            structure: {
              recommended_recovery_tips: [
                {
                  name: "Consistent Sleep Schedule",
                  description:
                    "Aim to go to bed and wake up around the same time each day, even on weekends. This helps regulate your body's internal clock, improving sleep quality and reducing **C1[daytime fatigue]C1**.",
                },
                {
                  name: "Wind-Down Routine",
                  description:
                    "Create a relaxing routine before bed, such as reading, gentle stretching, or a warm bath. This signals to your body that it's time to rest, helping with **C1[difficulty falling asleep]C1**.",
                },
                {
                  name: "Optimize Sleep Environment",
                  description:
                    "Ensure your bedroom is dark, quiet, and cool. This environment promotes deeper, more restorative sleep, which can combat **C1[frequent daytime fatigue]C1**.",
                },
                {
                  name: "Mindfulness and Deep Breathing",
                  description:
                    "Practicing deep breathing exercises before bed can calm your nervous system, helping you relax and fall asleep more easily, especially if you experience **C1[high stress levels]C1**.",
                },
              ],
              avoid_habits_rest_recover: [
                {
                  name: "Late-Night Caffeine or Heavy Meals",
                  description:
                    "Consuming caffeine or large meals close to bedtime can interfere with sleep quality, potentially worsening **C1[daytime fatigue]C1**.",
                },
                {
                  name: "Screen Time Before Bed",
                  description:
                    "The blue light emitted from screens can suppress melatonin, a hormone that regulates sleep. Try to avoid screens for at least an hour before bed.",
                },
              ],
            },
          },
        },
        {
          name: "Recover Well",
          score: 4,
          score_rationale: [
            "Your 'Recover Well' score is 4 because you report high stress levels that frequently impact your mood and energy, and you experience frequent daytime fatigue.",
            "While you practice stress-reducing techniques, the impact of stress on your daily life indicates a need for more robust recovery strategies.",
          ],
          why_it_matters:
            "Managing stress is vital for hormonal balance, as chronic stress can lead to elevated cortisol, impacting your menstrual cycle, energy, and **C1[hair loss]C1**.",
          root_cause_correlation:
            "High stress can disrupt your digestive system, contributing to **C1[regular bloating]C1**, **C1[gas]C1**, and **C1[constipation]C1**.",
          science_based_explanation:
            "When you're stressed, your body releases cortisol, a hormone that can interfere with reproductive hormones and nutrient absorption, potentially leading to **C1[fatigue]C1** and **C1[hair loss]C1**.",
          additional_guidance: {
            description:
              "You're already using helpful techniques like yoga and meditation. Let's explore ways to deepen your recovery and manage stress more effectively.",
            structure: {
              recommended_recovery_tips: [
                {
                  name: "Prioritize Stress Management",
                  description:
                    "Continue with your yoga, meditation, and deep breathing. Consider adding journaling to process your thoughts and emotions, which can help reduce the impact of **C1[high stress levels]C1** on your **C1[mood swings]C1**.",
                },
                {
                  name: "Mindful Eating",
                  description:
                    "Pay attention to how different foods make you feel. Eating slowly and savoring your meals can improve digestion and reduce **C1[bloating]C1**.",
                },
                {
                  name: "Hydration",
                  description:
                    "You're drinking a good amount of water, which is great for overall health and can help with **C1[fatigue]C1** and digestion.",
                },
                {
                  name: "Magnesium Supplement",
                  description:
                    "You are taking Magnesium, which is excellent for stress management. Magnesium helps calm your nervous system, like putting your stress alarm on silent mode, which is especially important if you feel anxious before your period. It can also help with **C1[fatigue]C1** and **C1[mood swings]C1**.",
                },
              ],
              avoid_habits_rest_recover: [
                {
                  name: "Over-scheduling",
                  description:
                    "Try to build in downtime and avoid overcommitting, as this can contribute to **C1[high stress levels]C1** and **C1[frequent daytime fatigue]C1**.",
                },
                {
                  name: "Skipping Meals",
                  description:
                    "Irregular eating can destabilize blood sugar and exacerbate stress responses, potentially worsening **C1[energy dips]C1** and **C1[mood swings]C1**.",
                },
              ],
            },
          },
        },
      ],
    },
    supplements: {
      description:
        "Based on your health assessment and lab results, here are some targeted supplement recommendations to help you feel your best. These are designed to support your **C1[hormonal balance]C1**, **C1[energy levels]C1**, and overall well-being.",
      structure: {
        recommendations: [
          {
            name: "Magnesium Glycinate",
            rationale:
              "You reported **C1[mood swings]C1**, **C1[fatigue]C1**, and **C1[afternoon energy crashes]C1**. Magnesium is like a calming balm for your nervous system, helping to regulate stress hormones and improve energy. It can also help with bloating and headaches, which you experience during your cycle.",
            expected_outcomes:
              "May help to **C1[reduce stress]C1**, improve **C1[sleep quality]C1**, and boost **C1[energy levels]C1**, making your cycle symptoms more manageable.",
            dosage_and_timing:
              "200-400 mg daily, preferably in the evening to support relaxation and sleep.",
            situational_cyclical_considerations:
              "Can be taken daily throughout your cycle. Consider increasing to 400 mg in the week leading up to your period if you notice increased PMS symptoms like bloating or moodiness.",
          },
          {
            name: "Vitamin D3",
            rationale:
              "Your Vitamin D level is **C2[40 ng/mL]C2**, which is within the optimal range, but it's always good to ensure you're maintaining it, especially given your reported **C1[fatigue]C1**. Vitamin D plays a crucial role in hormone production, immune function, and mood regulation, all vital for women's health.",
            expected_outcomes:
              "Supports **C1[stable energy]C1**, **C1[improved mood]C1**, and overall immune health.",
            dosage_and_timing:
              "2000-4000 IU daily, with a meal for better absorption.",
            situational_cyclical_considerations:
              "Take daily. Levels can fluctuate seasonally, so consistent intake is key.",
          },
          {
            name: "Omega-3 Fatty Acids (EPA/DHA)",
            rationale:
              "You are already taking Omega-3s, which is great! These are important for reducing inflammation, supporting hormone balance, and improving mood. Given your **C1[mood swings]C1** and **C1[bloating]C1**, continuing these can be very beneficial.",
            expected_outcomes:
              "Helps to **C1[reduce inflammation]C1**, support **C1[hormonal balance]C1**, and improve **C1[mood and cognitive function]C1**.",
            dosage_and_timing:
              "1000-2000 mg combined EPA and DHA daily, with a meal.",
            situational_cyclical_considerations:
              "Take daily. Can be particularly helpful for managing inflammatory symptoms like bloating.",
          },
          {
            name: "Iron Bisglycinate",
            rationale:
              "While your iron levels are within the standard range, your Ferritin is **C2[32 ng/mL]C2**. For women, a more optimal range for energy and preventing hair loss is often considered to be above 50 ng/mL. Low ferritin can contribute to **C1[fatigue]C1** and **C1[hair loss]C1**, which you've reported.",
            expected_outcomes:
              "Aims to improve **C1[energy levels]C1** and reduce **C1[hair thinning]C1** by ensuring your body has adequate iron stores.",
            dosage_and_timing:
              "25-50 mg of elemental iron daily, taken on an empty stomach if tolerated, or with a small snack. Avoid taking with calcium or caffeine.",
            situational_cyclical_considerations:
              "Take daily. If you experience constipation, try taking it with a small amount of food or switching to a gentler form like bisglycinate.",
          },
          {
            name: "B Complex Vitamins",
            rationale:
              "You mentioned experiencing **C1[afternoon energy crashes]C1** and **C1[frequent daytime fatigue]C1**. B vitamins are essential for energy production and stress management. They act like tiny powerhouses in your cells, helping to convert food into usable energy, which can combat those energy dips.",
            expected_outcomes:
              "Supports **C1[sustained energy]C1** throughout the day and helps your body manage **C1[stress]C1** more effectively.",
            dosage_and_timing:
              "One capsule daily, preferably in the morning with breakfast.",
            situational_cyclical_considerations:
              "Take daily. Stress can deplete B vitamins, so consistent intake is beneficial.",
          },
        ],
        conclusion:
          "These recommendations are a starting point to help you feel more balanced and energized. Remember to listen to your body and consult with your healthcare provider before starting any new supplement regimen, especially to ensure they are right for you and won't interact with anything else.",
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
    // Add a check to ensure text is a string and not null or undefined
    if (typeof text !== "string" || text === null) {
      console.warn("handleMarkup received invalid input:", text);
      return ""; // Return an empty string to prevent the error
    }

    // Your original logic remains the same
    return text.replace(
      /\*\*C(1|2)\[(.*?)\]C\1\*\*/g,
      (_, p1, p2) => `<span class="c${p1}">${p2}</span>`
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
                               <p class="range-p">Range: ${
                                 bm.range
                                   ?.replace(":", ":</b><br>")
                                   .replaceAll(", ", "<br>") ?? "-"
                               }</p>
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
