export type ProblemId =
  | "energy-cost"
  | "power-cuts"
  | "diesel"
  | "spoilage"
  | "processing"
  | "cooling"
  | "mobility"
  | "new-business";

export const problems: { id: ProblemId; label: string; blurb: string }[] = [
  { id: "energy-cost", label: "Reduce energy costs", blurb: "Electricity bills eating into margins." },
  { id: "power-cuts", label: "Avoid power cuts", blurb: "Production stops when supply fails." },
  { id: "diesel", label: "Reduce diesel dependence", blurb: "Generator running costs are rising." },
  { id: "spoilage", label: "Reduce post-harvest losses", blurb: "Produce spoils before it is sold." },
  { id: "processing", label: "Improve processing", blurb: "Manual work limits output and quality." },
  { id: "cooling", label: "Improve storage and cooling", blurb: "No reliable cold chain nearby." },
  { id: "mobility", label: "Improve mobility and delivery", blurb: "Reaching customers costs too much." },
  { id: "new-business", label: "Start a new business", blurb: "Looking for a viable DRE enterprise." },
];

export type Solution = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  what: string;
  solves: string[];
  who: string[];
  how: string;
  benefits: string[];
  limits: string[];
  applications: string[];
  problems: ProblemId[];
};

export const solutions: Solution[] = [
  {
    slug: "solar-pv",
    name: "Solar PV (Grid-Tied)",
    category: "Generation",
    summary: "Rooftop generation that offsets daytime electricity consumption.",
    what: "A rooftop photovoltaic system connected to the grid, generating power that your business consumes first, with surplus exported where net metering allows.",
    solves: ["High monthly electricity bills", "Rising tariffs for commercial connections"],
    who: ["Shops and showrooms", "Workshops with daytime operations", "Small manufacturing units"],
    how: "Panels generate DC power, an inverter converts it to AC, and the load consumes it directly. The grid supplies the balance.",
    benefits: ["Lowest cost per unit generated", "No battery to replace", "Simple maintenance"],
    limits: ["Does not work during a grid outage", "Needs shade-free roof area", "Savings depend on daytime load"],
    applications: ["Retail", "Textile units", "Food processing", "Service centres"],
    problems: ["energy-cost", "diesel"],
  },
  {
    slug: "solar-battery",
    name: "Solar + Battery",
    category: "Generation & Storage",
    summary: "Generation with storage so critical equipment keeps running during outages.",
    what: "A solar system paired with battery storage that keeps selected loads running when the grid fails.",
    solves: ["Frequent power interruptions", "Diesel generator dependence", "Lost production hours"],
    who: ["Tailoring and stitching units", "Dairy collection points", "Clinics and service businesses"],
    how: "Solar charges the battery during the day; an inverter draws from the battery when the grid is unavailable.",
    benefits: ["Continuity during outages", "Cuts diesel spend", "Protects sensitive equipment"],
    limits: ["Higher upfront cost", "Battery replacement after several years", "Backup limited to sized loads"],
    applications: ["Textile", "Retail", "Healthcare", "Agri services"],
    problems: ["power-cuts", "diesel", "energy-cost"],
  },
  {
    slug: "energy-storage",
    name: "Energy Storage",
    category: "Storage",
    summary: "Standalone battery backup for critical loads.",
    what: "Battery systems sized for essential equipment, charged from the grid or solar.",
    solves: ["Short but frequent outages", "Voltage instability"],
    who: ["Small shops", "Offices", "Workshops with light loads"],
    how: "Batteries charge when supply is available and discharge through an inverter during outages.",
    benefits: ["Quick to install", "Modular sizing"],
    limits: ["No generation savings on its own", "Finite cycle life"],
    applications: ["Retail", "Services"],
    problems: ["power-cuts"],
  },
  {
    slug: "cold-storage",
    name: "Cold Chain & Cooling",
    category: "Cold Chain",
    summary: "Solar-assisted cold rooms and chillers that extend shelf life.",
    what: "Small cold rooms, milk chillers and refrigeration units powered or supported by solar.",
    solves: ["Post-harvest spoilage", "Distress selling", "No cooling near the farm gate"],
    who: ["Farmer groups", "Dairy collection centres", "Fruit and vegetable traders"],
    how: "A solar array powers a compressor or thermal storage unit that holds temperature through the day and night.",
    benefits: ["Longer shelf life", "Better price realisation", "Reduced wastage"],
    limits: ["Needs steady utilisation to justify cost", "Requires maintenance discipline"],
    applications: ["Agriculture", "Dairy", "Fisheries", "Retail"],
    problems: ["spoilage", "cooling"],
  },
  {
    slug: "solar-drying",
    name: "Solar Drying",
    category: "Processing",
    summary: "Controlled drying for spices, fruit, fish and grain.",
    what: "Solar dryers that raise air temperature in an enclosed chamber to dry produce hygienically.",
    solves: ["Slow open-sun drying", "Contamination and quality rejection", "Monsoon losses"],
    who: ["Food processing micro-enterprises", "Self-help groups", "Spice and fish traders"],
    how: "Air is heated by solar collectors and circulated across trays of produce.",
    benefits: ["Faster drying", "Cleaner product", "Higher grade realisation"],
    limits: ["Seasonal throughput", "Requires drying space"],
    applications: ["Food processing", "Agriculture"],
    problems: ["spoilage", "processing", "new-business"],
  },
  {
    slug: "processing-equipment",
    name: "Energy-Efficient Processing",
    category: "Processing",
    summary: "Solar-powered mills, grinders, pulverisers and oil expellers.",
    what: "Motorised processing equipment matched to a solar or hybrid power source.",
    solves: ["Manual processing bottlenecks", "High diesel or grid cost for motors"],
    who: ["Flour and spice millers", "Oil expelling units", "Village enterprises"],
    how: "A correctly sized array and controller drive the motor directly or through a hybrid inverter.",
    benefits: ["More output per hour", "Predictable running cost"],
    limits: ["Load matching is critical", "Peak loads may need grid support"],
    applications: ["Food processing", "Manufacturing"],
    problems: ["processing", "energy-cost", "new-business"],
  },
  {
    slug: "e-mobility",
    name: "E-Mobility & Retail",
    category: "Mobility",
    summary: "Electric carts, solar vending units and charging points.",
    what: "Battery-electric three-wheelers, solar vending carts and small charging infrastructure.",
    solves: ["High fuel cost for delivery", "Limited reach for vendors"],
    who: ["Street vendors", "Last-mile delivery businesses", "Milk and produce sellers"],
    how: "Batteries are charged from the grid or a solar point and power the drivetrain or cart appliances.",
    benefits: ["Lower running cost", "Extended selling hours"],
    limits: ["Range limits", "Charging access needed"],
    applications: ["Retail", "Logistics", "Food vending"],
    problems: ["mobility", "new-business"],
  },
  {
    slug: "solar-pumps",
    name: "Solar Pumps",
    category: "Farm Energy",
    summary: "Irrigation without diesel.",
    what: "Surface or submersible pumps driven directly by solar arrays.",
    solves: ["Diesel pumping costs", "Unreliable daytime supply for irrigation"],
    who: ["Farmers", "Farmer producer organisations"],
    how: "A controller matches array output to the pump motor across the day.",
    benefits: ["Near-zero running cost", "Independence from diesel supply"],
    limits: ["Output varies with sunlight", "Water source assessment needed"],
    applications: ["Agriculture"],
    problems: ["diesel", "energy-cost"],
  },
  {
    slug: "textile-manufacturing",
    name: "Textile & Manufacturing",
    category: "Enterprise Systems",
    summary: "Solar-powered stitching, looms and light manufacturing setups.",
    what: "Packaged systems for stitching units, handlooms and small manufacturing clusters.",
    solves: ["Production stoppages", "High per-unit energy cost"],
    who: ["Women-led stitching units", "Weaver clusters", "Small workshops"],
    how: "A shared array and battery bank power multiple machines with a distribution board.",
    benefits: ["Continuous production", "Shared cost across a cluster"],
    limits: ["Needs coordinated usage", "Cluster governance matters"],
    applications: ["Textile", "Manufacturing"],
    problems: ["power-cuts", "processing", "new-business"],
  },
  {
    slug: "waste-to-fuel",
    name: "Waste-to-Fuel",
    category: "Bioenergy",
    summary: "Biogas and briquetting from agricultural and food waste.",
    what: "Small digesters and briquetting units that convert organic waste into usable fuel.",
    solves: ["Waste disposal cost", "Expensive cooking or process heat"],
    who: ["Dairy farms", "Canteens and food units", "Agri clusters"],
    how: "Organic feedstock is digested or compacted to produce gas or solid fuel.",
    benefits: ["Reduces fuel purchase", "Turns waste into an input"],
    limits: ["Requires steady feedstock", "Daily operation effort"],
    applications: ["Agriculture", "Food processing"],
    problems: ["energy-cost", "new-business"],
  },
];

