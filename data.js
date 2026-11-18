// Word lists and grammar items for Lighthouse 5, Unit 3 "Looking forward".
// Each vocab entry: [German, English, ...accepted alternatives]
window.LISTS = {
  vocab1: {
    title: "Test 1 · 25 Nov",
    sub: "Lead-in words and weaknesses",
    words: [
      ["höhere Schule, Fachhochschule", "college"],
      ["Zutat", "ingredient"],
      ["Soße", "sauce"],
      ["Essen zum Mitnehmen", "takeaway", "take-away"],
      ["etwas kaufen, mitbringen (aus einem Geschäft)", "pick sth. up", "pick something up", "pick up", "pick sth up"],
      ["Staubsauger", "vacuum cleaner"],
      ["Waschmaschine", "washing machine"],
      ["bügeln", "iron", "to iron"],
      ["verdienen (Geld)", "earn", "to earn", "earn money"],
      ["verwalten, regeln", "manage", "to manage"],
      ["haushalten (sparsam sein)", "budget", "to budget"],
      ["zu viel Geld ausgeben", "overspend", "to overspend"],
      ["Mir geht oft das Geld aus.", "I often run out of money."],
      ["es kaum erwarten können, etwas zu tun", "can't wait to do sth.", "can't wait to", "cannot wait to", "can't wait to do something"],
      ["Fähigkeit", "skill"],
      ["aggressiv", "aggressive"],
      ["unehrlich", "dishonest"],
      ["unstrukturiert", "disorganized", "disorganised"],
      ["unhöflich", "impolite"],
      ["ungeduldig", "impatient"],
      ["unsicher", "insecure"],
      ["faul", "lazy"],
      ["unordentlich", "messy"],
      ["egoistisch", "selfish"],
      ["schüchtern", "shy"],
      ["(sehr) langsam", "slow", "very slow"],
      ["stur", "stubborn"],
      ["undiszipliniert", "undisciplined"],
      ["unfreundlich", "unfriendly"]
    ]
  },
  vocab2: {
    title: "Test 2 · 2 Dec",
    sub: "Strengths",
    words: [
      ["Stärke", "strength"],
      ["Schwäche", "weakness"],
      ["Praktikum", "work experience"],
      ["selbstsicher, zuversichtlich", "confident"],
      ["energisch, energiereich", "energetic"],
      ["begeistert", "enthusiastic"],
      ["pünktlich", "punctual"],
      ["zuverlässig", "reliable"],
      ["Kritik (an etwas/jemandem)", "criticism"],
      ["studieren; lernen", "study", "to study"],
      ["Universität", "university"],
      ["Lösung (eines Problems)", "solution", "solution to a problem"],
      ["Identität", "identity"],
      ["warmherzig, liebevoll", "caring"],
      ["engagiert", "committed"],
      ["kreativ", "creative"],
      ["diszipliniert", "disciplined"],
      ["gelassen", "easy-going", "easygoing"],
      ["flexibel", "flexible"],
      ["freundlich", "friendly"],
      ["fleißig, tüchtig", "hard-working", "hardworking"],
      ["hilfsbereit", "helpful"],
      ["ehrlich", "honest"],
      ["unabhängig", "independent"],
      ["motiviert", "motivated"],
      ["organisiert, strukturiert", "organized", "organised"],
      ["geduldig", "patient"],
      ["geschickt, praktisch", "practical"],
      ["höflich", "polite"],
      ["ruhig", "quiet"],
      ["verantwortungsbewusst", "responsible"],
      ["sportlich", "sporty"],
      ["ordentlich", "tidy"]
    ]
  },
  vocab3: {
    title: "Test 3 · 9 Dec",
    sub: "Jobs and job descriptions",
    words: [
      ["(sich) qualifizieren", "qualify", "to qualify"],
      ["qualifiziert, ausgebildet", "qualified"],
      ["Arbeitszeit(en)", "working hours", "hours"],
      ["sich bewerben (um)", "apply (for)", "apply for", "apply", "to apply for"],
      ["bis (zu) (bei Mengen)", "up to"],
      ["Lebenslauf", "CV", "curriculum vitae"],
      ["Kommunikation", "communication"],
      ["Bezahlung, Lohn", "pay"],
      ["Auszubildende(r)", "trainee"],
      ["(Schul-)Abschluss, Qualifikation", "qualification"],
      ["Helfer/in, Assistent/in", "assistant"],
      ["Versorgung, Betreuung", "care"],
      ["Schicht (bei der Arbeit)", "shift"],
      ["jederzeit, ständig", "at all times"],
      ["Pflicht, Aufgabe", "duty"],
      ["im Freien, draußen", "outdoors"],
      ["Eigenschaft, Qualität", "quality"],
      ["abenteuerlustig", "adventurous"],
      ["Gehalt", "salary"],
      ["Karriere, Laufbahn", "career"],
      ["Zukunftsaussichten", "prospects", "future prospects"],
      ["Beförderung", "promotion"],
      ["Ausbildung (Lehre)", "apprenticeship"],
      ["Tagesablauf", "daily routine"],
      ["verantwortlich sein für", "be responsible for", "to be responsible for"],
      ["gut bezahlt", "well-paid", "well paid"],
      ["gefragt (Beruf)", "in demand"],
      ["Krankenpfleger/-schwester", "nurse"],
      ["Elektriker/in", "electrician"],
      ["Grundschullehrer/in", "primary school teacher"],
      ["Verkäufer/in", "sales assistant"],
      ["Koch/Köchin", "cook"],
      ["IT-Techniker/in", "IT technician"],
      ["Tierpfleger/in", "animal keeper"],
      ["Bürokaufmann/-frau", "office management assistant"]
    ]
  },
  interview: {
    title: "Job interview",
    sub: "Useful words (no test)",
    words: [
      ["Vorstellungsgespräch", "job interview"],
      ["Bewerber/in, Kandidat/in", "candidate"],
      ["Schlüsselqualifikationen", "key skills"],
      ["(Schul-)Bildung", "education"],
      ["Leistung, Errungenschaft", "achievement"],
      ["an etwas sehr interessiert sein", "be keen on sth.", "be keen on", "be keen on something"],
      ["Referenz, Empfehlung", "reference"],
      ["geeignet, passend", "suitable"],
      ["relevant, wichtig", "relevant"],
      ["Persönlichkeit", "personality"],
      ["Erscheinung(sbild), Aussehen", "appearance"],
      ["begrüßen", "greet", "to greet"],
      ["froh, erfreut", "pleased"],
      ["notwendig, nötig", "necessary"],
      ["Kontakt aufnehmen zu", "contact", "to contact"],
      ["Freut mich, Sie kennenzulernen.", "Pleased to meet you.", "Nice to meet you."]
    ]
  }
};

