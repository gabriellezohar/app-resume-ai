import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();

// app.use(cors());
const allowedOrigins = [
  'http://localhost:3000',                 
  'https://app-resume-ai.vercel.app'       
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/generate', async (req, res) => {
  const { mode, payload } = req.body || {};
  if (!mode || !payload) {
    return res.status(400).json({ error: 'Missing mode or payload' });
  }

  const {
    fullName = '',
    role = '',
    email = '',
    phone = '',
    location = '',
    summary = '',
    experiences = [],
    educations = [],
    skills = [],
    languages = [],
    courses = [],
    jobDescription ='',
    volunteers = []
  } = payload;

  const clean = s => (typeof s === 'string' ? s.trim() : '');
  const part = s => (s && s.trim()) ? s.trim() : "";
  const toArr = a => Array.isArray(a) ? a : [];

  if (mode === 'create') {
  try {
    const SCHEMA = `
    Return ONLY valid JSON with this exact shape:
    {
    "header": { "name": string, "title": string, "email": string, "phone": string, "location": string },
    "summary": string,
    "experience": [ { "role": string, "company": string, "dates": string, "bullets": string[] } ],
    "skills": string[],
    "education": [ { "degree": string, "institution": string, "year": string, "bullets": string[] } ],
    "languages": string[],
    "courses": [ { "name": string, "issuer": string, "year": string } ],
    "volunteers" : [ {"role": string, "organization": string, "dates": string, "bullets": string[] }]
    }
    `;

    const toLines = (arr) => Array.isArray(arr) ? arr : [];
    const expLines = toArr(experiences).map(e => {
      const headParts = ["- " + part(e.role)];
      if (part(e.company)) headParts.push("• " + part(e.company));
      if (part(e.dates))   headParts.push("(" + part(e.dates) + ")");
      const head = headParts.join(" ");
      const details = part(e.details);
      return details ? `${head}\n${details}` : head;
    }).join("\n");

    const eduLines = toArr(educations).map(ed => {
      const headParts = ["- " + part(ed.degree)];
      if (part(ed.institution)) headParts.push("• " + part(ed.institution));
      if (part(ed.year))        headParts.push("(" + part(ed.year) + ")");
      const head = headParts.join(" ");
      const details = part(ed.details);
      return details ? `${head}\n${details}` : head;
    }).join("\n");


    const coursesLines = toLines(courses).map(c =>
      `- ${clean(c.name)}${clean(c.issuer) ? `, ${clean(c.issuer)}` : ''}${clean(c.year) ? ` (${clean(c.year)})` : ''}`
    ).join('\n');

    const skillsLine = toLines(skills).map(clean).filter(Boolean).join(', ');
    const langsLine  = toLines(languages).map(clean).filter(Boolean).join(', ');

    const volLines = toArr(volunteers).map(v => {
      const headParts = ["- " + part(v.role)];
      if (part(v.organization)) headParts.push("• " + part(v.organization));
      if (part(v.dates))        headParts.push("(" + part(v.dates) + ")");
      const head = headParts.join(" ");
      const details = part(v.details);
      return details ? `${head}\n${details}` : head;
    }).join("\n");

    const messages = [
      {
        role: 'system',
        content: [
          'You are a conservative resume formatter.',
          'Return ONLY valid JSON (no prose, no code fences).',
          'NEVER invent numbers, percentages, tools, dates, or employers.',
          'NEVER remove, merge, or reorder items. If something is missing, use "".',
        ].join(' ')
      },
      {
        role: 'user',
        content:
    `Create a clean, ATS-friendly resume JSON from the following inputs.
    STRICT RULES:
        - Use the provided JSON schema exactly. Return ONLY valid JSON.
        - Preserve ALL distinct experience and education items. Do NOT merge, remove, or reorder them.
        - Keep names, companies, dates exactly as given. If missing, use "" (empty string).
        - Write a concise professional summary (3–5 sentences, ≤120 words).
        - For each Experience item: generate 3–5 bullets.
        - Bullet format: Action Verb + Noun + Metric + Outcome.
        Example: "Improved database performance by 30% by optimizing queries, reducing page load times by 1.5s."
        - Each bullet ≤ 18 words. Use strong action verbs (Led, Improved, Developed, Reduced, Designed, etc.).
        - For Education: if details exist, convert them into 2–4 concise bullets (≤15 words each).
        - Skills, Languages, Courses: return as lists of cleaned strings (trim spaces, remove duplicates).
        - Do NOT include objective statement, references, or extra text outside the schema.
        - Use the Job Description only to prioritize/phrase from the INPUTS. Do NOT introduce tools/tech/facts that are not present in INPUTS.
        - If Volunteer Experience is provided, return it under "volunteers" using (role, organization, dates, bullets).
        - Do NOT invent organizations/dates. Do NOT merge, remove, or reorder volunteer items.
        - Use the Job Description only to prioritize/phrase from INPUTS. Do NOT introduce new tools/tech/facts.
        - Do NOT merge, duplicate, or reorder distinct items. If two items have the same role title but different companies/dates, keep them SEPARATE.
        - Do NOT copy bullets from one item to another.
        - For Volunteers: return under "volunteers" with (role, organization, dates, bullets). Do NOT invent organizations/dates.


    INPUTS:
    Full Name: ${clean(fullName)}
    Target Role: ${clean(role)}
    Email: ${clean(email)}
    Phone: ${clean(phone)}
    Location: ${clean(location)}

    Summary (raw):
    ${clean(summary)}

    Experience (raw):
    ${expLines || '(none)'}

    Education (raw):
    ${eduLines || '(none)'}

    Skills (comma list): ${skillsLine || '(none)'}
    Languages (comma list): ${langsLine || '(none)'}
    
    Courses:
    ${coursesLines || '(none)'}
    
    Volunteer Experience (raw):
    ${volLines || '(none)'}

    Job Description (optional):
    ${jobDescription || '(none)'}
    
    ${SCHEMA}`
        }
        ];

    // 4) קריאה למודל
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.45,
      max_tokens: 1200,
      response_format: { type: 'json_object' }
    });

    // 5) פענוח בטוח
    const jsonText = completion.choices?.[0]?.message?.content || '{}';
    try {
      const result = JSON.parse(jsonText);
      return res.json(result); 
    } catch (e) {
      console.warn('AI returned non-JSON for create; using fallback');
      const fallback = {
        header: {
          name: clean(fullName), title: clean(role),
          email: clean(email), phone: clean(phone), location: clean(location)
        },
        summary: clean(summary),
        experience: toLines(experiences).map(e => ({
          role: clean(e.role),
          company: clean(e.company),
          dates: clean(e.dates),
          bullets: clean(e.details) ? clean(e.details).split('\n').map(clean).filter(Boolean) : []
        })),
        skills: toLines(skills).map(clean).filter(Boolean),
        education: toLines(educations).map(ed => ({
          degree: clean(ed.degree),
          institution: clean(ed.institution),
          year: clean(ed.year),
          bullets: clean(ed.details) ? clean(ed.details).split('\n').map(clean).filter(Boolean) : []
        })),
        languages: toLines(languages).map(clean).filter(Boolean),
        courses: toLines(courses).map(c => ({
          name: clean(c.name), issuer: clean(c.issuer), year: clean(c.year)
        })),
        volunteers: toLines(volunteers).map(v => ({
          role: clean(v.role),
          organization: clean(v.organization),
          dates: clean(v.dates),
          bullets: clean(v.details)
            ? clean(v.details).split('\n').map(clean).filter(Boolean)
            : []
        }))
      };
      return res.json(fallback);
    }
  } catch (err) {
    console.error('Create(AI) error:', err);
    return res.status(500).json({ error: 'AI error (create)' });
  }
}
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

