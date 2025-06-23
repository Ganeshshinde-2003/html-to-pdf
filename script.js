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

  // const defaultData = {
  //   lab_analysis: {
  //     overall_summary:
  //       "Based on your lab results and health assessment, there are a few key areas to focus on. Your **C1[low Estradiol]C1** and **C1[high SHBG]C1** could be contributing to some of the symptoms you're experiencing, such as **C1[cramps]C1** and **C1[bloating]C1**. Additionally, your **C2[elevated TSH]C2** and **C2[high Cortisol AM]C2** suggest that your thyroid and stress response may need some attention. It's important to address these imbalances to support your overall hormonal health and well-being. Making dietary adjustments, incorporating stress-reducing activities, and consulting with your healthcare provider can help you achieve hormonal harmony.",
  //     biomarkers_tested_count: 13,
  //     biomarker_categories_summary: {
  //       description_text:
  //         "Out of **C1[13]C1** tests, **C2[8]C2** are optimal, **C2[0]C2** need keeping in mind, and **C2[5]C2** need attention. This means that while some of your hormone levels are within the normal range, there are a few that could benefit from some support. Addressing the biomarkers that need attention can help improve your overall hormonal balance and alleviate some of the symptoms you're experiencing. It's important to work with your healthcare provider to develop a personalized plan that addresses your specific needs and goals. By focusing on these key areas, you can take proactive steps towards achieving optimal hormonal health.",
  //       optimal_count: 8,
  //       keep_in_mind_count: 0,
  //       attention_needed_count: 5,
  //     },
  //     detailed_biomarkers: [
  //       {
  //         name: "Cholesterol, Total",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "168 mg/dL",
  //         range: "100-199",
  //         cycle_impact:
  //           "Cholesterol is essential for hormone production, and its levels don't directly fluctuate with your menstrual cycle, but maintaining healthy levels supports overall hormonal balance.",
  //         why_it_matters:
  //           "Your cholesterol level is within the normal range, which is important for overall health and hormone production. Cholesterol is a building block for hormones like estrogen and progesterone, so maintaining healthy levels is crucial for hormonal balance. Think of cholesterol as the raw material your body uses to create these essential hormones. Keeping it in the optimal range ensures your body has what it needs to function properly.",
  //       },
  //       {
  //         name: "Triglycerides",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "59 mg/dL",
  //         range: "0-149",
  //         cycle_impact:
  //           "Triglycerides don't directly fluctuate with the menstrual cycle, but maintaining healthy levels supports overall metabolic health, which indirectly influences hormonal balance.",
  //         why_it_matters:
  //           "Your triglyceride level is within the normal range, which is a good indicator of your metabolic health. Triglycerides are a type of fat in your blood, and high levels can increase your risk of heart disease and other health problems. Keeping your triglycerides in the optimal range supports your overall well-being and helps your body function efficiently. Think of triglycerides as fuel for your body, but too much can clog the engine.",
  //       },
  //       {
  //         name: "HDL Cholesterol",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "75 mg/dL",
  //         range: ">39",
  //         cycle_impact:
  //           "HDL cholesterol doesn't directly fluctuate with the menstrual cycle, but maintaining healthy levels supports cardiovascular health, which is important for overall hormonal balance.",
  //         why_it_matters:
  //           'Your HDL cholesterol level is within the normal range, which is beneficial for your heart health. HDL cholesterol is often referred to as "good" cholesterol because it helps remove other forms of cholesterol from your bloodstream. Maintaining healthy HDL levels supports your cardiovascular system and helps protect against heart disease. Think of HDL as a street sweeper, clearing away excess cholesterol from your arteries.',
  //       },
  //       {
  //         name: "VLDL Cholesterol Cal",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "12 mg/dL",
  //         range: "5-40",
  //         cycle_impact:
  //           "VLDL cholesterol doesn't directly fluctuate with the menstrual cycle, but maintaining healthy levels supports overall metabolic health, which indirectly influences hormonal balance.",
  //         why_it_matters:
  //           "Your VLDL cholesterol level is within the normal range, which is a good indicator of your metabolic health. VLDL cholesterol carries triglycerides in your blood, and high levels can contribute to the buildup of plaque in your arteries. Keeping your VLDL levels in the optimal range supports your cardiovascular system and helps prevent heart disease. Think of VLDL as a delivery truck, carrying fats to your cells, but too many trucks can cause traffic jams.",
  //       },
  //       {
  //         name: "LDL Chol Calc (NIH)",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "81 mg/dL",
  //         range: "0-99",
  //         cycle_impact:
  //           "LDL cholesterol doesn't directly fluctuate with the menstrual cycle, but maintaining healthy levels supports cardiovascular health, which is important for overall hormonal balance.",
  //         why_it_matters:
  //           'Your LDL cholesterol level is within the normal range, which is important for your heart health. LDL cholesterol is sometimes referred to as "bad" cholesterol because it can contribute to the buildup of plaque in your arteries. Keeping your LDL levels in the optimal range supports your cardiovascular system and helps prevent heart disease. Think of LDL as a construction crew, building up plaque in your arteries if levels are too high.',
  //       },
  //       {
  //         name: "Hemoglobin A1c",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "5.5 %",
  //         range: "4.8-5.6",
  //         cycle_impact:
  //           "Hemoglobin A1c provides an average of your blood sugar levels over the past 2-3 months and is not directly impacted by your menstrual cycle.",
  //         why_it_matters:
  //           "Your Hemoglobin A1c level is within the normal range, indicating good blood sugar control. This is important for overall health and can help prevent the development of diabetes. Think of Hemoglobin A1c as a report card for your blood sugar levels, showing how well you've been managing them over time. Keeping it in the optimal range supports your energy levels and reduces your risk of chronic diseases.",
  //       },
  //       {
  //         name: "T4,Free(Direct)",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "1.11 ng/dL",
  //         range: "0.82-1.77",
  //         cycle_impact:
  //           "Thyroid hormones like T4 are essential for regulating metabolism and energy levels, and while they don't directly fluctuate with the menstrual cycle, they can influence its regularity and symptoms.",
  //         why_it_matters:
  //           "Your free T4 level is within the normal range, which is a good indicator of your thyroid function. T4 is a thyroid hormone that helps regulate your metabolism, energy levels, and overall growth and development. Keeping your T4 levels in the optimal range supports your energy levels and helps your body function efficiently. Think of T4 as the gas pedal for your metabolism, controlling how quickly your body burns fuel.",
  //       },
  //       {
  //         name: "Prolactin",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "23.8 ng/mL",
  //         range: "4.8-33.4",
  //         cycle_impact:
  //           "Prolactin levels can fluctuate during the menstrual cycle, particularly during ovulation and the luteal phase, and can influence breast tenderness and mood changes.",
  //         why_it_matters:
  //           "Your prolactin level is within the normal range, which is important for reproductive health and breast milk production. Prolactin is a hormone that stimulates milk production after childbirth and also plays a role in regulating the menstrual cycle. Keeping your prolactin levels in the optimal range supports your reproductive health and overall well-being. Think of prolactin as the milk-making hormone, ensuring you can nourish a baby if needed.",
  //       },
  //       {
  //         name: "Testosterone, Total, LC/MS",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "22 ng/dL",
  //         range: "10 - 55",
  //         cycle_impact:
  //           "Testosterone levels can fluctuate slightly during the menstrual cycle, with a small peak around ovulation, and can influence libido and energy levels.",
  //         why_it_matters:
  //           "Your testosterone level is within the normal range for premenopausal women, which is important for maintaining muscle mass, bone density, and libido. Testosterone is often thought of as a male hormone, but it also plays a crucial role in women's health. Keeping your testosterone levels in the optimal range supports your energy levels, mood, and overall well-being. Think of testosterone as the strength hormone, helping you stay strong and energetic.",
  //       },
  //       {
  //         name: "Reverse T3, Serum",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "11.4 ng/dL",
  //         range: "9.2 - 24.1",
  //         cycle_impact:
  //           "Reverse T3 doesn't directly fluctuate with the menstrual cycle, but it can be affected by stress and inflammation, which can indirectly influence hormonal balance.",
  //         why_it_matters:
  //           "Your reverse T3 level is within the normal range, which is a good indicator of your thyroid hormone conversion. Reverse T3 is a hormone that can block the effects of T3, the active form of thyroid hormone. Keeping your reverse T3 levels in the optimal range supports your thyroid function and helps your body use thyroid hormone efficiently. Think of reverse T3 as a brake on your thyroid, slowing down its activity if levels are too high.",
  //       },
  //       {
  //         name: "Triiodothyronine (T3), Free",
  //         status: "optimal",
  //         status_label: "Good (Green)",
  //         result: "2.7 pg/mL",
  //         range: "2.0-4.4",
  //         cycle_impact:
  //           "Thyroid hormones like T3 are essential for regulating metabolism and energy levels, and while they don't directly fluctuate with the menstrual cycle, they can influence its regularity and symptoms.",
  //         why_it_matters:
  //           "Your free T3 level is within the normal range, which is a good indicator of your thyroid function. T3 is the active form of thyroid hormone that helps regulate your metabolism, energy levels, and overall growth and development. Keeping your T3 levels in the optimal range supports your energy levels and helps your body function efficiently. Think of T3 as the key that unlocks your cells' energy potential.",
  //       },
  //       {
  //         name: "TSH",
  //         status: "attention_needed",
  //         status_label: "Needs Attention (Red)",
  //         result: "4.310 uIU/mL",
  //         range: "0.450-4.500",
  //         cycle_impact:
  //           "TSH levels don't directly fluctuate with the menstrual cycle, but thyroid function is crucial for hormonal balance and can influence cycle regularity and symptoms.",
  //         why_it_matters:
  //           "Your TSH level is slightly elevated, which could indicate that your thyroid is working harder to produce thyroid hormones. TSH, or thyroid-stimulating hormone, is produced by the pituitary gland and tells the thyroid gland to release T4 and T3. An elevated TSH level may suggest that your thyroid is underactive, which can lead to symptoms like **C1[fatigue]C1**, **C1[constipation]C1**, and **C1[bloating]C1**. Think of TSH as the messenger that tells your thyroid how much hormone to make.",
  //       },
  //       {
  //         name: "Estradiol",
  //         status: "attention_needed",
  //         status_label: "Needs Attention (Red)",
  //         result: "<5.0 pg/mL",
  //         range:
  //           "Adult Female Range: Follicular phase 12.5 - 166.0, Ovulation phase 85.8 - 498.0, Luteal phase 43.8 - 211.0, Postmenopausal <6.0 - 54.7, Pregnancy 1st trimester 215.0 - >4300.0",
  //         cycle_impact:
  //           "Estradiol levels fluctuate significantly during the menstrual cycle, influencing the development of the uterine lining, cervical mucus, and various symptoms like mood changes and breast tenderness.",
  //         why_it_matters:
  //           "Your estradiol level is low, which could indicate that your ovaries are not producing enough estrogen. Estradiol is a form of estrogen that plays a crucial role in regulating the menstrual cycle, bone health, and mood. Low estradiol levels can lead to symptoms like **C1[irregular periods]C1**, **C1[vaginal dryness]C1**, and **C1[mood swings]C1**. Think of estradiol as the conductor of your menstrual cycle, orchestrating the events that lead to ovulation and menstruation.",
  //       },
  //       {
  //         name: "Progesterone",
  //         status: "attention_needed",
  //         status_label: "Needs Attention (Red)",
  //         result: "0.2 ng/mL",
  //         range:
  //           "Follicular phase 0.1 - 0.9, Luteal phase 1.8 - 23.9, Ovulation phase 0.1 - 12.0, Pregnant First trimester 11.0 - 44.3, Second trimester 25.4 - 83.3, Third trimester 58.7 - 214.0, Postmenopausal 0.0 - 0.1",
  //         cycle_impact:
  //           "Progesterone levels rise after ovulation during the luteal phase, preparing the uterine lining for implantation and influencing symptoms like breast tenderness and mood changes.",
  //         why_it_matters:
  //           "Your progesterone level is low, which could indicate that you are not ovulating regularly or that your luteal phase is too short. Progesterone is a hormone that helps prepare the uterine lining for implantation of a fertilized egg and also plays a role in regulating the menstrual cycle. Low progesterone levels can lead to symptoms like **C1[irregular periods]C1**, **C1[difficulty conceiving]C1**, and **C1[increased PMS symptoms]C1**. Think of progesterone as the gardener that prepares the soil for planting, ensuring the uterine lining is ready for a fertilized egg.",
  //       },
  //       {
  //         name: "Estrogens, Total",
  //         status: "attention_needed",
  //         status_label: "Needs Attention (Red)",
  //         result: "85 pg/mL",
  //         range:
  //           "Prepubertal < 40, Female Cycle: 1-10 Days 16 - 328, 11-20 Days 34 - 501, 21-30 Days 48 - 350, Post-Menopausal 40 - 244",
  //         cycle_impact:
  //           "Total estrogen levels fluctuate throughout the menstrual cycle, influencing the development of the uterine lining, cervical mucus, and various symptoms like mood changes and breast tenderness.",
  //         why_it_matters:
  //           "Your total estrogen level is low, which could indicate that your ovaries are not producing enough estrogen. Estrogens play a crucial role in regulating the menstrual cycle, bone health, and mood. Low estrogen levels can lead to symptoms like **C1[irregular periods]C1**, **C1[vaginal dryness]C1**, and **C1[mood swings]C1**. Think of estrogens as the conductor of your menstrual cycle, orchestrating the events that lead to ovulation and menstruation.",
  //       },
  //       {
  //         name: "Sex Horm Binding Glob, Serum",
  //         status: "attention_needed",
  //         status_label: "Needs Attention (Red)",
  //         result: "130.0 High",
  //         range: "24.6-122.0",
  //         cycle_impact:
  //           "SHBG levels can be influenced by hormonal fluctuations during the menstrual cycle, and they can affect the availability of hormones like testosterone and estrogen.",
  //         why_it_matters:
  //           "Your SHBG level is high, which means that more of your sex hormones, like testosterone and estrogen, are bound and unavailable for your body to use. SHBG, or sex hormone-binding globulin, is a protein that binds to sex hormones in the blood. High SHBG levels can lead to symptoms like **C1[low libido]C1**, **C1[fatigue]C1**, and **C1[irregular periods]C1**. Think of SHBG as a taxi that carries sex hormones around, but if there are too many taxis, fewer hormones are available for your body to use.",
  //       },
  //       {
  //         name: "Cortisol - AM",
  //         status: "attention_needed",
  //         status_label: "Needs Attention (Red)",
  //         result: "20.3 High",
  //         range: "6.2-19.4",
  //         cycle_impact:
  //           "Cortisol levels can fluctuate during the menstrual cycle, particularly in response to stress, and can influence mood, energy levels, and sleep patterns.",
  //         why_it_matters:
  //           "Your morning cortisol level is elevated, which could indicate that you are experiencing chronic stress. Cortisol is a hormone that helps your body respond to stress, but chronically elevated levels can lead to symptoms like **C1[anxiety]C1**, **C1[insomnia]C1**, and **C1[weight gain]C1**. Think of cortisol as the alarm system in your body, alerting you to danger, but if the alarm is constantly going off, it can wear you down.",
  //       },
  //     ],
  //     crucial_biomarkers_to_measure: [
  //       {
  //         name: "DHEA, Serum",
  //         importance:
  //           "Test **C2[DHEA, Serum]C2** to check stress levels because of **C1[work and life stress]C1**.",
  //       },
  //     ],
  //     health_recommendation_summary: [
  //       "Retest **C2[DHEA, Serum]C2** to understand **C1[stress]C1**.",
  //       "Consider lifestyle changes to reduce **C1[stress]C1** and support **C2[healthy cortisol levels]C2**.",
  //     ],
  //   },
  //   four_pillars: {
  //     introduction:
  //       "Based on your health assessment and lab results, let's take a look at how you're doing in four key areas: eating, sleeping, moving, and recovering. Your **C1[low estradiol]C1** and **C1[high cortisol]C1** suggest that you may benefit from making some adjustments to your lifestyle to support your hormonal health. By focusing on these four pillars, you can take proactive steps towards achieving optimal well-being.",
  //     pillars: [
  //       {
  //         name: "Eat Well",
  //         score: 4,
  //         score_rationale: [
  //           "Eat Well got 4 because **C1[inconsistent eating habits]C1** means missing energy.",
  //           "Eating regularly helps your body stay strong.",
  //         ],
  //         why_it_matters:
  //           "Good food helps balance **C2[hormones]C2** for **C1[bloating]C1**, like fueling a car.",
  //         personalized_recommendations: [
  //           "Eat **C1[fiber-rich vegetables]C1** for **C1[constipation]C1**.",
  //           "Incorporate phytoestrogen-rich foods like flaxseeds and soy to support **C2[low estrogen levels]C2**.",
  //         ],
  //         root_cause_correlation:
  //           "Fiber helps **C1[constipation]C1** caused by **C2[low estrogen]C2**.",
  //         science_based_explanation:
  //           "Fiber clears **C2[extra hormones]C2** to ease **C1[mood swings]C1**, like cleaning out clutter.",
  //         additional_guidance: {
  //           description:
  //             "Since you mentioned inconsistent eating habits, here are some general tips to help you eat well and support your hormonal health.",
  //           structure: {
  //             recommended_foods: [
  //               {
  //                 name: "Leafy Greens",
  //                 description:
  //                   "Rich in vitamins and minerals that support overall health.",
  //               },
  //               {
  //                 name: "Chia Seeds",
  //                 description:
  //                   "High in fiber, which helps with digestion and hormone balance.",
  //               },
  //             ],
  //             cautious_foods: [
  //               {
  //                 name: "Processed Foods",
  //                 description:
  //                   "Low in nutrients and can disrupt hormone balance.",
  //               },
  //               {
  //                 name: "Sugary Drinks",
  //                 description:
  //                   "Can lead to blood sugar imbalances and hormone fluctuations.",
  //               },
  //             ],
  //             recommended_workouts: [
  //               {
  //                 name: "Yoga",
  //                 description: "Reduces stress and improves flexibility.",
  //               },
  //               {
  //                 name: "Walking",
  //                 description: "Gentle exercise that boosts energy levels.",
  //               },
  //             ],
  //             avoid_habits_move: [
  //               {
  //                 name: "Sitting for Long Periods",
  //                 description: "Can lead to stiffness and reduced circulation.",
  //               },
  //               {
  //                 name: "Skipping Meals",
  //                 description:
  //                   "Disrupts blood sugar levels and hormone balance.",
  //               },
  //             ],
  //             recommended_recovery_tips: [
  //               {
  //                 name: "Mindfulness Meditation",
  //                 description: "Reduces stress and promotes relaxation.",
  //               },
  //               {
  //                 name: "Deep Breathing Exercises",
  //                 description:
  //                   "Calms the nervous system and lowers cortisol levels.",
  //               },
  //             ],
  //             avoid_habits_rest_recover: [
  //               {
  //                 name: "Screen Time Before Bed",
  //                 description:
  //                   "Disrupts sleep patterns and hormone production.",
  //               },
  //               {
  //                 name: "Caffeine Late in the Day",
  //                 description: "Can interfere with sleep and increase anxiety.",
  //               },
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         name: "Sleep Well",
  //         score: 5,
  //         score_rationale: [
  //           "Sleep Well got 5 because **C1[inconsistent sleep]C1** means less rest.",
  //           "Regular sleep helps your body recharge.",
  //         ],
  //         why_it_matters:
  //           "Good sleep helps balance **C2[cortisol]C2** for **C1[stress]C1**, like a phone charging overnight.",
  //         personalized_recommendations: [
  //           "Aim for **C2[7-9 hours]C2** of sleep to balance **C2[cortisol levels]C2**.",
  //           "Establish a consistent sleep schedule to regulate your body's natural sleep-wake cycle.",
  //         ],
  //         root_cause_correlation:
  //           "Consistent sleep helps lower **C2[high cortisol]C2**, which can cause **C1[bloating]C1**.",
  //         science_based_explanation:
  //           "Sleep regulates **C2[hormones]C2** to ease **C1[mood swings]C1**, like resetting a computer.",
  //         additional_guidance: {
  //           description:
  //             "Since you mentioned inconsistent sleep, here are some general tips to help you sleep well and support your hormonal health.",
  //           structure: {
  //             recommended_foods: [
  //               {
  //                 name: "Chamomile Tea",
  //                 description: "Promotes relaxation and sleep.",
  //               },
  //               {
  //                 name: "Almonds",
  //                 description: "Contain magnesium, which helps with sleep.",
  //               },
  //             ],
  //             cautious_foods: [
  //               {
  //                 name: "Caffeine",
  //                 description: "Can interfere with sleep.",
  //               },
  //               { name: "Alcohol", description: "Disrupts sleep patterns." },
  //             ],
  //             recommended_workouts: [
  //               {
  //                 name: "Yoga",
  //                 description: "Reduces stress and promotes relaxation.",
  //               },
  //               {
  //                 name: "Walking",
  //                 description: "Gentle exercise that boosts energy levels.",
  //               },
  //             ],
  //             avoid_habits_move: [
  //               {
  //                 name: "Exercising Too Close to Bedtime",
  //                 description: "Can interfere with sleep.",
  //               },
  //               {
  //                 name: "Sitting for Long Periods",
  //                 description: "Can lead to stiffness and reduced circulation.",
  //               },
  //             ],
  //             recommended_recovery_tips: [
  //               {
  //                 name: "Warm Bath",
  //                 description: "Relaxes muscles and promotes sleep.",
  //               },
  //               {
  //                 name: "Reading",
  //                 description: "Calms the mind and prepares for sleep.",
  //               },
  //             ],
  //             avoid_habits_rest_recover: [
  //               {
  //                 name: "Screen Time Before Bed",
  //                 description:
  //                   "Disrupts sleep patterns and hormone production.",
  //               },
  //               {
  //                 name: "Caffeine Late in the Day",
  //                 description: "Can interfere with sleep and increase anxiety.",
  //               },
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         name: "Move Well",
  //         score: 6,
  //         score_rationale: [
  //           "Move Well got 6 because **C1[sedentary job]C1** means less movement.",
  //           "Daily exercise helps your body stay active.",
  //         ],
  //         why_it_matters:
  //           "Good movement helps balance **C2[hormones]C2** for **C1[energy]C1**, like oiling a machine.",
  //         personalized_recommendations: [
  //           "Incorporate daily movement like walking or stretching to combat the effects of a **C1[sedentary job]C1**.",
  //           "Engage in regular exercise to support **C2[hormone balance]C2** and reduce **C1[stress]C1**.",
  //         ],
  //         root_cause_correlation:
  //           "Daily movement helps lower **C2[high cortisol]C2**, which can cause **C1[bloating]C1**.",
  //         science_based_explanation:
  //           "Exercise regulates **C2[hormones]C2** to ease **C1[mood swings]C1**, like tuning an engine.",
  //         additional_guidance: {
  //           description:
  //             "Since you mentioned a sedentary job, here are some general tips to help you move well and support your hormonal health.",
  //           structure: {
  //             recommended_foods: [
  //               {
  //                 name: "Fruits",
  //                 description: "Provide energy and essential nutrients.",
  //               },
  //               {
  //                 name: "Vegetables",
  //                 description:
  //                   "Rich in vitamins and minerals that support overall health.",
  //               },
  //             ],
  //             cautious_foods: [
  //               {
  //                 name: "Processed Foods",
  //                 description:
  //                   "Low in nutrients and can disrupt hormone balance.",
  //               },
  //               {
  //                 name: "Sugary Drinks",
  //                 description:
  //                   "Can lead to blood sugar imbalances and hormone fluctuations.",
  //               },
  //             ],
  //             recommended_workouts: [
  //               {
  //                 name: "Walking",
  //                 description: "Gentle exercise that boosts energy levels.",
  //               },
  //               {
  //                 name: "Stretching",
  //                 description: "Improves flexibility and reduces stiffness.",
  //               },
  //             ],
  //             avoid_habits_move: [
  //               {
  //                 name: "Sitting for Long Periods",
  //                 description: "Can lead to stiffness and reduced circulation.",
  //               },
  //               {
  //                 name: "Skipping Meals",
  //                 description:
  //                   "Disrupts blood sugar levels and hormone balance.",
  //               },
  //             ],
  //             recommended_recovery_tips: [
  //               {
  //                 name: "Foam Rolling",
  //                 description:
  //                   "Releases muscle tension and improves circulation.",
  //               },
  //               {
  //                 name: "Epsom Salt Bath",
  //                 description: "Relaxes muscles and reduces inflammation.",
  //               },
  //             ],
  //             avoid_habits_rest_recover: [
  //               {
  //                 name: "Overtraining",
  //                 description: "Can lead to fatigue and hormone imbalances.",
  //               },
  //               {
  //                 name: "Ignoring Pain",
  //                 description: "Can lead to injuries and prolonged recovery.",
  //               },
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         name: "Recover Well",
  //         score: 5,
  //         score_rationale: [
  //           "Recover Well got 5 because **C1[work and life stress]C1** means less relaxation.",
  //           "Relaxation helps your body recharge.",
  //         ],
  //         why_it_matters:
  //           "Good recovery helps balance **C2[cortisol]C2** for **C1[stress]C1**, like a vacation for your mind.",
  //         personalized_recommendations: [
  //           "Incorporate calming activities like mindfulness or meditation to lower **C2[cortisol levels]C2**.",
  //           "Prioritize stress management techniques to support **C2[hormone balance]C2** and reduce **C1[anxiety]C1**.",
  //         ],
  //         root_cause_correlation:
  //           "Calming activities help lower **C2[high cortisol]C2**, which can cause **C1[bloating]C1**.",
  //         science_based_explanation:
  //           "Relaxation regulates **C2[hormones]C2** to ease **C1[mood swings]C1**, like defusing a bomb.",
  //         additional_guidance: {
  //           description:
  //             "Since you mentioned work and life stress, here are some general tips to help you recover well and support your hormonal health.",
  //           structure: {
  //             recommended_foods: [
  //               {
  //                 name: "Omega-3 Fatty Acids",
  //                 description: "Reduce inflammation and support brain health.",
  //               },
  //               {
  //                 name: "Magnesium-Rich Foods",
  //                 description: "Promote relaxation and sleep.",
  //               },
  //             ],
  //             cautious_foods: [
  //               {
  //                 name: "Processed Foods",
  //                 description:
  //                   "Low in nutrients and can disrupt hormone balance.",
  //               },
  //               {
  //                 name: "Sugary Drinks",
  //                 description:
  //                   "Can lead to blood sugar imbalances and hormone fluctuations.",
  //               },
  //             ],
  //             recommended_workouts: [
  //               {
  //                 name: "Yoga",
  //                 description: "Reduces stress and improves flexibility.",
  //               },
  //               {
  //                 name: "Walking",
  //                 description: "Gentle exercise that boosts energy levels.",
  //               },
  //             ],
  //             avoid_habits_move: [
  //               {
  //                 name: "Overtraining",
  //                 description: "Can lead to fatigue and hormone imbalances.",
  //               },
  //               {
  //                 name: "Ignoring Pain",
  //                 description: "Can lead to injuries and prolonged recovery.",
  //               },
  //             ],
  //             recommended_recovery_tips: [
  //               {
  //                 name: "Mindfulness Meditation",
  //                 description: "Reduces stress and promotes relaxation.",
  //               },
  //               {
  //                 name: "Deep Breathing Exercises",
  //                 description:
  //                   "Calms the nervous system and lowers cortisol levels.",
  //               },
  //             ],
  //             avoid_habits_rest_recover: [
  //               {
  //                 name: "Screen Time Before Bed",
  //                 description:
  //                   "Disrupts sleep patterns and hormone production.",
  //               },
  //               {
  //                 name: "Caffeine Late in the Day",
  //                 description: "Can interfere with sleep and increase anxiety.",
  //               },
  //             ],
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   supplements: {
  //     description:
  //       "Based on your lab results and health assessment, these supplements may help with **C1[low estradiol]C1**, **C1[high cortisol]C1**, and **C1[stress]C1**.",
  //     structure: {
  //       recommendations: [
  //         {
  //           name: "Magnesium",
  //           rationale:
  //             "For **C2[low Estradiol]C2** and **C1[mood swings]C1**, helps calm your body.",
  //           expected_outcomes: "Better **C1[sleep]C1**, like a restful night.",
  //           dosage_and_timing: "**C2[200 mg daily, evening]C2**.",
  //           situational_cyclical_considerations:
  //             "Use in **C1[second half of cycle]C1** for **C1[cramps]C1**.",
  //         },
  //         {
  //           name: "Vitamin D",
  //           rationale:
  //             "For **C2[low Estradiol]C2** and **C1[mood swings]C1**, helps support bone health and mood.",
  //           expected_outcomes: "Improved **C1[mood]C1**, like a sunny day.",
  //           dosage_and_timing: "**C2[2000 IU daily, morning]C2**.",
  //           situational_cyclical_considerations:
  //             "Use throughout the cycle for consistent support.",
  //         },
  //       ],
  //       conclusion: "Stick to advice and check with a doctor.",
  //     },
  //   },
  //   action_plan: {
  //     description:
  //       "Here’s how to improve **C1[energy]C1** and reduce **C1[stress]C1**.",
  //     structure: {
  //       foods_to_enjoy: [
  //         "Eat **C1[vegetables]C1** for **C1[constipation]C1**.",
  //         "Include phytoestrogen-rich foods like flaxseeds and soy to support **C2[low estrogen levels]C2**.",
  //       ],
  //       foods_to_limit: [
  //         "Limit **C2[milk]C2** for **C1[lactose issues]C1**.",
  //         "Reduce processed foods and sugary drinks to support hormone balance.",
  //       ],
  //       daily_habits: [
  //         "Sleep **C2[7-9 hours]C2** to balance **C1[stress]C1**.",
  //         "Establish a consistent sleep schedule to regulate your body's natural sleep-wake cycle.",
  //       ],
  //       rest_and_recovery: [
  //         "Try **C1[meditation]C1** for **C1[stress]C1**.",
  //         "Incorporate calming activities like mindfulness or deep breathing exercises to lower **C2[cortisol levels]C2**.",
  //       ],
  //       movement: [
  //         "**C1[Yoga]C1** for **C1[stress]C1**.",
  //         "Engage in regular exercise to support **C2[hormone balance]C2** and reduce **C1[anxiety]C1**.",
  //       ],
  //     },
  //   },
  // };

  // jsonInput.value = JSON.stringify(defaultData, null, 2);
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
          <h1>Holistic Health</h1>
          <p class="last-update">Last update: <span>${new Date().toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric", year: "numeric" }
          )}</span></p>
      </div>
      <div class="report-section">
          <div class="biomarker-warraper pillers-wrapper">
              <div class="meta-info pillar-meta-info">
              <span><strong>Designed By:</strong> Researchers,