// Grammar: questions. Own example sentences (job theme).
// qw = question word, aux = helping verb, order = put the words in order
window.GRAMMAR = [
  { t: "qw", q: "___ do you want to become? – A nurse.", o: ["What", "Who", "Where", "Why"], a: "What" },
  { t: "qw", q: "___ did you do your work experience? – At a garage.", o: ["When", "Where", "Who", "How"], a: "Where" },
  { t: "qw", q: "___ do you want this job? – Because I love working with children.", o: ["Why", "What", "How", "Which"], a: "Why" },
  { t: "qw", q: "___ does the shift start? – At 6 a.m.", o: ["When", "Where", "Who", "Whose"], a: "When" },
  { t: "qw", q: "___ hours do you work a week? – 40.", o: ["How many", "How much", "How long", "What"], a: "How many" },
  { t: "qw", q: "___ do trainees earn? – About 900 euros a month.", o: ["How much", "How many", "How often", "Who"], a: "How much" },
  { t: "qw", q: "___ is your boss? – Ms Brown.", o: ["Who", "What", "Which", "Whose"], a: "Who" },
  { t: "qw", q: "___ did your work experience last? – Three weeks.", o: ["How long", "How many", "When", "How often"], a: "How long" },
  { t: "qw", q: "___ do you check your emails? – Every morning.", o: ["How often", "How long", "Where", "Which"], a: "How often" },
  { t: "qw", q: "___ job do you like better – cook or baker?", o: ["Which", "Who", "Whose", "Why"], a: "Which" },
  { t: "qw", q: "___ CV is this? – It's Tom's.", o: ["Whose", "Who", "Which", "What"], a: "Whose" },
  { t: "qw", q: "___ can you describe yourself? – I'm reliable and friendly.", o: ["How", "What", "Who", "Where"], a: "How" },

  { t: "aux", q: "___ you like working in a team?", o: ["Do", "Does", "Are", "Is"], a: "Do" },
  { t: "aux", q: "___ your sister work at the weekend?", o: ["Does", "Do", "Is", "Are"], a: "Does" },
  { t: "aux", q: "___ you do work experience last year?", o: ["Did", "Do", "Were", "Does"], a: "Did" },
  { t: "aux", q: "Where ___ he work now?", o: ["does", "do", "did", "is"], a: "does" },
  { t: "aux", q: "What ___ you learn at your last job?", o: ["did", "were", "does", "was"], a: "did" },
  { t: "aux", q: "___ you good at solving problems?", o: ["Are", "Do", "Is", "Does"], a: "Are" },
  { t: "aux", q: "___ she punctual?", o: ["Is", "Does", "Are", "Do"], a: "Is" },
  { t: "aux", q: "Why ___ you late for the interview yesterday?", o: ["were", "did", "was", "are"], a: "were" },
  { t: "aux", q: "___ you speak any other languages?", o: ["Can", "Are", "Does", "Is"], a: "Can" },
  { t: "aux", q: "How long ___ you been at this school?", o: ["have", "has", "did", "are"], a: "have" },
  { t: "aux", q: "Who ___ the boss of this company? (Subject question)", o: ["is", "does", "do", "did"], a: "is" },
  { t: "aux", q: "When ___ the shop open on Saturdays?", o: ["does", "do", "is", "are"], a: "does" },

  { t: "order", w: ["do", "you", "Why", "want", "this job"], a: "Why do you want this job?" },
  { t: "order", w: ["did", "Where", "you", "do", "your work experience"], a: "Where did you do your work experience?" },
  { t: "order", w: ["are", "What", "your strengths"], a: "What are your strengths?" },
  { t: "order", w: ["you", "Can", "describe", "yourself"], a: "Can you describe yourself?" },
  { t: "order", w: ["does", "earn", "a nurse", "How much"], a: "How much does a nurse earn?" },
  { t: "order", w: ["you", "Do", "any questions", "have"], a: "Do you have any questions?" },
  { t: "order", w: ["start", "When", "you", "can"], a: "When can you start?" },
  { t: "order", w: ["work", "Do", "at the weekend", "you", "have to"], a: "Do you have to work at the weekend?" },
  { t: "order", w: ["did", "learn", "What", "at school", "you"], a: "What did you learn at school?" },
  { t: "order", w: ["is", "your", "What", "weakness", "biggest"], a: "What is your biggest weakness?" },
  { t: "order", w: ["hours", "How many", "work", "does", "an electrician"], a: "How many hours does an electrician work?" },
  { t: "order", w: ["you", "Have", "worked", "in a team", "ever"], a: "Have you ever worked in a team?" }
];

