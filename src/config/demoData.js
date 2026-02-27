export const demoData = {
  recentPolicies: [
    {
      id: 'policy-001',
      title: 'Maharashtra Agriculture Subsidy Scheme 2024',
      state: 'Maharashtra',
      category: 'Agriculture',
      date: '2024-02-15',
      brief: 'Income limit increased to Rs. 2 lakhs, subsidy increased to Rs. 20,000 for marginal farmers.',
      impact: 'high'
    },
    {
      id: 'policy-002',
      title: 'Karnataka MSME Incentive Scheme 2024',
      state: 'Karnataka',
      category: 'Business',
      date: '2024-02-20',
      brief: 'Investment limit raised to Rs. 50 crore with 50% electricity subsidy for 3 years.',
      impact: 'high'
    },
    {
      id: 'policy-003',
      title: 'Tamil Nadu Education Fee Waiver 2024',
      state: 'Tamil Nadu',
      category: 'Education',
      date: '2024-02-10',
      brief: 'Complete fee waiver for students from families earning below Rs. 2.5 lakhs annually.',
      impact: 'medium'
    },
    {
      id: 'policy-004',
      title: 'Gujarat Solar Subsidy Policy 2024',
      state: 'Gujarat',
      category: 'Energy',
      date: '2024-02-18',
      brief: '40% subsidy on rooftop solar installations up to 10 kW capacity.',
      impact: 'medium'
    },
    {
      id: 'policy-005',
      title: 'Kerala Health Insurance Scheme 2024',
      state: 'Kerala',
      category: 'Healthcare',
      date: '2024-02-12',
      brief: 'Free health insurance coverage up to Rs. 5 lakhs for all BPL families.',
      impact: 'high'
    },
    {
      id: 'policy-006',
      title: 'Rajasthan Women Entrepreneur Fund 2024',
      state: 'Rajasthan',
      category: 'Business',
      date: '2024-02-08',
      brief: 'Interest-free loans up to Rs. 10 lakhs for women starting new businesses.',
      impact: 'medium'
    },
    {
      id: 'policy-007',
      title: 'West Bengal Housing Scheme 2024',
      state: 'West Bengal',
      category: 'Housing',
      date: '2024-02-14',
      brief: 'Rs. 2.5 lakh subsidy for first-time home buyers in rural areas.',
      impact: 'high'
    },
    {
      id: 'policy-008',
      title: 'Telangana IT Startup Policy 2024',
      state: 'Telangana',
      category: 'Technology',
      date: '2024-02-16',
      brief: 'Tax exemption for 5 years and free office space for registered IT startups.',
      impact: 'medium'
    },
    {
      id: 'policy-009',
      title: 'Punjab Farm Equipment Subsidy 2024',
      state: 'Punjab',
      category: 'Agriculture',
      date: '2024-02-11',
      brief: '50% subsidy on purchase of modern farm equipment for small farmers.',
      impact: 'high'
    },
    {
      id: 'policy-010',
      title: 'Uttar Pradesh Skill Development 2024',
      state: 'Uttar Pradesh',
      category: 'Employment',
      date: '2024-02-09',
      brief: 'Free vocational training with Rs. 5000 monthly stipend for unemployed youth.',
      impact: 'medium'
    }
  ],

  sampleDocument: {
    extractedText: `GOVERNMENT OF MAHARASHTRA
Department of Agriculture
Circular No. AG/2024/142

Subject: Revised Subsidy Scheme for Marginal Farmers - 2024

Date: 15th February 2024

This circular supersedes Circular No. AG/2023/089 dated 10th March 2023.

ELIGIBILITY CRITERIA:
All marginal farmers owning less than 2 hectares of agricultural land and having annual household income below Rs. 2,00,000 are eligible for subsidy under the Agricultural Development Scheme 2024.

KEY CHANGES:
1. Income limit increased from Rs. 1,50,000 to Rs. 2,00,000
2. Land holding limit remains at 2 hectares
3. Application deadline extended to 31st March 2024
4. Subsidy amount increased from Rs. 15,000 to Rs. 20,000 per beneficiary

REQUIRED DOCUMENTS:
- Land ownership records (7/12 extract)
- Income certificate from Tehsildar
- Aadhaar card
- Bank account details

APPLICATION PROCESS:
Applications must be submitted to the concerned Taluka Agricultural Officer before 31st March 2024. Late applications will not be entertained.

DISBURSEMENT:
Approved subsidies will be directly transferred to beneficiary bank accounts within 60 days of approval.

This order is effective immediately.

Sd/-
Commissioner, Agriculture Department
Government of Maharashtra`,
    
    analysis: {
      entities: {
        dates: [
          { text: '15th February 2024', score: 0.99 },
          { text: '31st March 2024', score: 0.99 },
          { text: '10th March 2023', score: 0.98 }
        ],
        organizations: [
          { text: 'Government of Maharashtra', score: 0.99 },
          { text: 'Department of Agriculture', score: 0.98 }
        ],
        locations: [
          { text: 'Maharashtra', score: 0.99 }
        ],
        quantities: [
          { text: '2 hectares', score: 0.98 },
          { text: 'Rs. 2,00,000', score: 0.99 },
          { text: 'Rs. 20,000', score: 0.99 }
        ]
      },
      keyPhrases: [
        { text: 'marginal farmers', score: 0.98 },
        { text: 'subsidy scheme', score: 0.97 },
        { text: 'agricultural land', score: 0.96 },
        { text: 'income certificate', score: 0.95 },
        { text: 'application deadline', score: 0.94 }
      ]
    },
    
    summary: {
      brief: 'New subsidy scheme for small farmers in Maharashtra increases income limit to Rs. 2 lakhs and subsidy amount to Rs. 20,000. Apply before March 31, 2024.',
      detailed: 'The Government of Maharashtra has revised its Agricultural Development Scheme for marginal farmers. If you own less than 2 hectares of land and your annual household income is below Rs. 2,00,000, you can now receive a subsidy of Rs. 20,000. This is an increase from the previous limit of Rs. 1,50,000 income and Rs. 15,000 subsidy. You need to submit your application with land records, income certificate, Aadhaar, and bank details to your local Taluka Agricultural Officer before March 31, 2024.',
      actions: [
        'Check if you own less than 2 hectares of agricultural land',
        'Verify your annual household income is below Rs. 2,00,000',
        'Collect required documents: 7/12 extract, income certificate, Aadhaar, bank details',
        'Submit application to Taluka Agricultural Officer before March 31, 2024'
      ],
      comprehensive: 'This government circular announces important changes to the subsidy scheme for marginal farmers in Maharashtra. The key improvements include raising the income eligibility limit from Rs. 1.5 lakhs to Rs. 2 lakhs annually, and increasing the subsidy amount from Rs. 15,000 to Rs. 20,000 per beneficiary. Farmers who own less than 2 hectares of land and meet the income criteria can apply by submitting necessary documents to their Taluka Agricultural Officer. The deadline for applications is March 31, 2024, and approved subsidies will be transferred directly to bank accounts within 60 days.'
    },
    
    comparison: {
      hasChanges: true,
      changes: [
        'Income eligibility limit increased from Rs. 1,50,000 to Rs. 2,00,000',
        'Subsidy amount increased from Rs. 15,000 to Rs. 20,000',
        'Application deadline extended to 31st March 2024',
        'Direct bank transfer process introduced for faster disbursement'
      ],
      affected: [
        'Marginal farmers with income between Rs. 1.5-2 lakhs (newly eligible)',
        'Existing beneficiaries (will receive higher subsidy)',
        'Farmers in Maharashtra owning less than 2 hectares'
      ],
      summary: 'This revision makes the scheme more inclusive by allowing farmers with slightly higher incomes to qualify, and provides better financial support through increased subsidy amounts.',
      severity: 'medium'
    },
    
    translations: {
      hindi: 'महाराष्ट्र में छोटे किसानों के लिए नई सब्सिडी योजना आय सीमा को 2 लाख रुपये और सब्सिडी राशि को 20,000 रुपये तक बढ़ाती है। 31 मार्च 2024 से पहले आवेदन करें।',
      marathi: 'महाराष्ट्रातील लहान शेतकऱ्यांसाठी नवीन अनुदान योजना उत्पन्न मर्यादा 2 लाख रुपये आणि अनुदान रक्कम 20,000 रुपये पर्यंत वाढवते. 31 मार्च 2024 पूर्वी अर्ज करा.',
      tamil: 'மகாராஷ்டிராவில் சிறு விவசாயிகளுக்கான புதிய மானிய திட்டம் வருமான வரம்பை ரூ. 2 லட்சமாகவும், மானிய தொகையை ரூ. 20,000 ஆகவும் உயர்த்துகிறது. மார்ச் 31, 2024 க்கு முன் விண்ணப்பிக்கவும்.',
      telugu: 'మహారాష్ట్రలో చిన్న రైతులకు కొత్త సబ్సిడీ పథకం ఆదాయ పరిమితిని రూ. 2 లక్షలకు మరియు సబ్సిడీ మొత్తాన్ని రూ. 20,000కి పెంచుతుంది. మార్చి 31, 2024 లోపు దరఖాస్తు చేయండి.',
      kannada: 'ಮಹಾರಾಷ್ಟ್ರದಲ್ಲಿ ಸಣ್ಣ ರೈತರಿಗೆ ಹೊಸ ಸಬ್ಸಿಡಿ ಯೋಜನೆ ಆದಾಯ ಮಿತಿಯನ್ನು ರೂ. 2 ಲಕ್ಷಕ್ಕೆ ಮತ್ತು ಸಬ್ಸಿಡಿ ಮೊತ್ತವನ್ನು ರೂ. 20,000ಕ್ಕೆ ಹೆಚ್ಚಿಸುತ್ತದೆ. ಮಾರ್ಚ್ 31, 2024 ರೊಳಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.'
    },
    
    personalization: {
      farmer: {
        relevanceScore: 95,
        explanation: 'As a farmer in Maharashtra, this decision directly affects you. If you own less than 2 hectares of land and your annual income is below Rs. 2,00,000, you are now eligible for a Rs. 20,000 subsidy. This is great news - the income limit has been increased, so more farmers can benefit. You need to apply before March 31, 2024.',
        actionRequired: true,
        deadline: '2024-03-31'
      },
      student: {
        relevanceScore: 20,
        explanation: 'As a student, this decision is for general information. It relates to agricultural subsidies for farmers in Maharashtra. This may be relevant if your family is involved in farming.',
        actionRequired: false,
        deadline: null
      },
      business: {
        relevanceScore: 30,
        explanation: 'As a business owner, this decision may be relevant if you are involved in agricultural business or supply chain in Maharashtra. The increased subsidies may improve purchasing power of farmers.',
        actionRequired: false,
        deadline: null
      }
    }
  },

  karnatakaBusinessPolicy: {
    extractedText: `GOVERNMENT OF KARNATAKA
Department of Commerce and Industries
Notification No. CI/2024/089

Subject: Revised MSME Registration and Incentive Scheme - 2024

Date: 20th February 2024

ELIGIBILITY FOR MSME BENEFITS:
All Micro, Small and Medium Enterprises registered in Karnataka with investment up to Rs. 50 crore and turnover up to Rs. 250 crore are eligible for incentives.

KEY CHANGES:
1. Investment limit increased from Rs. 25 crore to Rs. 50 crore
2. Turnover limit increased from Rs. 100 crore to Rs. 250 crore
3. Registration fee waived for women entrepreneurs
4. Subsidy on electricity increased from 30% to 50% for first 3 years

INCENTIVES OFFERED:
- Capital subsidy: 15% of fixed capital investment (max Rs. 50 lakh)
- Interest subsidy: 5% on term loans for 5 years
- Electricity subsidy: 50% for first 3 years
- Stamp duty exemption on land purchase

Application deadline: 30th June 2024`,

    summary: {
      brief: 'Karnataka MSME scheme now covers businesses up to Rs. 50 crore investment with 50% electricity subsidy. Women entrepreneurs get free registration. Apply by June 30, 2024.',
      detailed: 'The Karnataka government has expanded its MSME incentive scheme. If your business has investment up to Rs. 50 crore and turnover up to Rs. 250 crore, you can get capital subsidy (15%), interest subsidy (5%), and electricity subsidy (50% for 3 years). Women entrepreneurs get registration fee waiver. Apply online at Karnataka Udyog Mitra portal before June 30, 2024.',
      actions: [
        'Check if your business investment is under Rs. 50 crore',
        'Verify turnover is under Rs. 250 crore',
        'Get Udyam Registration Certificate',
        'Prepare project report and bank loan documents',
        'Apply online at www.kum.karnataka.gov.in before June 30, 2024'
      ]
    },

    translations: {
      kannada: 'ಕರ್ನಾಟಕ MSME ಯೋಜನೆ ಈಗ ರೂ. 50 ಕೋಟಿ ಹೂಡಿಕೆಯವರೆಗಿನ ವ್ಯವಹಾರಗಳನ್ನು 50% ವಿದ್ಯುತ್ ಸಬ್ಸಿಡಿಯೊಂದಿಗೆ ಒಳಗೊಳ್ಳುತ್ತದೆ. ಮಹಿಳಾ ಉದ್ಯಮಿಗಳಿಗೆ ಉಚಿತ ನೋಂದಣಿ. ಜೂನ್ 30, 2024 ರೊಳಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
      hindi: 'कर्नाटक MSME योजना अब 50 करोड़ रुपये तक के निवेश वाले व्यवसायों को 50% बिजली सब्सिडी के साथ कवर करती है। महिला उद्यमियों को मुफ्त पंजीकरण। 30 जून 2024 तक आवेदन करें।',
      english: 'Karnataka MSME scheme now covers businesses up to Rs. 50 crore investment with 50% electricity subsidy. Women entrepreneurs get free registration. Apply by June 30, 2024.'
    },

    personalization: {
      business: {
        relevanceScore: 95,
        explanation: 'As a business owner in Karnataka, this scheme directly benefits you. If your investment is under Rs. 50 crore, you can get 15% capital subsidy, 5% interest subsidy, and 50% electricity subsidy for 3 years. Women entrepreneurs get additional benefits. Apply before June 30, 2024.',
        actionRequired: true,
        deadline: '2024-06-30'
      },
      farmer: {
        relevanceScore: 20,
        explanation: 'This scheme is for business enterprises. May be relevant if you are planning to start an agro-processing business.',
        actionRequired: false,
        deadline: null
      }
    }
  }
};