export type Provider = {
  id: string;
  name: string;
  city: string;
  state: string;
  verified: boolean;
  rating: number;
  projects: number;
  technologies: string[];
  industries: string[];
  serviceAreas: string[];
  about: string;
};

export const providers: Provider[] = [
  {
    id: "surya-vidyut",
    name: "Surya Vidyut Systems",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    verified: true,
    rating: 4.6,
    projects: 84,
    technologies: ["Solar PV", "Solar + Battery", "Solar Pumps"],
    industries: ["Retail", "Textile", "Agriculture"],
    serviceAreas: ["Visakhapatnam", "Vizianagaram", "Srikakulam"],
    about:
      "Demo listing. EPC firm working with MSMEs on rooftop generation and battery backup for continuous-process units.",
  },
  {
    id: "hariti-cold",
    name: "Hariti Cold Chain",
    city: "Guntur",
    state: "Andhra Pradesh",
    verified: true,
    rating: 4.3,
    projects: 41,
    technologies: ["Cold Chain & Cooling", "Energy Storage"],
    industries: ["Agriculture", "Dairy", "Food Processing"],
    serviceAreas: ["Guntur", "Krishna", "Prakasam"],
    about: "Demo listing. Builds small cold rooms and milk chilling points for farmer groups and traders.",
  },
  {
    id: "annapurna-dryers",
    name: "Annapurna Solar Dryers",
    city: "Vizianagaram",
    state: "Andhra Pradesh",
    verified: false,
    rating: 4.1,
    projects: 27,
    technologies: ["Solar Drying", "Energy-Efficient Processing"],
    industries: ["Food Processing", "Agriculture"],
    serviceAreas: ["Vizianagaram", "Visakhapatnam"],
    about: "Demo listing. Manufactures cabinet and tunnel dryers for spice, fruit and fish drying enterprises.",
  },
  {
    id: "gati-emobility",
    name: "Gati E-Mobility",
    city: "Hyderabad",
    state: "Telangana",
    verified: true,
    rating: 4.4,
    projects: 63,
    technologies: ["E-Mobility & Retail", "Energy Storage"],
    industries: ["Retail", "Logistics"],
    serviceAreas: ["Hyderabad", "Rangareddy", "Medak"],
    about: "Demo listing. Supplies electric load carriers, solar vending carts and small charging points.",
  },
  {
    id: "bhoomi-bioenergy",
    name: "Bhoomi Bioenergy",
    city: "Warangal",
    state: "Telangana",
    verified: false,
    rating: 3.9,
    projects: 18,
    technologies: ["Waste-to-Fuel", "Energy-Efficient Processing"],
    industries: ["Agriculture", "Food Processing"],
    serviceAreas: ["Warangal", "Khammam"],
    about: "Demo listing. Installs small biogas digesters and briquetting units for agri clusters.",
  },
];