window.GRAMMAR_RULES = [
  { h: "Question words", b: "who (wer) · what (was) · where (wo/wohin) · when (wann) · why (warum) · how (wie) · which (welche/r) · whose (wessen) · how much (wie viel, uncountable) · how many (wie viele, countable) · how long (wie lange) · how often (wie oft)" },
  { h: "do / does / did", b: "Simple present: <b>Do</b> you …? / <b>Does</b> he/she/it …? · Simple past: <b>Did</b> you …? · After do/does/did the main verb is in the <b>infinitive</b>: Does she <b>work</b>? (not: works) · Did you <b>go</b>? (not: went)" },
  { h: "Word order", b: "<b>Question word – helping verb – subject – main verb – rest</b><br>Where – did – you – do – your work experience?" },
  { h: "Questions with be, can, have", b: "No do/does/did with <b>be</b>, <b>can</b> or <b>have (got/been)</b>: <b>Are</b> you reliable? <b>Can</b> you start on Monday? <b>Have</b> you ever worked in a team?" },
  { h: "Subject questions", b: "If you ask for the subject (who/what), there is no do/does/did: <b>Who works</b> here? <b>What happened</b>?" }
];

window.LEVELS = [
  [0, "Trainee"], [50, "Assistant"], [150, "Specialist"], [300, "Team Leader"],
  [500, "Manager"], [800, "Director"], [1200, "CEO"]
];