Holistic <br/>Coaches, Clinicians</span>
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
            size: 50, // A smaller size might be better here
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
                        `<div class="scroe-points"><span>•</span><p> ${handleMarkup(
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
              borderWidth:3,
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
            <div><span class="recommendation-name">Rationale:</span><p> ${handleMarkup(
              rec.rationale
            )}</p></div>
            <div><span class="recommendation-name">Expected Outcomes:</span><p> ${handleMarkup(
              rec.expected_outcomes
            )}</p></div>
            <div><span class="recommendation-name">Dosage & Timing:</span><p> ${handleMarkup(
              rec.dosage_and_timing
            )}</p></div>
            <div><span class="recommendation-name">Situational/Cyclical Considerations:</span><p> ${handleMarkup(
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
                <div class="meta-info suppliment-meta-info">
                  <span><strong>Designed By:</strong> Researchers,
Holistic <br />Coaches, Clinicians</span>
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
                                    <p>${bm.status_label.replace(/\s*\(.*?\)\s*/g, '').trim()}</p>
                                    <p class="last-update">${new Date().toLocaleDateString(
                         "en-US",
                         { month: "long", day: "numeric", year: "numeric" }
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
                   <div class="categories-wrapper health-recommendation ${
                     lab.crucial_biomarkers_to_measure.length > 5
                       ? "page-break-before"
                       : ""
                   }">
                         <h4>Health Recommendation Summary</h4>
                         <div class="biomarkers-container">
                               ${lab.health_recommendation_summary
                                 .map((bm) => `<div class="health-recommendation-item">
                                  <p>•</p>
                                  <p>${handleMarkup(bm)}</p>
                                 </div>`)
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