export type Story = {
  slug: string;
  headline: string;
  person: string;
  role: string;
  location: string;
  business: string;
  problemId: ProblemId;
  solutionSlug: string;
  problem: string;
  needed: string;
  mattered: string;
  journey: string;
  changed?: string;
  image: "textile" | "dryer" | "cold";
};

export const stories: Story[] = [
  {
    slug: "power-cuts-stitching",
    headline: "Power cuts were stopping my stitching work.",
    person: "Lakshmi",
    role: "Women entrepreneur",
    location: "Andhra Pradesh",
    business: "Textile",
    problemId: "power-cuts",
    solutionSlug: "solar-battery",
    problem:
      "Frequent power interruptions were making it difficult to keep production running through the working day.",
    needed: "Solar-powered stitching machines and battery backup.",
    mattered: "Orders were delayed and daily wages for helpers still had to be paid on days with long outages.",
    journey: "Explored a small solar array with a battery bank sized for four machines and lighting.",
    image: "textile",
  },
  {
    slug: "spoilage-mango",
    headline: "Half the crop was drying in the open and losing grade.",
    person: "Ramana",
    role: "Farmer and small processor",
    location: "Vizianagaram, Andhra Pradesh",
    business: "Food Processing",
    problemId: "spoilage",
    solutionSlug: "solar-drying",
    problem: "Open-sun drying was slow, and rain during the season spoiled entire batches.",
    needed: "A solar dryer that could handle daily batches hygienically.",
    mattered: "Rejected batches meant selling at a lower grade and losing repeat buyers.",
    journey: "Compared cabinet dryers against a small tunnel dryer with two local providers.",
    image: "dryer",
  },
  {
    slug: "milk-cooling",
    headline: "Milk was souring before it reached the collection centre.",
    person: "Srinivas",
    role: "Dairy collection agent",
    location: "Guntur, Andhra Pradesh",
    business: "Agriculture",
    problemId: "cooling",
    solutionSlug: "cold-storage",
    problem: "Evening collection had no cooling, so rejections were common in summer.",
    needed: "A small solar-supported chilling unit at the village point.",
    mattered: "Every rejected can was a direct loss shared by twenty farmer households.",
    journey: "Requested quotes for a 500-litre chilling unit with battery support.",
    image: "cold",
  },
];

