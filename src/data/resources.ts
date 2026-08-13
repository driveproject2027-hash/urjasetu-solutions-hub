export type ResourceArticle = {
  slug: string;
  title: string;
  summary: string;
  body: { heading: string; text: string }[];
  source?: { label: string; url: string };
  updated?: string;
  tags: string[];
};

export type ResourceCategory = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  articles: ResourceArticle[];
};

const VERIFY =
  "Verify current eligibility and scheme details with the official government source before applying.";

export const LAST_UPDATED = "August 2026";

export const resourceCategories: ResourceCategory[] = [
  {
    slug: "dre-basics",
    name: "DRE Basics",
    tagline: "Start here if the term is new to you.",
    intro:
      "Decentralised renewable energy means generating and using energy close to where the work happens — on your roof, at your farm gate, inside your workshop.",
    articles: [
      {
        slug: "what-is-dre",
        title: "What is decentralised renewable energy?",
        summary: "Energy produced and consumed near the point of use, instead of travelling long distances.",
        tags: ["dre", "basics", "solar"],
        body: [
          {
            heading: "What is it?",
            text: "A small generation or energy-using asset — a rooftop solar array, a solar dryer, a cold room, an electric cart — installed at or near the business that uses it.",
          },
          {
            heading: "Why businesses look at it",
            text: "Most enterprises arrive with a business problem: a high electricity bill, production stopping during outages, produce spoiling, or a diesel cost that keeps climbing. DRE is one way of answering those problems.",
          },
          {
            heading: "What to work out first",
            text: "How much energy you use and when, what stops when power fails, how much space you have, and whether you own or rent the premises.",
          },
        ],
      },
      {
        slug: "grid-tied-vs-battery",
        title: "Grid-tied vs Solar + Battery",
        summary: "The most common decision a business faces, and how to think about it.",
        tags: ["solar", "battery storage", "basics"],
        body: [
          {
            heading: "Grid-tied",
            text: "Lower upfront cost, no battery to maintain or replace, suits stable daytime operations — but it stops working during an outage.",
          },
          {
            heading: "Solar + Battery",
            text: "Higher upfront cost and a battery to replace eventually, but chosen loads keep running when the grid fails.",
          },
          {
            heading: "How to decide",
            text: "Put a number on what an outage costs you per hour. If that number is small, grid-tied is usually enough. If production, cold chain or customers are lost, storage starts to pay for itself.",
          },
        ],
      },
      {
        slug: "questions-before-you-buy",
        title: "Ten questions to ask before you sign anything",
        summary: "A checklist for conversations with any DRE provider.",
        tags: ["basics", "providers", "checklist"],
        body: [
          {
            heading: "On the system",
            text: "What load is it sized for? What happens on a cloudy day? What is not covered during an outage? What is the expected life of each component?",
          },
          {
            heading: "On the commercials",
            text: "What is included in the quoted price? What is excluded — civil work, wiring, approvals? What are the payment stages?",
          },
          {
            heading: "On service",
            text: "Who services it, how quickly, and for how long? What does the warranty actually cover? Can you speak to two customers running a similar system?",
          },
        ],
      },
    ],
  },
  {
    slug: "government-schemes",
    name: "Government Schemes",
    tagline: "Support programmes relevant to MSMEs and DRE adoption.",
    intro:
      "These summaries are for orientation only. Scheme rules, eligibility and support levels change. UrjaSetu does not process applications or confirm eligibility.",
    articles: [
      {
        slug: "mse-gift",
        title: "MSE GIFT",
        summary: "Support aimed at micro and small enterprises making green investments.",
        tags: ["scheme", "solar subsidy", "green finance", "msme"],
        updated: LAST_UPDATED,
        source: { label: "Ministry of MSME", url: "https://msme.gov.in/" },
        body: [
          { heading: "What is it?", text: "A Ministry of MSME initiative to encourage micro and small enterprises to invest in green technology, including interest support on such investments." },
          { heading: "Who may benefit?", text: "Registered micro and small enterprises planning green or energy-related investments." },
          { heading: "What kind of support?", text: "Financial support linked to green investment, typically routed through lending institutions." },
          { heading: "Who may find it relevant?", text: "A manufacturing or processing unit financing a rooftop solar system or efficient equipment through a bank." },
          { heading: "How to learn more", text: "Check the Ministry of MSME portal and speak to your lending bank about current terms." },
          { heading: "Please note", text: VERIFY },
        ],
      },
      {
        slug: "mse-spice",
        title: "MSE SPICE",
        summary: "Support for micro and small enterprises moving towards cleaner production and electrification.",
        tags: ["scheme", "electrification", "msme"],
        updated: LAST_UPDATED,
        source: { label: "Ministry of MSME", url: "https://msme.gov.in/" },
        body: [
          { heading: "What is it?", text: "A Ministry of MSME scheme oriented towards helping small enterprises shift processes away from fossil fuels and towards cleaner, electrified alternatives." },
          { heading: "Who may benefit?", text: "Micro and small enterprises replacing fuel-based process equipment." },
          { heading: "What kind of support?", text: "Support connected to the cost of adopting cleaner process technology." },
          { heading: "Who may find it relevant?", text: "A unit replacing a diesel-run motor, boiler or dryer with an electric or solar alternative." },
          { heading: "How to learn more", text: "Refer to the Ministry of MSME portal for the current scheme guidelines." },
          { heading: "Please note", text: VERIFY },
        ],
      },
      {
        slug: "pmfme",
        title: "PMFME",
        summary: "Formalisation support for micro food processing enterprises.",
        tags: ["scheme", "food processing", "solar dryer", "cold storage"],
        updated: LAST_UPDATED,
        source: { label: "Ministry of Food Processing Industries", url: "https://pmfme.mofpi.gov.in/" },
        body: [
          { heading: "What is it?", text: "The PM Formalisation of Micro Food Processing Enterprises scheme supports individual micro food processing units, groups and FPOs." },
          { heading: "Who may benefit?", text: "Existing or new micro food processing enterprises, self-help groups, FPOs and cooperatives." },
          { heading: "What kind of support?", text: "Credit-linked support along with training and handholding through state nodal agencies." },
          { heading: "Who may find it relevant?", text: "A spice drying unit, a fruit processing enterprise or a cold room serving food produce." },
          { heading: "How to learn more", text: "Use the official PMFME portal and your state nodal agency or district resource person." },
          { heading: "Please note", text: VERIFY },
        ],
      },
      {
        slug: "pmegp",
        title: "PMEGP",
        summary: "Credit-linked support for setting up new micro enterprises.",
        tags: ["scheme", "new business", "pmegp", "loan"],
        updated: LAST_UPDATED,
        source: { label: "KVIC PMEGP portal", url: "https://www.kviconline.gov.in/pmegpeportal/" },
        body: [
          { heading: "What is it?", text: "The Prime Minister's Employment Generation Programme, a credit-linked programme for new micro enterprises in manufacturing and services." },
          { heading: "Who may benefit?", text: "Individuals and groups setting up a new unit, subject to the scheme's own conditions." },
          { heading: "What kind of support?", text: "A bank loan with a linked government contribution, applied for online and appraised by the bank." },
          { heading: "Who may find it relevant?", text: "A first-time entrepreneur starting a solar drying, cold storage or service enterprise." },
          { heading: "How to learn more", text: "Apply and read current rules on the KVIC PMEGP e-portal." },
          { heading: "Please note", text: VERIFY },
        ],
      },
      {
        slug: "zed",
        title: "ZED Certification",
        summary: "Certification and handholding for zero defect, zero effect manufacturing.",
        tags: ["scheme", "certification", "manufacturing"],
        updated: LAST_UPDATED,
        source: { label: "MSME ZED", url: "https://zed.msme.gov.in/" },
        body: [
          { heading: "What is it?", text: "A certification programme encouraging MSMEs to improve quality and reduce environmental impact." },
          { heading: "Who may benefit?", text: "Registered MSME manufacturers pursuing quality and efficiency improvement." },
          { heading: "What kind of support?", text: "Assessment, certification and handholding, with support towards certification cost." },
          { heading: "Who may find it relevant?", text: "A manufacturing unit combining energy efficiency work with a quality upgrade." },
          { heading: "How to learn more", text: "See the official MSME ZED portal." },
          { heading: "Please note", text: VERIFY },
        ],
      },
    ],
  },
  {
    slug: "finance-funding",
    name: "Finance & Funding",
    tagline: "The different ways a DRE project can be paid for.",
    intro:
      "This is orientation, not financial advice. The aim is to help you understand what kinds of financing may exist for a situation like yours before you talk to a bank, an institution or an investor.",
    articles: [
      {
        slug: "ways-to-finance",
        title: "Ways a DRE project gets financed",
        summary: "Subsidies, grants, concessional finance, commercial loans, equity and asset finance in plain language.",
        tags: ["dre financing", "loan", "grant", "equity"],
        body: [
          { heading: "Government support and subsidies", text: "A part of the cost is borne by a government programme, usually linked to a loan and released after verification." },
          { heading: "Grants", text: "Money that does not have to be repaid, generally from a programme or philanthropy, and usually tied to a specific purpose or pilot." },
          { heading: "Concessional finance", text: "A loan on softer terms — lower interest, longer tenure — often offered through development-oriented lenders." },
          { heading: "Commercial loans", text: "Standard term loans or working capital from a bank or NBFC, appraised on your cash flow and security." },
          { heading: "Equity and seed funding", text: "An investor puts in money for a share of the business. Relevant to enterprises that intend to scale, not to a single rooftop system." },
          { heading: "Blended finance", text: "A mix of grant or concessional money with commercial capital, used to make an otherwise difficult project bankable." },
          { heading: "Asset financing and leasing", text: "The equipment itself is financed or leased, so you pay over time rather than upfront." },
          { heading: "Pay-as-you-go and service models", text: "You pay per unit of output — per crate cooled, per kWh used — while the provider owns the asset." },
        ],
      },
      {
        slug: "getting-ready-to-borrow",
        title: "What lenders usually want to see",
        summary: "Preparing the paperwork and the numbers before you apply.",
        tags: ["loan", "dre financing", "bank"],
        body: [
          { heading: "Documentation", text: "Business registration, Udyam registration where applicable, bank statements, GST or income records and identity documents." },
          { heading: "The project case", text: "A quotation from a provider, the expected saving or additional income, and how repayment fits into monthly cash flow." },
          { heading: "Practical tips", text: "Get more than one quotation, keep the scope written down, and ask the lender which scheme, if any, can be attached to your loan." },
        ],
      },
    ],
  },
  {
    slug: "dre-technologies",
    name: "DRE Technologies",
    tagline: "Technology explained in business language.",
    intro:
      "Each technology page connects to the full solution profile, providers working on it and stories from businesses using it.",
    articles: [],
  },
  {
    slug: "business-opportunities",
    name: "Business Opportunities",
    tagline: "Enterprise ideas built on DRE.",
    intro:
      "These are opportunity outlines, not income projections. No return is guaranteed; feasibility depends entirely on your location, demand and costs.",
    articles: [],
  },
  {
    slug: "game-drive",
    name: "GAME & DRIVE",
    tagline: "The ecosystem behind the platform.",
    intro:
      "UrjaSetu is the platform. DRIVE is an initiative working on decentralised renewable energy for enterprise productivity. GAME is a separate entrepreneurship organisation active in the wider ecosystem.",
    articles: [
      {
        slug: "what-is-drive",
        title: "What is DRIVE?",
        summary: "An initiative focused on decentralised renewable energy for enterprise productivity.",
        tags: ["drive", "ecosystem"],
        body: [
          { heading: "The idea", text: "DRIVE works on the link between energy access and enterprise productivity: what changes for a small business when power becomes reliable and affordable." },
          { heading: "How it shows up here", text: "The solution categories, opportunity outlines and scheme references on UrjaSetu draw on DRIVE material about DRE-linked livelihoods." },
          { heading: "Relationship to UrjaSetu", text: "DRIVE is a supporting initiative. UrjaSetu is the platform businesses and providers use." },
        ],
      },
      {
        slug: "what-is-game",
        title: "What is GAME?",
        summary: "An entrepreneurship-focused organisation working in the wider ecosystem.",
        tags: ["game", "ecosystem", "entrepreneurship"],
        body: [
          { heading: "What it does", text: "GAME (Global Alliance for Mass Entrepreneurship) works on mass entrepreneurship in India — access to finance, market linkages and enabling policy." },
          { heading: "Why it appears here", text: "Entrepreneurship support and DRE adoption overlap: many DRE opportunities are, first of all, small businesses." },
          { heading: "An important distinction", text: "GAME is not presented here as the owner or operator of UrjaSetu. Any specific programme, funding or support should be described only where an official source states it." },
        ],
      },
      {
        slug: "ecosystem-support",
        title: "How ecosystem support can help DRE enterprises move from idea to implementation",
        summary: "Early-stage help usually matters more than the technology choice.",
        tags: ["ecosystem", "seed funding", "entrepreneurship"],
        body: [
          { heading: "Early-stage support", text: "Advice on sizing, demand assessment and business planning often decides whether a DRE enterprise survives its first year." },
          { heading: "Entrepreneurship support", text: "Training, mentoring, cluster networks and market linkages provided by ecosystem organisations and state agencies." },
          { heading: "Financing pathways", text: "Government schemes, concessional lenders, asset finance and — for enterprises that intend to scale — grant or seed capital from programmes." },
          { heading: "On claims", text: "UrjaSetu does not claim that any particular organisation funds any particular enterprise. Specific support is stated only where an official source confirms it." },
        ],
      },
      {
        slug: "why-dre-matters",
        title: "Why DRE matters for enterprise productivity",
        summary: "Reliable energy changes working hours, quality and losses — not just the bill.",
        tags: ["productivity", "ecosystem"],
        body: [
          { heading: "Hours", text: "A workshop that loses four hours a week to outages loses a fortnight of production a year." },
          { heading: "Quality", text: "Controlled drying, steady cooling and stable voltage reduce rejection and spoilage." },
          { heading: "Cost", text: "Diesel is the most expensive energy most small units buy. Replacing part of it changes the monthly picture." },
        ],
      },
    ],
  },
  {
    slug: "case-studies",
    name: "Case Studies",
    tagline: "What actually happened at real-world sites.",
    intro: "Illustrative business stories from the platform, written as problem, decision and outcome.",
    articles: [],
  },
  {
    slug: "guides-toolkits",
    name: "Guides & Toolkits",
    tagline: "Checklists and tools you can use today.",
    intro: "Practical, short and meant to be used during a conversation with a provider or a lender.",
    articles: [
      {
        slug: "provider-evaluation",
        title: "Provider evaluation checklist",
        summary: "How to compare two quotations that look similar on paper.",
        tags: ["providers", "checklist", "quote"],
        body: [
          { heading: "Compare the scope, not the price", text: "List every line item in both quotes. Missing wiring, mounting or approvals is the usual reason one quote looks cheaper." },
          { heading: "Check service reach", text: "How far away is the nearest service team, and what is the response commitment in writing?" },
          { heading: "Check references", text: "Ask for two customers with a similar load, and call them." },
        ],
      },
      {
        slug: "sizing-worksheet",
        title: "Load and sizing worksheet",
        summary: "Work out what you actually need before anyone sizes a system for you.",
        tags: ["sizing", "solar", "checklist"],
        body: [
          { heading: "List your loads", text: "Every motor, light, fridge and machine, with its rating and the hours it runs." },
          { heading: "Separate critical loads", text: "Mark the equipment that must never stop. That subset determines battery size." },
          { heading: "Check the bill", text: "Twelve months of units consumed tells you more than any estimate." },
        ],
      },
    ],
  },
  {
    slug: "insights",
    name: "Blogs & Insights",
    tagline: "Views from the ecosystem.",
    intro: "Short articles on how businesses actually make these decisions.",
    articles: [
      {
        slug: "start-with-the-problem",
        title: "Why businesses should start with the problem, not the technology",
        summary: "The technology question is the last one to answer, not the first.",
        tags: ["insight", "basics"],
        body: [
          { heading: "The common mistake", text: "A business decides it wants solar, then works backwards to justify it. The system often ends up sized for a bill rather than for the work." },
          { heading: "A better order", text: "Name the problem — cost, outages, spoilage, throughput. Quantify it. Only then look at which technologies address it." },
          { heading: "What changes", text: "You end up comparing providers on the same defined scope, which makes quotations comparable." },
        ],
      },
      {
        slug: "is-solar-right",
        title: "Is solar right for my business?",
        summary: "Four checks that settle the question quickly.",
        tags: ["solar", "insight"],
        body: [
          { heading: "Do you use power during the day?", text: "Solar generates in daylight. A business that runs at night saves far less without storage." },
          { heading: "Do you have shade-free roof or ground?", text: "Roughly 100 sq ft per kW, unshaded, structurally sound." },
          { heading: "Do you own the premises?", text: "On rented premises, look at shorter payback or portable options." },
          { heading: "Is your bill large enough?", text: "The saving has to be big enough for the payback to matter." },
        ],
      },
      {
        slug: "pv-vs-battery",
        title: "Solar PV vs Solar + Battery: what the difference costs",
        summary: "Where the extra money goes, and when it is worth spending.",
        tags: ["solar", "battery storage", "insight"],
        body: [
          { heading: "Where the cost sits", text: "The battery and the hybrid inverter carry the premium, and the battery has a finite life." },
          { heading: "When it pays", text: "When an hour of downtime costs real money — lost production, spoiled stock, customers turned away." },
          { heading: "A middle path", text: "Size storage for the critical subset of loads only, rather than for the whole premises." },
        ],
      },
    ],
  },
];

