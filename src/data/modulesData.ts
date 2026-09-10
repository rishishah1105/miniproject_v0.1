export interface Chapter {
  id: string;
  title: string;
  content: string;
  example?: string;
  keyPoint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  chapterId: string;
  type: 'multiple-choice' | 'true-false' | 'match';
  options: string[];
  correctAnswer: number | string;
  explanation: string;
}

export interface ConceptModule {
  id: string;
  title: string;
  category: 'Basics' | 'Risk & Diversification' | 'Instruments' | 'Trading Mechanics' | 'Portfolio Strategy';
  categoryOrder: number;
  prerequisites: string[];
  estimatedMinutes: number;
  xpReward: number;
  summary: string;
  chapters: Chapter[];
  visualAidType: 
    | 'compounding-calculator'
    | 'sip-growth'
    | 'diversification-pie'
    | 'risk-return-scatter'
    | 'candlestick-interactive'
    | 'order-book-visualizer'
    | 'bid-ask-margin'
    | 'pe-ratio-comparator'
    | 'etf-breakdown'
    | 'stock-equity-visual'
    | 'bond-yield-timeline'
    | 'portfolio-allocation-slider'
    | 'dca-simulator';
  keyTakeaways: string[];
  quiz: QuizQuestion[];
}

export const MODULES_DATA: ConceptModule[] = [
  // 1. WHAT IS A STOCK
  {
    id: 'what-is-a-stock',
    title: 'What is a Stock?',
    category: 'Basics',
    categoryOrder: 1,
    prerequisites: [],
    estimatedMinutes: 6,
    xpReward: 100,
    summary: 'Discover how buying a share makes you a real part-owner of a corporation.',
    chapters: [
      {
        id: 'ch1-1',
        title: 'Chapter 1: Fractional Ownership in Corporations',
        content: 'A stock (or equity share) represents proportional fractional ownership in a business. When companies like Reliance Industries or Infosys need money to build factories, launch new tech products, or expand retail stores, they split their total corporate valuation into millions of tiny pieces called shares and sell them on stock exchanges to public investors.',
        example: 'If Reliance Industries is divided into 100 crore total shares and you purchase 100 shares, you literally own 0.00001% of Reliance Industries, giving you legal voting rights at shareholder meetings.',
        keyPoint: 'Buying a stock makes you an actual co-owner of the company, sharing in both its future financial expansion and its risks.'
      },
      {
        id: 'ch1-2',
        title: 'Chapter 2: Two Ways Investors Earn Returns',
        content: 'Stockholders profit through two distinct mechanisms: Capital Appreciation and Dividends.\n\n1. Capital Gains: Occurs when the market price of your stock increases over time due to corporate earnings growth. If you buy TCS at ₹3,000 and sell at ₹4,200, your capital gain is ₹1,200 per share.\n2. Dividends: Direct cash payouts made from company profits directly into your bank account. Established Indian companies like ITC and TCS pay quarterly dividends to reward long-term shareholders.',
        example: 'ITC Limited frequently distributes over 70% of its annual net profits back to shareholders as cash dividend payouts.',
        keyPoint: 'Total Stock Return = Capital Gains (price increase) + Dividend Payouts.'
      },
      {
        id: 'ch1-3',
        title: 'Chapter 3: Stock Exchanges & Price Drivers',
        content: 'Stocks are listed and traded on formal exchanges like the National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) in India. Prices change every second based on auction supply (sellers) and demand (buyers).\n\nWhen a company reports record-breaking quarterly profits, more buyers bid for the stock, driving prices up. Conversely, bad corporate news or economic recessions cause selling pressure, driving prices down.',
        example: 'During Tata Motors\' successful EV turnaround, increased buyer demand pushed Tata Motors stock from ₹70 up to over ₹1,000.',
        keyPoint: 'Stock prices are not arbitrary—they reflect real-time buyer demand, seller supply, and underlying business earnings.'
      }
    ],
    visualAidType: 'stock-equity-visual',
    keyTakeaways: [
      'A stock is an equity share representing fractional company ownership.',
      'Returns come from Capital Gains (price appreciation) and Dividend Cash Payouts.',
      'Stock prices fluctuate live on NSE/BSE based on business earnings and supply/demand.'
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'What does buying a share of stock represent?',
        chapterId: 'ch1-1',
        type: 'multiple-choice',
        options: [
          'A fixed-interest personal loan to the founder',
          'Proportional fractional ownership in the corporation',
          'A contract to buy products at a 50% discount',
          'A government insurance certificate'
        ],
        correctAnswer: 1,
        explanation: 'As explained in Chapter 1, buying a stock gives you fractional equity ownership in the business.'
      },
      {
        id: 'q1-2',
        question: 'How do investors earn capital gains on stocks?',
        chapterId: 'ch1-2',
        type: 'multiple-choice',
        options: [
          'By selling the stock at a higher price than what they paid to buy it',
          'By collecting monthly salary checks from HR',
          'By receiving tax refunds from commercial banks',
          'By holding stock during a company name change'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 explains that capital gains occur when you sell a stock for a higher market price than your purchase price.'
      },
      {
        id: 'q1-3',
        question: 'Where are public Indian corporate stocks traded?',
        chapterId: 'ch1-3',
        type: 'multiple-choice',
        options: [
          'National Stock Exchange (NSE) and Bombay Stock Exchange (BSE)',
          'Central Tax Reserve Bureau',
          'Commercial bank branch counters only',
          'Private social media chatrooms'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 3 notes that public shares in India are traded electronically on the NSE and BSE exchanges.'
      }
    ]
  },

  // 2. WHAT IS A BOND
  {
    id: 'what-is-a-bond',
    title: 'What is a Bond?',
    category: 'Basics',
    categoryOrder: 2,
    prerequisites: ['what-is-a-stock'],
    estimatedMinutes: 6,
    xpReward: 100,
    summary: 'Understand fixed-income debt instruments where you act as lender to governments or corporations.',
    chapters: [
      {
        id: 'ch2-1',
        title: 'Chapter 1: Act as the Lender (Debt vs Equity)',
        content: 'Unlike stocks where you purchase equity ownership, buying a bond means you are acting as a lender. Governments (like the Government of India) and corporations issue bonds when they need to borrow large sums of money for infrastructure projects or refinancing debt.',
        example: 'When the Indian government issues 10-Year G-Secs (Government Securities), individual investors lend funds and receive guaranteed coupon interest.',
        keyPoint: 'Bonds are IOUs—you do not own company shares; you hold debt that must be repaid.'
      },
      {
        id: 'ch2-2',
        title: 'Chapter 2: Principal, Coupon, and Maturity Date',
        content: 'Every bond contract is defined by three fundamental parameters:\n\n1. Principal (Face Value): The original sum of money lent (e.g. ₹10,000).\n2. Coupon Rate: The fixed annual interest rate paid by the borrower (e.g. 7.5% per annum).\n3. Maturity Date: The exact future date when the borrower must return the full principal amount to the bondholder.',
        example: 'A 5-year bond with ₹1,00,000 principal at 7% coupon pays ₹7,000 interest every year for 5 years, then returns the full ₹1,00,000 at maturity.',
        keyPoint: 'Bonds provide predictable, scheduled fixed income regardless of stock market fluctuations.'
      },
      {
        id: 'ch2-3',
        title: 'Chapter 3: Liquidation Priority & Safety Hierarchy',
        content: 'Bonds generally carry lower risk than stocks. If a corporation faces financial bankruptcy, debt obligations (bondholders) MUST be paid back first before equity shareholders receive a single rupee.',
        example: 'In corporate restructuring, bondholders take priority over stockholders in claiming remaining company assets.',
        keyPoint: 'Bonds offer higher capital protection and lower volatility, making them ideal for capital preservation.'
      }
    ],
    visualAidType: 'bond-yield-timeline',
    keyTakeaways: [
      'Bonds are debt instruments—you act as lender receiving fixed interest.',
      'Key terms: Principal (loan amount), Coupon (interest rate), Maturity (repayment date).',
      'Bondholders have higher repayment priority than stockholders in company liquidation.'
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'What is the primary role of an investor who buys a bond?',
        chapterId: 'ch2-1',
        type: 'multiple-choice',
        options: [
          'Acting as a lender to the issuer',
          'Becoming a voting shareholder',
          'Managing daily company operations',
          'Purchasing company products at cost'
        ],
        correctAnswer: 0,
        explanation: 'As covered in Chapter 1, bondholders act as lenders to governments or corporations.'
      },
      {
        id: 'q2-2',
        question: 'What does the Coupon Rate of a bond represent?',
        chapterId: 'ch2-2',
        type: 'multiple-choice',
        options: [
          'The fixed annual interest percentage paid to the bondholder',
          'The discount coupon for online retail shopping',
          'The percentage fee charged by the stockbroker',
          'The inflation rate of the country'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 specifies that the coupon rate is the fixed annual interest paid on the bond principal.'
      },
      {
        id: 'q2-3',
        question: 'Who gets paid first if a company undergoes liquidation?',
        chapterId: 'ch2-3',
        type: 'multiple-choice',
        options: [
          'Bondholders (debt holders)',
          'Common equity stockholders',
          'Board of Directors bonuses',
          'Marketing agency vendors'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 3 highlights that bondholders have legal priority over equity shareholders during bankruptcy.'
      }
    ]
  },

  // 3. COMPOUNDING INTEREST
  {
    id: 'compounding-interest',
    title: 'Compounding Interest: The 8th Wonder',
    category: 'Basics',
    categoryOrder: 3,
    prerequisites: ['what-is-a-stock'],
    estimatedMinutes: 6,
    xpReward: 120,
    summary: 'See how earning interest on top of past interest creates exponential wealth over time.',
    chapters: [
      {
        id: 'ch3-1',
        title: 'Chapter 1: The Magic of Interest on Interest',
        content: 'Compounding occurs when the investment returns generated by your initial money begin earning their own returns. Instead of withdrawing your annual profits, you reinvest them back into the asset.',
        example: 'Investing ₹1,00,000 at 10% interest yields ₹10,000 in Year 1 (Total: ₹1,10,000). In Year 2, you earn 10% on ₹1,10,000 = ₹11,000. By Year 25, that single ₹1,00,000 grows to over ₹10.8 Lakhs!',
        keyPoint: 'Compounding turns linear annual gains into an accelerating exponential curve.'
      },
      {
        id: 'ch3-2',
        title: 'Chapter 2: Simple vs. Compound Growth',
        content: 'Simple interest only calculates returns on your initial principal balance forever. Compound interest calculates returns on principal PLUS all past accumulated interest.',
        example: '₹1,00,000 simple interest at 10% pays ₹10,000 every single year (Total after 30 yrs = ₹4,00,000). Compound interest at 10% grows to ₹17,44,940 after 30 years—more than 4x simple interest!',
        keyPoint: 'Reinvesting returns is the secret multiplier of compound growth.'
      },
      {
        id: 'ch3-3',
        title: 'Chapter 3: Why Time is the Ultimate Multiplier',
        content: 'The mathematical exponent in compounding is TIME. Starting to invest at age 20 vs age 30 can result in a multi-lakh difference at retirement, even if the person who started late invests double the monthly cash!',
        example: 'Student A invests ₹5,000/month from age 20 to 30 (10 yrs) and stops. Student B starts at age 30 and invests ₹5,000/month from age 30 to 60 (30 yrs). Student A ends up with MORE money at 60 because of those extra 10 years of compounding!',
        keyPoint: 'Start early—time in the market matters far more than timing the market.'
      }
    ],
    visualAidType: 'compounding-calculator',
    keyTakeaways: [
      'Compounding earns interest on top of previously earned interest.',
      'Starting 10 years earlier has a bigger wealth impact than doubling your monthly savings later.',
      'Time is the exponent that creates exponential compounding wealth.'
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'Why is compound growth exponential while simple interest is linear?',
        chapterId: 'ch3-1',
        type: 'multiple-choice',
        options: [
          'Compound interest earns returns on both principal and past accumulated returns',
          'Simple interest rates change every week',
          'Banks charge double fees on simple interest accounts',
          'Government taxes compound interest at 0%'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 1 explains that compound growth accelerates because returns earn interest on top of interest.'
      },
      {
        id: 'q3-2',
        question: 'Which variable has the strongest multiplier impact on compounding long term?',
        chapterId: 'ch3-3',
        type: 'multiple-choice',
        options: [
          'Time horizon (number of years invested)',
          'The color of your brokerage app theme',
          'Checking market prices 10 times a day',
          'Opening accounts in 5 different banks'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 3 proves that time is the exponent in the compounding equation—starting earlier yields massive multiplier advantages.'
      }
    ]
  },

  // 4. SIPS EXPLAINED
  {
    id: 'sips-explained',
    title: 'Systematic Investment Plans (SIP)',
    category: 'Basics',
    categoryOrder: 4,
    prerequisites: ['compounding-interest'],
    estimatedMinutes: 6,
    xpReward: 110,
    summary: 'Learn automated rupee-cost investing to build financial discipline without timing the market.',
    chapters: [
      {
        id: 'ch4-1',
        title: 'Chapter 1: What is a Systematic Investment Plan (SIP)?',
        content: 'An SIP is an automated wealth-building tool that allows you to invest a fixed sum of money at regular intervals (monthly or quarterly) into equity mutual funds or index ETFs.',
        example: 'Setting up an auto-debit of ₹1,000 every month on the 5th into a Nifty 50 Index Fund.',
        keyPoint: 'SIP automates financial discipline so you build wealth effortlessly on salary day.'
      },
      {
        id: 'ch4-2',
        title: 'Chapter 2: Rupee-Cost Averaging Advantage',
        content: 'When market prices drop, your fixed monthly SIP payment automatically buys MORE mutual fund units at bargain prices. When prices rise, your fixed payment buys FEWER units. Over full market cycles, this lowers your average cost per unit.',
        example: 'Month 1: NAV = ₹100 → ₹1,000 buys 10 units. Month 2: Market dips, NAV = ₹50 → ₹1,000 buys 20 units! Average cost drops to ₹66.6 per unit.',
        keyPoint: 'Rupee-cost averaging turns market dips into discount buying opportunities.'
      },
      {
        id: 'ch4-3',
        title: 'Chapter 3: Eliminating Emotional Stress',
        content: 'Trying to predict when the stock market will hit bottom is impossible. SIP removes fear and greed from investing—you buy continuously regardless of market headlines.',
        example: 'Investors who continued their SIPs through market crashes in 2008 and 2020 achieved substantial long-term gains during market recoveries.',
        keyPoint: 'Automated consistency beats emotional market timing every single time.'
      }
    ],
    visualAidType: 'sip-growth',
    keyTakeaways: [
      'SIP automates regular fixed-amount investing into mutual funds/ETFs.',
      'Rupee-cost averaging buys more units when prices dip and fewer when prices rise.',
      'Starting small (e.g. ₹500/month) builds long-term wealth without emotional market timing.'
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'What happens when market prices drop during an active monthly SIP contribution?',
        chapterId: 'ch4-2',
        type: 'multiple-choice',
        options: [
          'Your fixed monthly amount automatically purchases MORE fund units at lower prices',
          'Your SIP account is immediately locked for 1 year',
          'You are forced to pay penalty fees',
          'Your existing units are sold automatically'
        ],
        correctAnswer: 0,
        explanation: 'As explained in Chapter 2, rupee-cost averaging buys more units when unit NAV prices drop.'
      },
      {
        id: 'q4-2',
        question: 'What is the biggest psychological benefit of an SIP?',
        chapterId: 'ch4-3',
        type: 'multiple-choice',
        options: [
          'It eliminates emotional market-timing stress through automated discipline',
          'It guarantees stock prices will never fall',
          'It lets you trade options without margin cash',
          'It eliminates capital gains taxes'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 3 highlights that automated SIP discipline removes fear and impulse trading.'
      }
    ]
  },

  // 5. RISK VS RETURN
  {
    id: 'risk-vs-return',
    title: 'Risk vs. Return Tradeoff',
    category: 'Risk & Diversification',
    categoryOrder: 5,
    prerequisites: ['what-is-a-bond'],
    estimatedMinutes: 6,
    xpReward: 120,
    summary: 'Master the fundamental economic rule: higher potential returns come with higher potential risk.',
    chapters: [
      {
        id: 'ch5-1',
        title: 'Chapter 1: Return is the Compensation for Risk',
        content: 'In financial markets, risk is defined as price volatility and the probability of losing capital. Investors demand higher potential returns as compensation for accepting higher risk.',
        example: 'Bank Fixed Deposits (FDs) offer safe 6.5% interest with zero volatility. Equities offer potential 12-15% annual growth, but prices can fluctuate 20% in a month.',
        keyPoint: 'Higher expected return statistically requires accepting higher short-term price risk.'
      },
      {
        id: 'ch5-2',
        title: 'Chapter 2: The Spectrum of Asset Classes',
        content: 'Assets sit on a continuous risk spectrum:\n\n1. Ultra Low Risk: Savings Accounts & Govt Treasury Bills (G-Secs).\n2. Moderate Risk: Corporate Bonds, Nifty 50 Index Funds.\n3. High Risk: Small-Cap Stocks, Sectoral Tech Funds.\n4. Extreme Speculation: Crypto Tokens, Futures & Options (F&O).',
        example: 'G-Secs are backed by the Indian sovereign government, whereas F&O derivatives carry extreme leverage risk.',
        keyPoint: 'Structure your investments according to your personal financial safety net and time horizon.'
      },
      {
        id: 'ch5-3',
        title: 'Chapter 3: Spotting Guaranteed Return Scams',
        content: 'Any investment scheme offering "guaranteed 30% annual return with zero risk" is mathematically and economically impossible. High returns CANNOT exist without risk.',
        example: 'Ponzi schemes promise high guaranteed payouts using new investor money until the pyramid collapses.',
        keyPoint: 'If someone offers high returns with zero risk, it is almost certainly a scam.'
      }
    ],
    visualAidType: 'risk-return-scatter',
    keyTakeaways: [
      'Potential return is the reward for taking on price volatility and risk.',
      'Assets range from low-risk G-Secs/FDs to moderate Index Funds to high-risk Equities/Crypto.',
      'Guaranteed high returns with zero risk do not exist in genuine economics.'
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'What is the core principle of the Risk vs Return tradeoff?',
        chapterId: 'ch5-1',
        type: 'multiple-choice',
        options: [
          'To achieve higher potential growth, you must accept higher price risk/volatility',
          'Low risk assets always pay the highest returns',
          'Stock market risk can be completely deleted by software',
          'Bonds always lose money over 10 years'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 1 establishes that higher return potential requires accepting higher short-term volatility.'
      },
      {
        id: 'q5-2',
        question: 'Which asset sits on the lowest risk end of the financial spectrum?',
        chapterId: 'ch5-2',
        type: 'multiple-choice',
        options: [
          'Short-term Government Treasury Bills (G-Secs)',
          'Individual penny stocks',
          'Crypto tokens',
          'Unregulated startups'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 notes that G-Secs are backed by sovereign credit, making them the lowest risk asset class.'
      }
    ]
  },

  // 6. DIVERSIFICATION
  {
    id: 'diversification',
    title: 'Diversification: The Only Free Lunch',
    category: 'Risk & Diversification',
    categoryOrder: 6,
    prerequisites: ['risk-vs-return'],
    estimatedMinutes: 6,
    xpReward: 130,
    summary: 'Don\'t put all your eggs in one basket—learn how spreading investments reduces portfolio volatility.',
    chapters: [
      {
        id: 'ch6-1',
        title: 'Chapter 1: Spreading Company Exposure',
        content: 'Diversification means distributing your capital across multiple companies, industries, and asset classes. If one single business fails, it will not collapse your net worth.',
        example: 'Holding 100% of your net worth in 1 tech stock vs holding 25 stocks across Banking, IT, Pharma, Auto, and FMCG.',
        keyPoint: 'Spreading investments prevents single-company disasters from destroying your savings.'
      },
      {
        id: 'ch6-2',
        title: 'Chapter 2: Unsystematic vs. Systematic Risk',
        content: '1. Unsystematic Risk: Company-specific risk (e.g. CEO resignation, product failure). Diversification completely eliminates this!\n2. Systematic Risk: Broader market/economic risk (e.g. inflation spikes, RBI interest rate hikes). Affects all assets to varying degrees.',
        example: 'Holding TCS, Infosys, and Wipro protects against 1 company failing, but NOT against an IT sector slowdown. True diversification requires multiple sectors (e.g. IT + Banking + FMCG).',
        keyPoint: 'Unsystematic risk is eliminated by spreading across different industries.'
      },
      {
        id: 'ch6-3',
        title: 'Chapter 3: Asset Class Correlation',
        content: 'Nobel laureate Harry Markowitz called diversification "the only free lunch in finance" because combining non-correlated assets (stocks, bonds, gold) smooths out overall portfolio swings without lowering expected long-term returns.',
        example: 'During stock market panics, gold and government bonds frequently rise or stay stable, offsetting equity losses.',
        keyPoint: 'Non-correlated assets cushion your portfolio during economic storms.'
      }
    ],
    visualAidType: 'diversification-pie',
    keyTakeaways: [
      'Diversification eliminates company-specific (unsystematic) risk.',
      'True diversification spans multiple industries (Banking, IT, Pharma, FMCG) and asset classes (Equity, Gold, Bonds).',
      'It reduces portfolio volatility without sacrificing long-term expected growth.'
    ],
    quiz: [
      {
        id: 'q6-1',
        question: 'What type of risk is eliminated through broad stock diversification?',
        chapterId: 'ch6-2',
        type: 'multiple-choice',
        options: [
          'Unsystematic (company-specific) risk',
          'Systematic (entire economy) risk',
          'Currency exchange rate changes',
          'Government tax policy risk'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 explains that unsystematic (company-specific) risk is eliminated by holding a broad portfolio.'
      },
      {
        id: 'q6-2',
        question: 'Which portfolio represents true multi-sector diversification?',
        chapterId: 'ch6-2',
        type: 'multiple-choice',
        options: [
          'RELIANCE (Conglomerate), TCS (IT), HDFCBANK (Banking), ITC (FMCG), and Gold ETF',
          '5 different IT software companies only',
          '10 different crypto meme coins',
          '100% in 1 electric car startup'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 and 3 highlight that true diversification spans multiple distinct sectors and asset classes.'
      }
    ]
  },

  // 7. INDEX FUNDS AND ETFS
  {
    id: 'index-funds-and-etfs',
    title: 'Index Funds & ETFs',
    category: 'Instruments',
    categoryOrder: 7,
    prerequisites: ['diversification'],
    estimatedMinutes: 6,
    xpReward: 120,
    summary: 'Understand how single basket funds let you instantly buy hundreds of top companies at ultra-low cost.',
    chapters: [
      {
        id: 'ch7-1',
        title: 'Chapter 1: Passive Benchmark Tracking',
        content: 'An Exchange-Traded Fund (ETF) or Index Fund is a pooled investment vehicle that automatically mirrors a market index like NIFTY 50 or SENSEX. When you buy 1 unit of a Nifty 50 ETF, your money is automatically split across India\'s top 50 bluechip companies.',
        example: 'Buying NIFTYBEES ETF gives you instant exposure to Reliance, TCS, HDFC Bank, Infosys, ICICI Bank, and 45 others.',
        keyPoint: 'Index funds eliminate stock-picking guesswork by letting you buy the entire market index.'
      },
      {
        id: 'ch7-2',
        title: 'Chapter 2: Ultra-Low Expense Ratios',
        content: 'Active mutual funds hire expensive teams of analysts to pick stocks, charging high annual fees (1.5% - 2.5% TER). Passive Index ETFs automatically follow an index rulebook, charging tiny expense ratios (0.05% - 0.20%).',
        example: 'Over 20 years, saving 1.5% in annual fund management fees adds lakhs of extra rupees to your net worth due to compounding!',
        keyPoint: 'Low expense ratios mean more of your money stays invested and compounds for you.'
      },
      {
        id: 'ch7-3',
        title: 'Chapter 3: Historical Outperformance',
        content: 'Financial research shows that over 10-15 year time horizons, 85%+ of active fund managers fail to beat simple passive index benchmarks like Nifty 50 after accounting for fees.',
        example: 'The SPIVA India scorecard consistently shows passive index funds outperforming the majority of active large-cap mutual funds.',
        keyPoint: 'Passive index investing provides a reliable foundation for long-term wealth creation.'
      }
    ],
    visualAidType: 'etf-breakdown',
    keyTakeaways: [
      'Index ETFs pool hundreds of top companies into a single tradable unit.',
      'Ultra-low management fees compared to actively managed funds.',
      'Outperforms the vast majority of active stock pickers over long timeframes.'
    ],
    quiz: [
      {
        id: 'q7-1',
        question: 'What does a Nifty 50 Index ETF track?',
        chapterId: 'ch7-1',
        type: 'multiple-choice',
        options: [
          'The performance of 50 of the largest public Indian corporations',
          '50 random cryptocurrency tokens',
          'Government tax interest rates',
          'Real estate land prices in Mumbai'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 1 explains that Nifty 50 ETFs track India\'s 50 leading public bluechip corporations.'
      },
      {
        id: 'q7-2',
        question: 'Why are expense ratios lower in passive Index ETFs than active funds?',
        chapterId: 'ch7-2',
        type: 'multiple-choice',
        options: [
          'Index funds automatically follow an index rulebook without paying high-salaried stock analysts',
          'Government subsidies pay all ETF expenses',
          'ETFs are only open for trading 1 day per year',
          'Index funds do not pay dividends'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 clarifies that passive rule-based tracking eliminates expensive analyst team overhead.'
      }
    ]
  },

  // 8. PE RATIO BASICS
  {
    id: 'pe-ratio-basics',
    title: 'P/E Ratio Basics & Valuation',
    category: 'Instruments',
    categoryOrder: 8,
    prerequisites: ['what-is-a-stock'],
    estimatedMinutes: 6,
    xpReward: 130,
    summary: 'Learn how to read Price-to-Earnings ratios to judge if a stock is overvalued or bargain-priced.',
    chapters: [
      {
        id: 'ch8-1',
        title: 'Chapter 1: Price per Rupee of Profit',
        content: 'The Price-to-Earnings (P/E) Ratio measures how much investors are paying for ₹1 of annual company earnings.\n\nFormula: P/E Ratio = Stock Price ÷ Earnings Per Share (EPS).',
        example: 'If TCS stock price is ₹4,000 and its annual EPS is ₹100, its P/E ratio is ₹4,000 ÷ ₹100 = 40x. Investors pay ₹40 for every ₹1 of profit TCS generates.',
        keyPoint: 'P/E ratio evaluates valuation relative to underlying corporate earnings.'
      },
      {
        id: 'ch8-2',
        title: 'Chapter 2: High P/E vs Low P/E Stocks',
        content: '1. High P/E (>35x): Indicates investors expect rapid future earnings growth or that the stock is currently expensive.\n2. Low P/E (<15x): Indicates a mature value stock, slow growth, or potential market skepticism.',
        example: 'Tech stars like Tata Elxsi trade at high P/E ratios due to AI growth expectations, whereas PSU banks like SBIN trade at lower P/E ratios.',
        keyPoint: 'A high P/E implies high growth expectations; a low P/E implies value status or slow growth.'
      },
      {
        id: 'ch8-3',
        title: 'Chapter 3: Sector Comparison Context',
        content: 'Never compare P/E ratios across different industries! A software company P/E (30x) cannot be directly compared to a steel company P/E (10x). Always compare a company\'s P/E against its direct industry peers and historical average.',
        example: 'Compare Infosys P/E (27x) against TCS P/E (32x) and Wipro P/E (22x) in the IT sector.',
        keyPoint: 'Always evaluate P/E ratios against direct competitors in the same sector.'
      }
    ],
    visualAidType: 'pe-ratio-comparator',
    keyTakeaways: [
      'P/E ratio = Stock Price ÷ Earnings Per Share (EPS).',
      'High P/E signals high growth expectations; low P/E signals value status.',
      'Always compare P/E against competitors in the exact same sector.'
    ],
    quiz: [
      {
        id: 'q8-1',
        question: 'If a company stock price is ₹1,000 and its Earnings Per Share (EPS) is ₹50, what is its P/E ratio?',
        chapterId: 'ch8-1',
        type: 'multiple-choice',
        options: ['20x', '50x', '1000x', '5x'],
        correctAnswer: 0,
        explanation: 'P/E Ratio = Price (₹1,000) ÷ EPS (₹50) = 20x.'
      },
      {
        id: 'q8-2',
        question: 'When evaluating P/E ratios, what is the best baseline comparison?',
        chapterId: 'ch8-3',
        type: 'multiple-choice',
        options: [
          'Other competitor companies in the exact same industry/sector',
          'The total national highway length',
          'The founder\'s age',
          'Gold spot prices'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 3 emphasizes comparing P/E ratios across direct industry peers.'
      }
    ]
  },

  // 9. MARKET VS LIMIT ORDERS
  {
    id: 'market-vs-limit-orders',
    title: 'Market Orders vs. Limit Orders',
    category: 'Trading Mechanics',
    categoryOrder: 9,
    prerequisites: ['index-funds-and-etfs'],
    estimatedMinutes: 6,
    xpReward: 140,
    summary: 'Master execution mechanics: choosing instant speed vs precise price control.',
    chapters: [
      {
        id: 'ch9-1',
        title: 'Chapter 1: Market Orders (Instant Speed)',
        content: 'A Market Order instructs the broker to buy or sell immediately at the current best available market price. It guarantees instant execution speed, but does not guarantee an exact price if market prices move fast.',
        example: 'Placing a Market BUY order for 10 shares of Reliance fills instantly at the current ask price (₹2,985.40).',
        keyPoint: 'Market orders prioritize execution speed over exact price control.'
      },
      {
        id: 'ch9-2',
        title: 'Chapter 2: Limit Orders (Price Precision)',
        content: 'A Limit Order sets a specific target price threshold. A Limit BUY order fills ONLY at your specified limit price or lower. A Limit SELL order fills ONLY at your limit price or higher.',
        example: 'Reliance is trading at ₹2,985. You place a Limit BUY at ₹2,950. The order remains open and fills ONLY if Reliance price dips to ₹2,950 or below.',
        keyPoint: 'Limit orders prioritize price control over instant execution speed.'
      },
      {
        id: 'ch9-3',
        title: 'Chapter 3: Execution Risk & Volatility Strategy',
        content: 'The risk of a Limit Order is that if market prices never reach your target limit price, your order remains pending and unfilled. Use Limit Orders when trading volatile stocks or during market opening price gaps.',
        example: 'Setting a Limit Buy during earnings announcements protects you from unexpected price spikes.',
        keyPoint: 'Use Market orders for fast liquid execution; use Limit orders for price discipline.'
      }
    ],
    visualAidType: 'order-book-visualizer',
    keyTakeaways: [
      'Market orders execute instantly at current available market price.',
      'Limit orders execute only at your target price or better.',
      'Limit orders protect against unexpected price slippage in volatile markets.'
    ],
    quiz: [
      {
        id: 'q9-1',
        question: 'Which order type guarantees immediate execution speed at current market prices?',
        chapterId: 'ch9-1',
        type: 'multiple-choice',
        options: ['Market Order', 'Limit Order', 'Stop-Loss Order', 'Trailing Order'],
        correctAnswer: 0,
        explanation: 'Chapter 1 explains that Market orders prioritize instant execution speed.'
      },
      {
        id: 'q9-2',
        question: 'If TCS is trading at ₹4,210 and you set a Buy Limit Order at ₹4,150, when will it execute?',
        chapterId: 'ch9-2',
        type: 'multiple-choice',
        options: [
          'Only if TCS price drops to ₹4,150 or lower',
          'Immediately at ₹4,210',
          'At market close regardless of price',
          'Never; buy limit orders must be higher than current price'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 clarifies that a Buy Limit order executes only when market price reaches target limit or lower.'
      }
    ]
  },

  // 10. BID ASK SPREAD
  {
    id: 'bid-ask-spread',
    title: 'The Bid-Ask Spread',
    category: 'Trading Mechanics',
    categoryOrder: 10,
    prerequisites: ['market-vs-limit-orders'],
    estimatedMinutes: 5,
    xpReward: 110,
    summary: 'Understand buyer bids, seller asks, and market liquidity costs.',
    chapters: [
      {
        id: 'ch10-1',
        title: 'Chapter 1: The Two Sides of Order Books',
        content: 'Every stock exchange order book has two competing sides:\n\n1. BID: The highest price buyers are willing to pay right now.\n2. ASK (OFFER): The lowest price sellers are willing to accept right now.',
        example: 'Buyers stand at BID ₹1,640.00; Sellers stand at ASK ₹1,640.10.',
        keyPoint: 'Buyers bid low; sellers ask high.'
      },
      {
        id: 'ch10-2',
        title: 'Chapter 2: Calculating the Spread Gap',
        content: 'The Bid-Ask Spread is the price difference between Ask and Bid (Spread = Ask - Bid). In highly liquid stocks (like Reliance or HDFC Bank), the spread is tiny (a few paise). In illiquid small-cap stocks, the spread can be wide (several rupees).',
        example: 'Ask ₹1,640.10 - Bid ₹1,640.00 = Spread ₹0.10 (10 paise).',
        keyPoint: 'Tight spreads indicate high liquidity; wide spreads indicate low trading volume.'
      }
    ],
    visualAidType: 'bid-ask-margin',
    keyTakeaways: [
      'BID is buyer max price; ASK is seller min price.',
      'Spread = ASK minus BID.',
      'Tight spreads mean high liquidity and lower trading friction.'
    ],
    quiz: [
      {
        id: 'q10-1',
        question: 'If a stock has a BID of ₹500.00 and an ASK of ₹500.15, what is the Bid-Ask Spread?',
        chapterId: 'ch10-2',
        type: 'multiple-choice',
        options: ['₹0.15', '₹1000.15', '₹500.00', '₹1.50'],
        correctAnswer: 0,
        explanation: 'Spread = Ask (₹500.15) - Bid (₹500.00) = ₹0.15.'
      }
    ]
  },

  // 11. READING CANDLESTICKS
  {
    id: 'reading-candlesticks',
    title: 'Reading Candlestick Charts',
    category: 'Trading Mechanics',
    categoryOrder: 11,
    prerequisites: ['bid-ask-spread'],
    estimatedMinutes: 6,
    xpReward: 150,
    summary: 'Decode OHLC price charts like a professional trader: Open, High, Low, Close candles.',
    chapters: [
      {
        id: 'ch11-1',
        title: 'Chapter 1: Anatomy of OHLC Candles',
        content: 'Candlestick charts display four key price points for any chosen timeframe:\n\n1. Open (O): Price when period started.\n2. High (H): Maximum price touched.\n3. Low (L): Minimum price touched.\n4. Close (C): Final price when period ended.',
        example: 'A 15-minute candle for Nifty 50 shows exact price action between 10:00 AM and 10:15 AM.',
        keyPoint: 'Candles condense 4 data points (OHLC) into a visual shape.'
      },
      {
        id: 'ch11-2',
        title: 'Chapter 2: Bullish (Green) vs Bearish (Red) Bodies',
        content: '1. Bullish Candle (Green): Close price is HIGHER than Open price (Price went UP).\n2. Bearish Candle (Red): Close price is LOWER than Open price (Price went DOWN).',
        example: 'Open ₹1,800, Close ₹1,845 → Green Bullish body.\nOpen ₹1,845, Close ₹1,800 → Red Bearish body.',
        keyPoint: 'Green = Buyers won the timeframe; Red = Sellers pushed prices down.'
      },
      {
        id: 'ch11-3',
        title: 'Chapter 3: Wicks & Price Rejection Shadows',
        content: 'The thin vertical lines above and below the candle body are called wicks or shadows. They show maximum high and low price extremes touched before buyers or sellers pushed back.',
        example: 'A long upper wick indicates buyers tried to push price high, but sellers rejected it and pushed it back down.',
        keyPoint: 'Wicks reveal market price rejection and volatility bounds.'
      }
    ],
    visualAidType: 'candlestick-interactive',
    keyTakeaways: [
      'Green candle = Price closed higher than open (Bullish).',
      'Red candle = Price closed lower than open (Bearish).',
      'Wicks show High and Low price extremes during the period.'
    ],
    quiz: [
      {
        id: 'q11-1',
        question: 'What does a green (bullish) candlestick represent?',
        chapterId: 'ch11-2',
        type: 'multiple-choice',
        options: [
          'The stock closed at a higher price than it opened',
          'The stock closed at a lower price than it opened',
          'Trading was halted by regulators',
          'Zero volume occurred'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 explains that a green body signifies Close > Open (buyers pushed price up).'
      }
    ]
  },

  // 12. DOLLAR COST AVERAGING
  {
    id: 'dollar-cost-averaging',
    title: 'Dollar-Cost Averaging (DCA)',
    category: 'Portfolio Strategy',
    categoryOrder: 12,
    prerequisites: ['sips-explained', 'reading-candlesticks'],
    estimatedMinutes: 6,
    xpReward: 130,
    summary: 'Outsmart market volatility by investing consistent sums on a fixed schedule.',
    chapters: [
      {
        id: 'ch12-1',
        title: 'Chapter 1: The Strategy of Fixed Allocation',
        content: 'Dollar-Cost Averaging (DCA) is a disciplined approach where you allocate a fixed cash sum into investments at regular time intervals, regardless of whether news reports market booms or crashes.',
        example: 'Investing ₹5,000 every 1st of the month into an Index ETF.',
        keyPoint: 'DCA removes emotional guesswork from long-term investing.'
      },
      {
        id: 'ch12-2',
        title: 'Chapter 2: Outperforming Lump-Sum Market Timers',
        content: 'Trying to hoard cash and guess the exact bottom of a market crash usually fails. DCA ensures you automatically buy heavily during bear market pullbacks, dramatically lowering your long-term average cost basis.',
        example: 'DCA investors acquired cheap mutual fund units during 2020 market lows, accelerating their recovery wealth.',
        keyPoint: 'Time in the market beats trying to time the market.'
      }
    ],
    visualAidType: 'dca-simulator',
    keyTakeaways: [
      'DCA allocates fixed cash amounts on a regular schedule.',
      'Automatically buys extra shares during market dips.',
      'Proves that time in the market beats market timing.'
    ],
    quiz: [
      {
        id: 'q12-1',
        question: 'Why is DCA effective during market downswings?',
        chapterId: 'ch12-2',
        type: 'multiple-choice',
        options: [
          'Fixed cash contributions automatically buy MORE shares at discount prices',
          'Stock exchange rules freeze prices',
          'Bank interest rates double',
          'No stock can ever fall below ₹0'
        ],
        correctAnswer: 0,
        explanation: 'Chapter 2 shows that fixed dollar contributions acquire larger share quantities when prices fall.'
      }
    ]
  },

  // 13. PORTFOLIO ALLOCATION
  {
    id: 'portfolio-allocation',
    title: 'Portfolio Allocation & Rebalancing',
    category: 'Portfolio Strategy',
    categoryOrder: 13,
    prerequisites: ['dollar-cost-averaging'],
    estimatedMinutes: 6,
    xpReward: 150,
    summary: 'Learn how to structure your growth vs safety mix and rebalance over time.',
    chapters: [
      {
        id: 'ch13-1',
        title: 'Chapter 1: Structuring Asset Mix (Stocks vs Bonds)',
        content: 'Asset allocation determines the proportion of your portfolio split between growth assets (equities) and safety assets (bonds/debt/cash). It accounts for 90%+ of portfolio return variation.',
        example: 'Rule of Thumb (100 - Age): A 22-year-old student allocates 100 - 22 = 78% to Equities for growth, and 22% to Bonds/Debt for stability.',
        keyPoint: 'Younger investors with multi-decade time horizons allocate higher % to growth equities.'
      },
      {
        id: 'ch13-2',
        title: 'Chapter 2: Annual Rebalancing Strategy',
        content: 'As stock prices rally or crash, your asset allocation naturally drifts. Rebalancing means periodically selling overperforming assets or buying underperforming assets once a year to reset target risk proportions.',
        example: 'If equity rallies and turns your 80/20 portfolio into 92/8, selling 12% equity to buy debt resets your risk back to 80/20.',
        keyPoint: 'Rebalancing enforces the ultimate golden rule: selling high and buying low.'
      }
    ],
    visualAidType: 'portfolio-allocation-slider',
    keyTakeaways: [
      'Asset allocation determines overall portfolio risk and return profile.',
      'Use "100 - Age" as a baseline guide for equity vs debt split.',
      'Rebalance annually to reset target risk levels.'
    ],
    quiz: [
      {
        id: 'q13-1',
        question: 'Using the "100 - Age" rule of thumb, how much should a 20-year-old allocate to growth equities?',
        chapterId: 'ch13-1',
        type: 'multiple-choice',
        options: ['80%', '20%', '100%', '50%'],
        correctAnswer: 0,
        explanation: '100 - 20 = 80% target equity allocation for growth.'
      }
    ]
  }
];