// Job profiles (written for this unit; figures: Germany, approx., gross per month)
window.JOBS = [
 {
  "en": "nurse",
  "de": "Pflegefachfrau / Pflegefachmann",
  "icon": "🩺",
  "day": "You start your shift with a handover from the night team. Then you look after patients: you check their blood pressure, give them medicine, help them wash and eat, and write everything down.",
  "duties": [
   "look after sick and old people",
   "give medicine and injections",
   "help doctors",
   "talk to patients and their families"
  ],
  "hours": "about 38–40 hours a week in shifts: early, late and night shifts, also at weekends and on holidays",
  "pay": "training: about €1,300–1,500 a month · after training: about €3,000–3,500 a month",
  "training": "3-year apprenticeship (Ausbildung) at a nursing school and in a hospital",
  "prospects": "very good – nurses are in great demand. You can specialise (e.g. intensive care), become a ward manager or study nursing.",
  "qualities": [
   "caring",
   "patient",
   "reliable",
   "able to deal with stress",
   "good at working in a team"
  ]
 },
 {
  "en": "electrician",
  "de": "Elektroniker/in",
  "icon": "💡",
  "day": "You drive to a building site or to a customer's house. You put in cables, sockets and lights, test them and repair things that are broken. Sometimes you install solar panels or charging stations for electric cars.",
  "duties": [
   "put in cables, sockets and lights",
   "find and repair faults",
   "check that everything is safe",
   "install solar panels and charging stations"
  ],
  "hours": "about 38–40 hours a week, usually Monday to Friday, sometimes on call (Bereitschaft) at night or at weekends",
  "pay": "training: about €900–1,150 a month · after training: about €2,700–3,300 a month",
  "training": "3.5-year apprenticeship; good maths and physics help",
  "prospects": "very good – electricians are in demand (solar energy, e-mobility). You can become a master craftsman (Meister) and start your own business.",
  "qualities": [
   "practical",
   "careful",
   "good with your hands",
   "reliable",
   "interested in technology"
  ]
 },
 {
  "en": "primary school teacher",
  "de": "Grundschullehrer/in",
  "icon": "🍎",
  "day": "You arrive at school before 8 o'clock and teach children from 6 to 10 years old: reading, writing, maths and more. In the afternoon you prepare lessons, mark tests and talk to parents.",
  "duties": [
   "teach children",
   "prepare lessons and materials",
   "mark tests and write reports",
   "talk to parents and colleagues"
  ],
  "hours": "about 28 lessons a week plus preparation, marking and meetings – often more than 40 hours; long school holidays",
  "pay": "during training (Referendariat): about €1,600 a month · after training: about €4,500–5,000 a month",
  "training": "university degree (about 5 years) and 18 months of teacher training at a school",
  "prospects": "very good – primary schools need many new teachers. You can become a head teacher later.",
  "qualities": [
   "patient",
   "creative",
   "organised",
   "good at communicating",
   "fair and friendly"
  ]
 },
 {
  "en": "sales assistant",
  "de": "Verkäufer/in",
  "icon": "🛍️",
  "day": "You open the shop, fill the shelves and help customers. You answer questions, take payments at the cash desk and keep the shop tidy. Sometimes you order new products.",
  "duties": [
   "help and advise customers",
   "work at the cash desk",
   "fill the shelves and decorate the shop",
   "order and check new products"
  ],
  "hours": "about 37–40 hours a week in shifts, often on Saturdays; part-time jobs are possible",
  "pay": "training: about €1,000–1,250 a month · after training: about €2,300–2,800 a month",
  "training": "2-year apprenticeship (Verkäufer/in) or 3 years (Kaufmann/-frau im Einzelhandel)",
  "prospects": "good – you can become a department manager or store manager, or study retail management.",
  "qualities": [
   "friendly",
   "polite",
   "good at communicating",
   "flexible",
   "good at maths"
  ]
 },
 {
  "en": "cook",
  "de": "Koch / Köchin",
  "icon": "👩‍🍳",
  "day": "You get the kitchen ready, prepare vegetables, meat and sauces and cook the meals when the guests order. It is hot and busy. At the end of the shift you clean the kitchen.",
  "duties": [
   "prepare and cook meals",
   "plan menus and order ingredients",
   "keep the kitchen clean and safe",
   "work in a team under time pressure"
  ],
  "hours": "about 40 hours a week, often in the evening, at weekends and on holidays; sometimes split shifts",
  "pay": "training: about €1,000–1,200 a month · after training: about €2,300–2,900 a month",
  "training": "3-year apprenticeship in a restaurant or hotel",
  "prospects": "good – cooks are in demand everywhere, also abroad. You can become a head chef or open your own restaurant.",
  "qualities": [
   "creative",
   "hard-working",
   "able to deal with stress",
   "good at working in a team",
   "clean and tidy"
  ]
 },
 {
  "en": "IT technician",
  "de": "Fachinformatiker/in",
  "icon": "💻",
  "day": "You check e-mails from colleagues who have problems with their computers. You repair laptops, set up new software and networks and make sure the company's data is safe.",
  "duties": [
   "set up computers, software and networks",
   "solve IT problems",
   "protect data from viruses and hackers",
   "help and train colleagues"
  ],
  "hours": "about 38–40 hours a week, often flexible working hours and some home office",
  "pay": "training: about €1,000–1,250 a month · after training: about €3,000–3,600 a month",
  "training": "3-year apprenticeship; good maths and English help",
  "prospects": "very good – IT experts are in great demand. You can specialise (e.g. IT security) or study computer science.",
  "qualities": [
   "good at solving problems",
   "patient",
   "logical",
   "interested in technology",
   "good at communicating"
  ]
 },
 {
  "en": "animal keeper",
  "de": "Tierpfleger/in",
  "icon": "🐾",
  "day": "You start early. You feed the animals, clean their cages or enclosures and check that they are healthy. You also help the vet and sometimes answer visitors' questions in the zoo.",
  "duties": [
   "feed and look after animals",
   "clean cages and enclosures",
   "watch the animals and help the vet",
   "talk to visitors"
  ],
  "hours": "about 38–40 hours a week, early starts, also at weekends and on holidays – animals need care every day",
  "pay": "training: about €1,000–1,200 a month · after training: about €2,300–2,800 a month",
  "training": "3-year apprenticeship in a zoo, an animal shelter or a vet clinic",
  "prospects": "okay – there are not many jobs and many people want them. You can specialise or become a master (Meister).",
  "qualities": [
   "caring",
   "responsible",
   "sporty",
   "not afraid of dirty work",
   "reliable"
  ]
 },
 {
  "en": "office management assistant",
  "de": "Kaufmann / Kauffrau für Büromanagement",
  "icon": "📁",
  "day": "You answer the phone, write e-mails and letters and organise meetings. You also work with numbers: you write invoices, check payments and keep files in order.",
  "duties": [
   "answer the phone and write e-mails",
   "organise meetings and appointments",
   "write invoices and check payments",
   "work with standard software"
  ],
  "hours": "about 38–40 hours a week, usually Monday to Friday, regular office hours; part-time is possible",
  "pay": "training: about €1,000–1,250 a month · after training: about €2,600–3,100 a month",
  "training": "3-year apprenticeship in a company or public office",
  "prospects": "good – every company needs office staff. You can become an office manager or team assistant.",
  "qualities": [
   "organised",
   "reliable",
   "good at communicating",
   "good with computers",
   "polite"
  ]
 }
];