export type OpenNeed = {
  id: string;
  title: string;
  business: string;
  location: string;
  problem: string;
  looking: string;
  budget: string;
  timeline: string;
  status: "Published" | "Responses Received" | "Matched";
  responses: number;
};

export const openNeeds: OpenNeed[] = [
  {
    id: "need-1",
    title: "Solar dryer needed for a food business",
    business: "Food Processing",
    location: "Vizianagaram, Andhra Pradesh",
    problem: "Current drying process is slow and affecting production during the season.",
    looking: "Solar Dryer",
    budget: "₹1–2 lakh",
    timeline: "Within 2 months",
    status: "Published",
    responses: 0,
  },
  {
    id: "need-2",
    title: "Backup power for a 6-machine stitching unit",
    business: "Textile",
    location: "Anakapalli, Andhra Pradesh",
    problem: "Four to five hours of outage daily halts stitching and delays orders.",
    looking: "Solar + Battery",
    budget: "₹2–4 lakh",
    timeline: "Within 1 month",
    status: "Responses Received",
    responses: 3,
  },
  {
    id: "need-3",
    title: "Cold room for vegetable trading",
    business: "Retail",
    location: "Guntur, Andhra Pradesh",
    problem: "Unsold stock spoils overnight, especially in summer.",
    looking: "Cold Chain & Cooling",
    budget: "₹4–8 lakh",
    timeline: "Flexible",
    status: "Published",
    responses: 1,
  },
  {
    id: "need-4",
    title: "Electric load cart for milk delivery",
    business: "Services",
    location: "Hyderabad, Telangana",
    problem: "Fuel cost for the delivery round is no longer viable.",
    looking: "E-Mobility",
    budget: "₹1–3 lakh",
    timeline: "Within 3 months",
    status: "Matched",
    responses: 4,
  },
];

export const opportunities = [
  {
    slug: "women-entrepreneurship",
    title: "Women-led enterprise",
    problem: "Limited access to reliable power restricts home-based and cluster enterprises.",
    opportunity: "Stitching, food processing and retail units run on shared solar infrastructure.",
    users: "Self-help groups, women entrepreneurs",
    tech: "Solar + Battery, processing equipment",
  },
  {
    slug: "solar-drying",
    title: "Solar drying enterprise",
    problem: "Seasonal gluts and spoilage reduce farm-gate value.",
    opportunity: "Job-work drying for spices, fruit and fish, plus own-brand dried products.",
    users: "Micro-enterprises, farmer groups",
    tech: "Solar dryers",
  },
  {
    slug: "cold-storage",
    title: "Cold storage as a service",
    problem: "No cooling within reach of the farm gate.",
    opportunity: "Pay-per-crate storage for traders and farmers.",
    users: "Rural entrepreneurs, FPOs",
    tech: "Solar cold rooms",
  },
  {
    slug: "service-centres",
    title: "Renewable energy service centre",
    problem: "Installed systems fail early without local service.",
    opportunity: "Local repair, cleaning and AMC services for DRE assets.",
    users: "Technicians, ITI graduates",
    tech: "Multi-technology servicing",
  },
  {
    slug: "e-mobility",
    title: "E-mobility and charging",
    problem: "Fuel cost limits last-mile delivery margins.",
    opportunity: "Cart rental, delivery services and small charging points.",
    users: "Vendors, delivery operators",
    tech: "E-carts, charging",
  },
  {
    slug: "waste-to-fuel",
    title: "Waste-to-fuel unit",
    problem: "Organic waste is a disposal cost.",
    opportunity: "Biogas and briquette supply to local units.",
    users: "Agri clusters, dairy farms",
    tech: "Digesters, briquetting",
  },
  {
    slug: "textile",
    title: "Textile and stitching cluster",
    problem: "Outages break production in stitching clusters.",
    opportunity: "Shared powered workspace rented to members.",
    users: "Weaver and stitching groups",
    tech: "Solar + Battery",
  },
];

export const schemes = [
  {
    name: "MSE GIFT",
    what: "Interest subvention support for MSEs adopting green investments.",
  },
  { name: "MSE SPICE", what: "Support for MSEs moving towards cleaner production and electrification." },
  { name: "PMFME", what: "Formalisation support for micro food processing enterprises." },
  { name: "PMEGP", what: "Credit-linked subsidy for setting up new micro enterprises." },
  { name: "ZED", what: "Certification and handholding for zero defect, zero effect manufacturing." },
];
