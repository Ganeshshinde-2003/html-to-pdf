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
        "Your lab results show some key areas to focus on to improve your hormonal health. Your **C1[low estradiol]C1** level could be contributing to your **C1[menstrual cramps]C1**, **C1[PMS symptoms]C1**, and **C1[bloating]C1**.  Additionally, your **C2[high cortisol]C2** (**C2[20.3 ug/dL]C2**) and **C2[high SHBG]C2** (**C2[130.0 nmol/L]C2**) levels may be related to your **C1[work and life stress]C1** and could also be impacting your estrogen levels. Let's work together to address these imbalances and support your overall well-being.",
      biomarkers_tested_count: 15,
      biomarker_categories_summary: {
        description_text:
          "Out of **C1[12]C1** tests, **C2[7]C2** are good, **C2[2]C2** need watching, and **C2[3]C2** need action.",
        optimal_count: 10,
        keep_in_mind_count: 1,
        attention_needed_count: 4,
      },
      detailed_biomarkers: [
        {
          name: "Cholesterol, Total",
          status: "optimal",
          status_label: "Good (Green)",
          result: "168 mg/dL",
          range: "100-199",
          cycle_impact:
            "Cholesterol is a building block for hormones, but high levels can sometimes interfere with hormone balance.",
          why_it_matters:
            "Your total cholesterol is within a healthy range, which is important for overall health and hormone production.",
        },
        {
          name: "Triglycerides",
          status: "optimal",
          status_label: "Good (Green)",
          result: "59 mg/dL",
          range: "0-149",
          cycle_impact:
            "High triglycerides can sometimes affect your cycle, but yours are in a good range.",
          why_it_matters:
            "Healthy triglyceride levels are important for heart health and metabolic function, which can indirectly influence your hormones.",
        },
        {
          name: "HDL Cholesterol",
          status: "optimal",
          status_label: "Good (Green)",
          result: "75 mg/dL",
          range: ">39",
          cycle_impact:
            "HDL helps remove excess cholesterol, indirectly supporting hormone balance.",
          why_it_matters:
            "Having a good HDL level is protective against heart disease and can contribute to overall hormonal health.",
        },
        {
          name: "VLDL Cholesterol Cal",
          status: "optimal",
          status_label: "Good (Green)",
          result: "12 mg/dL",
          range: "5-40",
          cycle_impact:
            "VLDL carries triglycerides, which can impact hormones if levels are too high.",
          why_it_matters:
            "Your VLDL is within the healthy range, suggesting good management of triglycerides and potential positive effects on hormone balance.",
        },
        {
          name: "LDL Chol Calc (NIH)",
          status: "optimal",
          status_label: "Good (Green)",
          result: "81 mg/dL",
          range: "0-99",
          cycle_impact:
            "High LDL can sometimes affect hormone balance, but yours is within the optimal range.",
          why_it_matters:
            "Maintaining a healthy LDL level is important for heart health and can indirectly support hormonal balance.",
        },
        {
          name: "Hemoglobin A1c",
          status: "optimal",
          status_label: "Good (Green)",
          result: "5.5 %",
          range: "4.8-5.6",
          cycle_impact: "Balanced blood sugar helps regulate your cycle.",
          why_it_matters:
            "Your A1c is within the healthy range, which is important for stable blood sugar levels and can positively influence hormone regulation.",
        },
        {
          name: "T4,Free(Direct)",
          status: "optimal",
          status_label: "Good (Green)",
          result: "1.11 ng/dL",
          range: "0.82-1.77",
          cycle_impact:
            "Thyroid hormones like T4 can influence your cycle regularity.",
          why_it_matters:
            "Your free T4 level is within the normal range, indicating healthy thyroid function, which is crucial for hormonal balance.",
        },
        {
          name: "TSH",
          status: "keep_in_mind",
          status_label: "Keep in Mind (Yellow)",
          result: "4.310 uIU/mL",
          range: "0.450-4.500",
          cycle_impact:
            "TSH helps regulate your thyroid, which can affect your cycle.",
          why_it_matters:
            "Your TSH is on the higher end of the normal range. While still within normal limits, it's worth monitoring as it could indicate potential suboptimal thyroid function in the future, which can impact your menstrual cycle and overall hormonal health.",
        },
        {
          name: "Prolactin",
          status: "optimal",
          status_label: "Good (Green)",
          result: "23.8 ng/mL",
          range: "4.8-33.4",
          cycle_impact:
            "Prolactin is involved in milk production and can affect your cycle.",
          why_it_matters:
            "Your prolactin level is within the normal range, which is important for reproductive health and hormonal balance.",
        },
        {
          name: "Estradiol",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "<5.0 pg/mL",
          range:
            "Adult Female             Range\n                                     Follicular phase     12.5 - 166.0\n                                     Ovulation phase      85.8 - 498.0\n                                     Luteal phase         43.8 - 211.0\n                                     Postmenopausal       <6.0 -  54.7\n                                    Pregnancy\n                                     1st trimester     215.0 - >4300.0",
          cycle_impact:
            "Low estradiol can cause irregular periods, **C1[cramps]C1**, and **C1[PMS symptoms]C1**.",
          why_it_matters:
            "Your estradiol is low, which could explain your **C1[menstrual cramps]C1**, **C1[PMS]C1**, and **C1[bloating]C1**. Estradiol is crucial for cycle regulation and overall hormonal health.",
        },
        {
          name: "Testosterone, Total, LC/MS",
          status: "optimal",
          status_label: "Good (Green)",
          result: "22 ng/dL",
          range:
            "Adult Females\n  Premenopausal  10 - 55\n  Postmenopausal  7 - 40",
          cycle_impact:
            "Testosterone plays a role in your cycle, though high levels can cause irregularities.",
          why_it_matters:
            "Your testosterone level is within the normal range for premenopausal women, which is important for maintaining a healthy menstrual cycle and overall hormonal balance.",
        },
        {
          name: "Progesterone",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "0.2 ng/mL",
          range:
            "Follicular phase       0.1 -   0.9\n                                    Luteal phase           1.8 -  23.9\n                                    Ovulation phase        0.1 -  12.0\n                                    Pregnant\n                                       First trimester    11.0 -  44.3\n                                       Second trimester   25.4 -  83.3\n                                       Third trimester    58.7 - 214.0\n                                    Postmenopausal         0.0 -   0.1",
          cycle_impact:
            "Progesterone helps regulate your cycle and prepares your body for pregnancy.",
          why_it_matters:
            "Your progesterone is low, which, along with low estradiol, could be contributing to your **C1[menstrual symptoms]C1**. Progesterone is essential for a healthy luteal phase (the second half of your cycle).",
        },
        {
          name: "Triiodothyronine (T3), Free",
          status: "optimal",
          status_label: "Good (Green)",
          result: "2.7 pg/mL",
          range: "2.0-4.4",
          cycle_impact:
            "Thyroid hormones like T3 can influence your cycle regularity.",
          why_it_matters:
            "Your free T3 is within the normal range, which is important for healthy thyroid function and hormonal balance.",
        },
        {
          name: "Sex Horm Binding Glob, Serum",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "130.0 nmol/L",
          range: "24.6-122.0",
          cycle_impact:
            "SHBG influences how much of your hormones are available to your body.",
          why_it_matters:
            "Your SHBG is high, which can lower the amount of available estrogen and testosterone in your body. This could be related to your **C1[stress levels]C1** and may be contributing to your **C1[low estradiol]C1**.",
        },
        {
          name: "Cortisol - AM",
          status: "attention_needed",
          status_label: "Needs Attention (Red)",
          result: "20.3 ug/dL",
          range: "6.2-19.4",
          cycle_impact: "High cortisol from stress can disrupt your cycle.",
          why_it_matters:
            "Your cortisol is high, likely due to your reported **C1[work and life stress]C1**.  Chronically high cortisol can disrupt your menstrual cycle and other hormonal functions.",
        },
      ],
      crucial_biomarkers_to_measure: [
        {
          name: "DHEA, Serum",
          importance:
            "Testing your DHEA-S levels can provide additional insights into your hormonal health and how your body responds to stress, given your **C2[high cortisol]C2** (**C2[20.3 ug/dL]C2**).",
        },
      ],
      health_recommendation_summary: [
        "Consider retesting your DHEA, Serum to get a more complete picture of your adrenal health and stress response.",
        "Prioritize stress management techniques like meditation, yoga, or spending time in nature to help lower your **C2[high cortisol]C2** levels (**C2[20.3 ug/dL]C2**).",
        "Focus on a balanced diet rich in whole foods, fiber, and healthy fats to support hormone production and manage **C1[bloating]C1**.",
        "Talk to your doctor about your **C2[low estradiol]C2** (**C2[<5.0 pg/mL]C2**) and **C2[low progesterone]C2** (**C2[0.2 ng/mL]C2**) levels to discuss potential underlying causes and explore options to support your menstrual cycle and hormonal health.",
      ],
    },
    four_pillars: {
      introduction:
        "Your health assessment and lab results reveal some key areas for improvement across the four pillars of wellness. Your **C1[inconsistent eating habits]C1** and **C1[sedentary lifestyle]C1** are impacting your energy levels and hormonal balance.  Your **C1[high cortisol]C1** (**C2[20.3 ug/dL]C2**) and **C1[low estradiol]C1** (**C2[<5.0 pg/mL]C2**) levels suggest potential hormonal imbalances that can be addressed through targeted lifestyle changes. Let's explore how we can optimize each pillar for better hormonal harmony.",
      pillars: [
        {
          name: "Eat Well",
          score: 6,
          score_rationale: [
            "Your Eat Well score is a 6 because your **C1[inconsistent eating habits]C1** could be contributing to your hormonal imbalances and symptoms like **C1[bloating]C1** and **C1[constipation]C1**.",
            "Regular, balanced meals are crucial for stable blood sugar and hormone production.",
          ],
          why_it_matters:
            "Nourishing your body with the right foods is like providing your cells with the premium fuel they need to function optimally. This is especially important for hormone production, which influences everything from your mood and energy levels to your menstrual cycle and sleep.",
          root_cause_correlation:
            "Addressing your **C1[inconsistent eating habits]C1** can help regulate your blood sugar, which in turn can positively influence your **C1[low estradiol]C1** and **C1[high cortisol]C1** levels.  A balanced diet rich in fiber can also improve your **C1[constipation]C1**.",
          science_based_explanation:
            "When your blood sugar fluctuates, it can disrupt the delicate balance of your hormones.  Fiber helps regulate digestion and supports the elimination of excess hormones, which can improve symptoms like **C1[bloating]C1**.",
          additional_guidance: {
            description:
              "Prioritizing consistent, balanced meals and snacks will support your hormonal health.  Here are some recommendations based on your reported symptoms and lab results:",
            structure: {
              recommended_foods: [
                {
                  name: "Cruciferous Vegetables (broccoli, cauliflower, Brussels sprouts)",
                  description:
                    "These veggies contain compounds that support estrogen metabolism, which can be beneficial given your **C1[low estradiol]C1**.",
                },
                {
                  name: "Fiber-rich foods (beans, lentils, oats)",
                  description:
                    "Fiber promotes gut health and helps regulate bowel movements, which can help with your **C1[constipation]C1**.",
                },
                {
                  name: "Magnesium-rich foods (dark leafy greens, almonds, avocados)",
                  description:
                    "Magnesium can help reduce stress and improve sleep quality, which is important given your **C1[high cortisol]C1**.",
                },
              ],
              cautious_foods: [
                {
                  name: "Dairy (milk, cheese)",
                  description:
                    "Since you have a milk or lactose allergy, avoiding dairy is essential to prevent allergic reactions.",
                },
                {
                  name: "Processed foods and refined sugars",
                  description:
                    "These foods can disrupt blood sugar balance and worsen hormonal imbalances.",
                },
              ],
            },
          },
        },
        {
          name: "Sleep Well",
          score: 5,
          score_rationale: [
            "Your Sleep Well score is a 5 because your **C1[inconsistent sleep]C1** can negatively impact your hormonal balance, particularly your cortisol levels.",
            "Adequate, quality sleep is essential for hormone regulation and overall well-being.",
          ],
          why_it_matters:
            "Sleep is your body's time to reset and recharge, including your hormonal system. Think of it as giving your body the downtime it needs to perform essential maintenance and repairs.",
          root_cause_correlation:
            "Improving your sleep quality can help regulate your **C1[high cortisol]C1** levels.  Consistent sleep patterns can also positively influence other hormones involved in your menstrual cycle and overall well-being.",
          science_based_explanation:
            "During sleep, your body regulates cortisol production.  Lack of sleep can disrupt this process, leading to elevated cortisol levels and associated symptoms like fatigue and difficulty concentrating.",
          additional_guidance: {
            description:
              "Prioritizing consistent sleep is crucial for hormonal balance. Here are some recommendations to improve your sleep quality:",
            structure: {
              recommended_recovery_tips: [
                {
                  name: "Establish a regular sleep schedule",
                  description:
                    "Go to bed and wake up around the same time each day, even on weekends, to regulate your body's natural sleep-wake cycle.",
                },
                {
                  name: "Create a relaxing bedtime routine",
                  description:
                    "Engage in calming activities before bed, such as taking a warm bath, reading, or listening to calming music.",
                },
                {
                  name: "Optimize your sleep environment",
                  description:
                    "Make sure your bedroom is dark, quiet, and cool to promote restful sleep.",
                },
              ],
              avoid_habits_rest_recover: [
                {
                  name: "Avoid caffeine and alcohol before bed",
                  description:
                    "These substances can interfere with sleep quality and make it harder to fall asleep and stay asleep.",
                },
                {
                  name: "Avoid screen time before bed",
                  description:
                    "The blue light emitted from electronic devices can suppress melatonin production, making it harder to fall asleep.",
                },
              ],
            },
          },
        },
        {
          name: "Move Well",
          score: 7,
          score_rationale: [
            "Your Move Well score is a 7 because while you exercise daily, your overall activity level is sedentary due to your desk job.",
            "Balancing regular exercise with increased daily movement is important for overall health and hormonal balance.",
          ],
          why_it_matters:
            "Regular movement helps improve circulation, reduce stress, and support healthy hormone levels. Think of it as keeping the pathways of your body clear and flowing smoothly.",
          root_cause_correlation:
            "Incorporating more movement into your daily routine can help lower your **C1[high cortisol]C1** levels and improve your mood and energy levels.  It can also support healthy digestion and reduce **C1[bloating]C1**.",
          science_based_explanation:
            "Exercise helps regulate hormones like cortisol and improves insulin sensitivity.  Movement also promotes gut motility, which can alleviate constipation.",
          additional_guidance: {
            description:
              "While daily exercise is great, incorporating more movement throughout your day is essential. Here are some recommendations:",
            structure: {
              recommended_workouts: [
                {
                  name: "Yoga or Pilates",
                  description:
                    "These practices can help reduce stress and improve flexibility and core strength.",
                },
                {
                  name: "Brisk walking or cycling",
                  description:
                    "These are great ways to increase your daily activity levels and improve cardiovascular health.",
                },
                {
                  name: "Strength training",
                  description:
                    "Building muscle mass can improve metabolism and support hormonal balance.",
                },
              ],
              avoid_habits_move: [
                {
                  name: "Prolonged sitting",
                  description:
                    "Take frequent breaks to stand up, stretch, and walk around to counteract the negative effects of prolonged sitting.",
                },
                {
                  name: "Overtraining",
                  description:
                    "Listen to your body and avoid pushing yourself too hard, as this can increase stress and negatively impact your hormones.",
                },
              ],
            },
          },
        },
        {
          name: "Recover Well",
          score: 6,
          score_rationale: [
            "Your Recover Well score is a 6 because you experience work and life stress, which can significantly impact your hormonal balance and overall well-being.",
            "Managing stress through relaxation techniques is crucial for hormonal harmony.",
          ],
          why_it_matters:
            "Recovery is not just about physical rest; it's about giving your mind and body the time and space to de-stress and rejuvenate. Think of it as allowing your system to reboot and refresh.",
          root_cause_correlation:
            "Implementing stress-reducing practices can help lower your **C1[high cortisol]C1** levels and improve your overall hormonal balance.  This can also positively impact your sleep quality and reduce symptoms like **C1[bloating]C1**.",
          science_based_explanation:
            "Chronic stress can lead to elevated cortisol levels, which can disrupt other hormonal processes.  Relaxation techniques help activate the parasympathetic nervous system, promoting a state of calm and reducing cortisol production.",
          additional_guidance: {
            description:
              "Managing stress is crucial for hormonal health. Here are some recommendations to incorporate into your routine:",
            structure: {
              recommended_recovery_tips: [
                {
                  name: "Deep breathing exercises",
                  description:
                    "Practice deep breathing techniques throughout the day to calm your nervous system and reduce stress.",
                },
                {
                  name: "Meditation or mindfulness",
                  description:
                    "Engage in regular meditation or mindfulness practices to cultivate a sense of calm and reduce stress.",
                },
                {
                  name: "Spending time in nature",
                  description:
                    "Connecting with nature has been shown to reduce stress and improve overall well-being.",
                },
              ],
              avoid_habits_rest_recover: [
                {
                  name: "Overworking",
                  description:
                    "Set boundaries and prioritize rest to avoid burnout and chronic stress.",
                },
                {
                  name: "Excessive screen time",
                  description:
                    "Limit your exposure to screens, especially before bed, to reduce mental stimulation and promote relaxation.",
                },
              ],
            },
          },
        },
      ],
    },
    supplements: {
      description:
        "Given your low **C2[estradiol]C2** (**C2[<5.0 pg/mL]C2**) and symptoms of **C1[bloating]C1**, **C1[cramps]C1**, and **C1[PMS]C1**, these supplements may be beneficial. Remember, supplements are not a replacement for a healthy lifestyle and should be discussed with your doctor.",
      structure: {
        recommendations: [
          {
            name: "Magnesium Glycinate",
            rationale:
              "Magnesium can help with **C1[PMS symptoms]C1** like **C1[cramps]C1** and **C1[mood swings]C1** by relaxing muscles and calming the nervous system.  It also supports healthy estrogen levels.",
            expected_outcomes:
              "Reduced **C1[cramps]C1**, improved mood, and better sleep.",
            dosage_and_timing: "200-400 mg daily, taken in the evening.",
            situational_cyclical_considerations:
              "Can be taken throughout your cycle, but may be particularly helpful during the second half of your cycle when **C1[PMS symptoms]C1** tend to be more prominent.",
          },
          {
            name: "Fiber Supplement (Psyllium Husk or Ground Flaxseed)",
            rationale:
              "Fiber helps your body eliminate excess estrogen, which can contribute to **C1[bloating]C1**. It also supports gut health, which plays a role in hormone balance.",
            expected_outcomes:
              "Reduced **C1[bloating]C1** and improved regularity.",
            dosage_and_timing:
              "Follow the instructions on the product label, starting with a low dose and gradually increasing as needed.",
            situational_cyclical_considerations: "Can be taken daily.",
          },
        ],
        conclusion:
          "These supplements may help support your hormonal health by addressing your low estradiol and associated symptoms.  Remember to discuss these with your doctor before starting any new supplement regimen, and continue prioritizing a healthy diet, regular exercise, and stress management techniques.",
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

    downloadBtn.textContent = "Generating PDF...";
    downloadBtn.disabled = true;

    try {
      // Create one single, tall canvas of the entire element.
      const sourceCanvas = await htmlToImage.toCanvas(element, {
        quality: 1,
        pixelRatio: 2, // Use a 2x pixel ratio for high-quality text.
        backgroundColor: "#ffffff",
      });

      const { jsPDF } = window.jspdf;

      const sourceCanvasWidth = sourceCanvas.width;
      const sourceCanvasHeight = sourceCanvas.height;

      // Conversion ratio from pixels (in the canvas) to points (in the PDF).
      // Standard screen DPI is 96, standard PDF DPI is 72. Ratio is 72/96 = 0.75.
      const px_to_pt_ratio = 0.75;
      const maxPageHeightInPt = 14400;

      // Convert the canvas width from pixels to points.
      const pdfWidthInPt = sourceCanvasWidth * px_to_pt_ratio;

      let y_pos_in_px = 0; // The current Y position on the source canvas in pixels.
      let isFirstPage = true;
      let pdf = null;

      // Loop while there is still content left on the source canvas to process.
      while (y_pos_in_px < sourceCanvasHeight) {
        // Calculate the height of the next slice in pixels.
        const sliceHeightInPx = Math.min(
          sourceCanvasHeight - y_pos_in_px,
          maxPageHeightInPt / px_to_pt_ratio
        );
        // Convert this slice's height to points.
        const sliceHeightInPt = sliceHeightInPx * px_to_pt_ratio;

        if (isFirstPage) {
          // If this is the first page, initialize the PDF document with the
          // exact dimensions of our first slice.
          pdf = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: [pdfWidthInPt, sliceHeightInPt],
          });
          isFirstPage = false;
        } else {
          // For all subsequent pages, add a new page with the new slice's dimensions.
          pdf.addPage([pdfWidthInPt, sliceHeightInPt]);
        }

        // Create a temporary canvas just for this slice.
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = sourceCanvasWidth;
        pageCanvas.height = sliceHeightInPx;
        const pageCtx = pageCanvas.getContext("2d");

        // Draw the slice from the main canvas onto our temporary page canvas.
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

        // Convert the temporary page canvas to a JPEG image.
        const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);

        // Add the image to the current page of the PDF. Since the page and the image
        // have the same dimensions, it will fit perfectly.
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthInPt, sliceHeightInPt);

        // Move our Y position down by the height of the slice we just processed.
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
                <h1>Suppliments</h1>
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
                         <h4>Cycle Impact</h4>
                         <p class="p-grey">${handleMarkup(bm.cycle_impact)}</p>
                         <h4 class="why-it-matters-h4">Why It Matters</h4>
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
