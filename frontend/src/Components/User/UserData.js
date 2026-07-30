export const C = {
  navy:"#07192E",navyMid:"#0D2B4A",blue:"#1565C0",blueMid:"#1976D2",blueAcc:"#2196F3",
  bluePale:"#E3F2FD",blueSoft:"#BBDEFB",white:"#FFFFFF",offWhite:"#F7FAFF",
  border:"#DDEAFC",gray:"#6B7A99",grayLight:"#EEF2F7",grayDark:"#3D4A63",
  green:"#15803D",greenPale:"#DCFCE7",greenBd:"#BBF7D0",
  amber:"#B45309",amberPale:"#FEF3C7",amberBd:"#FDE68A",
  red:"#DC2626",redPale:"#FEF2F2",redBd:"#FECACA",
  purple:"#7C3AED",purplePale:"#EDE9FE",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const USER = { name:"Alex Johnson", role:"Senior React Developer", avatar:"AJ", email:"alex@email.com", location:"San Francisco, CA", resume:"resume_alex_johnson.pdf", profilePct:78 };

export const APPLICATIONS = [
  { id:1, title:"Senior React Developer",   company:"Google",    logo:"G",  lc:"#4285F4", applied:"May 20, 2025", status:"Interview",  salary:"$130k–$160k", type:"Full Time", loc:"San Francisco" },
  { id:2, title:"Frontend Engineer",        company:"Stripe",    logo:"S",  lc:"#635BFF", applied:"May 18, 2025", status:"Applied",    salary:"$120k–$150k", type:"Hybrid",    loc:"New York" },
  { id:3, title:"UI Engineer",              company:"Figma",     logo:"Fi", lc:"#F24E1E", applied:"May 15, 2025", status:"Rejected",   salary:"$100k–$130k", type:"Remote",    loc:"Remote" },
  { id:4, title:"React Native Developer",   company:"Airbnb",    logo:"Ab", lc:"#FF5A5F", applied:"May 12, 2025", status:"Offered",    salary:"$125k–$155k", type:"Hybrid",    loc:"San Francisco" },
  { id:5, title:"Software Engineer II",     company:"Microsoft", logo:"Ms", lc:"#00A4EF", applied:"May 10, 2025", status:"Applied",    salary:"$115k–$145k", type:"Full Time", loc:"Redmond, WA" },
  { id:6, title:"Product Engineer",         company:"Notion",    logo:"No", lc:"#191919", applied:"May 8, 2025",  status:"Screening",  salary:"$110k–$140k", type:"Remote",    loc:"Remote" },
];

export const SAVED_JOBS = [
  { id:7,  title:"Staff Engineer",          company:"OpenAI",    logo:"AI", lc:"#10a37f", salary:"$180k+",        type:"Full Time", loc:"SF" },
  { id:8,  title:"Frontend Architect",      company:"Netflix",   logo:"N",  lc:"#E50914", salary:"$160k–$200k",   type:"Full Time", loc:"LA" },
  { id:9,  title:"Senior Engineer",         company:"Shopify",   logo:"Sh", lc:"#96BF48", salary:"$130k–$160k",   type:"Remote",    loc:"Remote" },
];

export const RECOMMENDED = [
  { id:10, title:"Senior Frontend Dev",     company:"Meta",      logo:"M",  lc:"#0866FF", salary:"$140k–$175k",   type:"Remote",    match:96 },
  { id:11, title:"React Lead",              company:"Amazon",    logo:"Az", lc:"#FF9900", salary:"$150k–$185k",   type:"Full Time", match:91 },
  { id:12, title:"Principal Engineer",      company:"Apple",     logo:"🍎", lc:"#555",    salary:"$170k–$210k",   type:"Full Time", match:88 },
  { id:13, title:"UI/UX Engineer",          company:"Airbnb",    logo:"Ab", lc:"#FF5A5F", salary:"$120k–$150k",   type:"Hybrid",    match:85 },
];

export const INTERVIEWS = [
  { id:1, company:"Google",  logo:"G",  lc:"#4285F4", role:"Senior React Developer", date:"May 28, 2025", time:"2:00 PM PST", round:"Technical Round 2", type:"Video Call" },
  { id:2, company:"Airbnb",  logo:"Ab", lc:"#FF5A5F", role:"React Native Developer", date:"May 30, 2025", time:"11:00 AM PST", round:"HR Discussion",     type:"Video Call" },
];

export const NAV_ITEMS = [
  { key:"overview",      icon:"⊞",  label:"Overview"        },
  { key:"applications",  icon:"📋", label:"Applications"    },
  // { key:"interviews",    icon:"📅", label:"Interviews"      },
  // { key:"saved",         icon:"🔖", label:"Saved Jobs"      }, 
  // { key:"recommended",   icon:"✨", label:"Recommended"     },
  // { key:"profile",       icon:"👤", label:"My Profile"      },
];

export const STATUS_META = {
  Applied:   { color:C.blue,   bg:C.bluePale,  border:C.blueSoft, icon:"📩" },
  Screening: { color:C.amber,  bg:C.amberPale, border:C.amberBd,  icon:"🔍" },
  Interview: { color:C.purple, bg:C.purplePale,border:"#C4B5FD",  icon:"🎙️" },
  Offered:   { color:C.green,  bg:C.greenPale, border:C.greenBd,  icon:"🎉" },
  Rejected:  { color:C.red,    bg:C.redPale,   border:C.redBd,    icon:"✕"  },
};