// Interview simulator (exam part II): general questions + job-specific questions
window.INTERVIEW = {
  start: ["Hello, nice to meet you. Please take a seat. Could you introduce yourself, please?"],
  general: [
    "Why do you want to work as a JOB?",
    "What are your strengths?",
    "What are your weaknesses?",
    "Have you got any work experience?",
    "What do you do in your free time?",
    "Which school subjects are you good at – and how could they help you in this job?",
    "Why should we choose you and not another candidate?",
    "How do you deal with stress?",
    "Do you prefer working in a team or on your own? Why?",
    "Where do you see yourself in five years?"
  ],
  special: {
    "nurse": ["This job involves night shifts and weekend work. Is that a problem for you?", "How would you react if a patient was rude to you?"],
    "electrician": ["How good are you at maths and physics?", "Are you afraid of heights?"],
    "primary school teacher": ["Why do you want to work with children?", "How would you help a child who is sad?"],
    "sales assistant": ["What would you do if a customer complained?", "Are you happy to work on Saturdays?"],
    "cook": ["What's your favourite dish to cook?", "Can you work well under time pressure?"],
    "IT technician": ["Which computer skills have you got?", "How would you explain a computer problem to someone who isn't good with technology?"],
    "animal keeper": ["Have you got any experience with animals?", "Animals need care every day – also at weekends and on holidays. Is that okay for you?"],
    "office management assistant": ["Which computer programs can you use?", "How do you organise your work when you have a lot to do?"]
  },
  end: ["Thank you. Have you got any questions for us?", "Thank you for coming. We'll contact you next week. Goodbye!"],
  help: {
    "Introducing yourself": ["My name is … and I'm … years old.", "I'm in Year 9 at … school.", "I'm interested in …"],
    "Why this job": ["I've always wanted to work in this field because …", "I think this is a job I could do well, because …", "I'd like to develop my … skills."],
    "Strengths and weaknesses": ["One of my strengths is that I'm …", "For example, …", "Sometimes I'm a bit … but I'm working on it: …"],
    "Experience": ["I did work experience at …", "I have already helped out at …", "I can use standard software."],
    "Asking questions": ["What are the working hours?", "Is there a chance to do training?", "When would I start?"]
  }
};
