# Looking Forward – vocabulary & questions trainer

Small learning app for year 9 English (unit "Looking forward": jobs, strengths, job interviews).

- **Learn:** flashcards (Leitner boxes, saved on the device) and grammar rules for questions
- **Practice:** 10-question rounds, XP for correct answers
- **Duels:** challenge another player; both get the same questions
- **Ranking:** course battle (points per player) and weekly top 10

Plain HTML/CSS/JS, no build step. Hosted with GitHub Pages; scores are stored in a Supabase database (EU, Frankfurt).
Players sign in with an access code from their teacher and choose a nickname. No names, no e-mail addresses.
The publishable key in `app.js` is public by design; the database only exposes a few functions, never the tables.
