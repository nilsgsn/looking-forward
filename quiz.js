// "Are you ready for the real world?" – entry quiz (based on the idea of the quiz in Lighthouse 5, Unit 3,
// pp. 52/53; wording adapted and updated for 2026). Shared by app.js and teacher.js.
// Each answer: a = most independent (2 points), b = 1 point, c = 0 points. Options are shown in random order.
(function () {
  "use strict";

  const DIMS = {
    home: { name: "Home skills", icon: "🍳" },
    money: { name: "Money", icon: "💶" },
    digital: { name: "Digital life", icon: "📱" },
    organise: { name: "Organisation", icon: "🗂️" },
    independence: { name: "Independence", icon: "🚀" }
  };

  const QUESTIONS = [
    { d: "home", icon: "🍝", q: "You have to cook dinner for your family tonight. What do you do?",
      a: "I find a recipe, buy what I need and cook it.", b: "I make pasta with tomato sauce – easy!", c: "I order something with a delivery app." },
    { d: "home", icon: "🛒", q: "You have to do the food shopping for a whole week. How do you do it?",
      a: "I plan the meals, write a list, compare prices and buy only what I need.", b: "I go to the nearest supermarket and take what looks good.", c: "I come home with lots of snacks and energy drinks." },
    { d: "home", icon: "🧺", q: "Which jobs do you do at home?",
      a: "I empty the dishwasher, do my own laundry and sometimes clean the bathroom.", b: "I tidy my room and set the table – but I have no idea how the washing machine works.", c: "None. That's what parents are for!" },
    { d: "money", icon: "💶", q: "Do you earn any money of your own?",
      a: "Yes, I have a regular job (e.g. babysitting, delivering newspapers) and pay for some of my own things.", b: "Sometimes – I help neighbours or sell old things online.", c: "No. When I need money, I ask my family." },
    { d: "money", icon: "📊", q: "How do you manage your money?",
      a: "I keep track of it – with an app or a list – and plan what I spend.", b: "I try not to spend too much, but I don't really plan.", c: "My money is often gone before the end of the month, so I borrow." },
    { d: "money", icon: "🐷", q: "Do you save money?",
      a: "Yes, I put a little aside regularly – for example for a bigger goal.", b: "Sometimes. But then I spend it again!", c: "No. Money is there to be enjoyed – now!" },
    { d: "digital", icon: "📦", q: "You get a text message: 'Your parcel is waiting. Pay a €1.99 customs fee here: bit.ly/…' What do you do?", isNew: true,
      a: "I don't click. It looks like a scam – I delete it and maybe warn my family.", b: "I'm not sure, so I ask someone before I do anything.", c: "I click and pay – it's only €1.99." },
    { d: "digital", icon: "📺", q: "You started a free trial for a streaming service. It ends tomorrow. What happens?", isNew: true,
      a: "I set a reminder when I signed up – so I cancel it in time or keep it on purpose.", b: "I remember it at the last minute. Hopefully!", c: "Free trial? I'll notice when the money is gone." },
    { d: "organise", icon: "📚", q: "Are you a responsible student?",
      a: "I think so. I do my homework on time and don't game or scroll until late on school nights.", b: "Quite responsible – but I sometimes stay up far too late, especially at weekends.", c: "Well … I'm busy with friends and my phone. I do schoolwork when I have time." },
    { d: "organise", icon: "🔋", q: "On the way home your phone battery dies – and your bus ticket is on your phone. What do you do?",
      a: "That doesn't happen to me: I have a power bank – or I buy a paper ticket.", b: "I panic a bit and ask someone if I can call home.", c: "I take the bus anyway and hope nobody checks." },
    { d: "organise", icon: "🩺", q: "You need an appointment with a doctor. What do you do?", isNew: true,
      a: "I call the practice or book the appointment online myself.", b: "I ask my mum or dad to help me.", c: "I wait until my parents do it for me." },
    { d: "independence", icon: "🏠", q: "Are you looking forward to sharing a flat with other people one day?",
      a: "Yes – but we'll need rules: a cleaning plan, shared costs and quiet times.", b: "I've never really thought about it. I think I'd miss home.", c: "Yes! No parents, no rules – party every night!" },
    { d: "independence", icon: "🤔", q: "Are you good at making decisions?",
      a: "Yes. I think things through – and sometimes I ask for advice.", b: "Most of the time. Sometimes it's really hard for me.", c: "I usually do what my friends do – or what I see online." },
    { d: "independence", icon: "💼", q: "You'd like a summer job. What do you do?", isNew: true,
      a: "I look for job ads, write a short CV and apply – or I ask in shops myself.", b: "I ask friends and family if they know about something.", c: "I wait – maybe someone will offer me one." }
  ];

  const TYPES = {
    home: { title: "Home Hero", icon: "🍳", strength: "You already know how to look after yourself at home: cooking, shopping and housework are no problem for you. That is a huge step towards living on your own." },
    money: { title: "Money Manager", icon: "💶", strength: "You handle money in a smart way: you earn, plan and save. Many adults could learn something from you!" },
    digital: { title: "Digital Detective", icon: "🕵️", strength: "You are safe and smart online. Scams and hidden costs don't fool you – a very important skill in 2026." },
    organise: { title: "Organiser", icon: "🗂️", strength: "You are reliable and well organised. You plan ahead and take care of things yourself – employers love that." },
    independence: { title: "Explorer", icon: "🚀", strength: "You are ready to take your own steps: you make decisions, you think about your future and you take the initiative." },
    balanced: { title: "All-Rounder", icon: "⭐", strength: "Your skills are well balanced – you don't have a big weak spot. That makes you flexible for many situations." }
  };

  const LEVELS = [
    { min: 80, key: "ready", adj: "Ready-for-Life", text: "Great! You already have most of the life skills you need to be independent. But life is more than work and money – don't forget to enjoy yourself and have fun with your friends." },
    { min: 60, key: "rising", adj: "Rising", text: "You are quite independent already. A few important life skills are still missing – but you're definitely on the right track. Choose one area and work on it." },
    { min: 40, key: "growing", adj: "Growing", text: "You have made a start, but you still need help in some areas. That's completely normal at your age! Make a plan and learn one new skill at a time." },
    { min: 0, key: "starting", adj: "Future", text: "You know how to enjoy life – but you are not ready for the real world yet. The good news: life skills can be learned. Start with one small step every week." }
  ];

  const GROW = {
    home: { tips: ["Cook a simple meal for your family once a week – find the recipe yourself.", "Ask someone to show you how the washing machine works – then do your own laundry."], week: "This week: plan, shop for and cook one meal on your own." },
    money: { tips: ["Write down everything you spend for two weeks – you'll be surprised.", "Put a fixed amount aside every month, even if it's only €5."], week: "This week: set yourself a savings goal and write down what you spend." },
    digital: { tips: ["Never click on links in unexpected messages – check the sender and ask if you are unsure.", "Set a reminder whenever you start a free trial."], week: "This week: check your phone for subscriptions and in-app purchases." },
    organise: { tips: ["Use a calendar or planner for homework, appointments and deadlines.", "Make your next appointment (doctor, hairdresser …) yourself."], week: "This week: plan your week on Sunday evening and stick to your plan." },
    independence: { tips: ["Make one decision this week without asking your friends first – and explain why.", "Find two job ads for a summer job or work experience and read them carefully."], week: "This week: look for a summer job or work experience place that interests you." }
  };

  const JOBS_FOR = {
    home: ["cook", "nurse"], money: ["office management assistant", "sales assistant"], digital: ["IT technician", "electrician"],
    organise: ["primary school teacher", "office management assistant"], independence: ["animal keeper", "electrician"]
  };

  const ORDER = ["home", "money", "digital", "organise", "independence"];

  // answers: string of 'a'/'b'/'c', one per question
  function evaluate(answers) {
    const pts = { a: 2, b: 1, c: 0 };
    const sum = {}, max = {};
    ORDER.forEach((d) => { sum[d] = 0; max[d] = 0; });
    QUESTIONS.forEach((q, i) => { sum[q.d] += pts[answers[i]] || 0; max[q.d] += 2; });
    const dims = {}; ORDER.forEach((d) => { dims[d] = Math.round((sum[d] / max[d]) * 100); });
    const total = Math.round((Object.values(sum).reduce((a, b) => a + b, 0) / (QUESTIONS.length * 2)) * 100);
    const sorted = ORDER.slice().sort((x, y) => dims[y] - dims[x] || ORDER.indexOf(x) - ORDER.indexOf(y));
    const best = sorted[0], worst = sorted[sorted.length - 1];
    const balanced = dims[best] - dims[worst] <= 20;
    const typeKey = balanced ? "balanced" : best;
    const level = LEVELS.find((l) => total >= l.min);
    const notes = [];
    if (answers[6] === "c") notes.push("⚠️ Careful: messages like the parcel text are a common scam. Never pay or enter data via links in unexpected messages.");
    if (answers[9] === "c") notes.push("⚠️ Riding without a valid ticket can cost a fine (in Germany usually €60). Always have a backup plan.");
    if (answers[12] === "c") notes.push("💬 Your friends' opinions matter – but your future is yours. Try to make one decision this week on your own.");
    const second = balanced ? sorted[1] : sorted[1];
    const jobs = [...new Set([...(JOBS_FOR[best] || []), ...(JOBS_FOR[second] || [])])].slice(0, 3);
    return {
      dims, total, typeKey, levelKey: level.key, best, worst, balanced,
      title: `${level.adj} ${TYPES[typeKey].title}`, icon: TYPES[typeKey].icon,
      levelText: level.text, strength: TYPES[typeKey].strength,
      grow: worst, growTips: GROW[worst].tips, week: GROW[worst].week, notes, jobs
    };
  }

  window.ENTRY_QUIZ = { DIMS, QUESTIONS, TYPES, LEVELS, ORDER, evaluate };
})();