export const financeHelperOptions = {
  businessTypes: [
    "Farming / FPO",
    "Food processing",
    "Textile / stitching",
    "Retail / shop",
    "Manufacturing / workshop",
    "Services",
    "Logistics / mobility",
  ],
  stages: ["Idea", "New business", "Existing business", "Expanding"],
  solutions: [
    "Solar PV",
    "Solar + Battery",
    "Battery storage",
    "Solar pump",
    "Solar drying",
    "Cold storage",
    "Processing equipment",
    "E-mobility",
  ],
  costs: ["Under ₹1 lakh", "₹1–5 lakh", "₹5–25 lakh", "₹25 lakh–1 crore", "Above ₹1 crore"],
  supportTypes: ["Subsidy", "Loan", "Grant", "Equity", "Not sure"],
};

export type FinanceMatch = { name: string; why: string; check: string; source: { label: string; url: string } };

export function matchFinancing(input: {
  businessType: string;
  stage: string;
  solution: string;
  cost: string;
  support: string;
}): FinanceMatch[] {
  const out: FinanceMatch[] = [];
  const isNew = input.stage === "Idea" || input.stage === "New business";
  const isFood =
    input.businessType === "Food processing" ||
    input.businessType === "Farming / FPO" ||
    input.solution === "Solar drying" ||
    input.solution === "Cold storage";

  if (isNew && input.support !== "Equity") {
    out.push({
      name: "PMEGP",
      why: "Aimed at setting up new micro enterprises through a credit-linked route.",
      check: "Whether a new unit of your type and location is covered, and which bank in your area processes applications.",
      source: { label: "KVIC PMEGP portal", url: "https://www.kviconline.gov.in/pmegpeportal/" },
    });
  }
  if (isFood) {
    out.push({
      name: "PMFME",
      why: "Covers micro food processing units, including drying, processing and cold chain activities.",
      check: "Whether your activity is in the covered list and who your state nodal agency is.",
      source: { label: "PMFME portal", url: "https://pmfme.mofpi.gov.in/" },
    });
  }
  if (input.support === "Subsidy" || input.support === "Loan" || input.support === "Not sure") {
    out.push({
      name: "MSE GIFT",
      why: "Oriented towards micro and small enterprises making green investments financed through a lender.",
      check: "Current interest support terms and whether your bank participates.",
      source: { label: "Ministry of MSME", url: "https://msme.gov.in/" },
    });
  }
  if (
    input.solution === "Processing equipment" ||
    input.solution === "Solar + Battery" ||
    input.businessType === "Manufacturing / workshop" ||
    input.businessType === "Textile / stitching"
  ) {
    out.push({
      name: "MSE SPICE",
      why: "Supports small enterprises shifting processes towards cleaner and electrified alternatives.",
      check: "Whether your specific equipment change falls within the current scheme scope.",
      source: { label: "Ministry of MSME", url: "https://msme.gov.in/" },
    });
  }
  if (input.stage === "Existing business" || input.stage === "Expanding") {
    out.push({
      name: "ZED Certification",
      why: "Relevant to established manufacturers combining efficiency work with a quality upgrade.",
      check: "Certification levels, cost support and whether your unit is a registered MSME.",
      source: { label: "MSME ZED", url: "https://zed.msme.gov.in/" },
    });
  }
  if (input.support === "Equity" || input.cost === "Above ₹1 crore") {
    out.push({
      name: "Equity, blended and impact capital",
      why: "Larger or scale-oriented projects often need capital beyond a single scheme or term loan.",
      check: "Whether the enterprise is structured to take on an investor, and what the investor expects in return.",
      source: { label: "Read: Ways a DRE project gets financed", url: "/resources/finance-funding" },
    });
  }
  out.push({
    name: "Bank or NBFC term loan",
    why: "Most DRE assets are ultimately paid for through a loan, with schemes attached on top where applicable.",
    check: "Interest rate, tenure, security required and whether a scheme can be linked to the same loan.",
    source: { label: "Read: What lenders usually want to see", url: "/resources/finance-funding" },
  });
  return out;
}
