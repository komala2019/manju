import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let KB_ARTICLES = [];

try {
  const kbPath = path.join(__dirname, 'manju-kb.json');
  const kbData = fs.readFileSync(kbPath, 'utf-8');
  const kbArray = JSON.parse(kbData);
  KB_ARTICLES = kbArray.map((article, idx) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    tags: extractTags(article.title + ' ' + article.content),
    updated: 'just now',
  }));
  console.log(`[KB] Loaded ${KB_ARTICLES.length} Manju knowledge base articles`);
} catch (err) {
  console.warn('[KB] Failed to load manju-kb.json, using fallback articles', err.message);
  KB_ARTICLES = [
    {
      id: 'getting-started',
      title: 'Getting Started with Manju',
      content: 'Manju is a members-only job board for IIT and IIM alumni. Sign in with your institute email to browse senior roles (₹40 LPA+) at India\'s top companies.',
      tags: ['getting-started', 'introduction'],
      updated: 'just now',
    },
    {
      id: 'how-to-apply',
      title: 'How to Apply for a Job',
      content: 'To apply for a job: Click on a job listing, Click Apply, Complete 4 steps (profile, cover note, referrals, confirm), Submit application.',
      tags: ['apply', 'application', 'jobs'],
      updated: 'just now',
    },
  ];
}

function extractTags(text) {
  const keywords = ['apply', 'referral', 'profile', 'job', 'tracker', 'interview', 'alumni', 'cover note', 'save', 'application', 'status', 'search', 'filter', 'skills', 'experience', 'company'];
  const lowerText = text.toLowerCase();
  return keywords.filter(k => {
    // Escape special regex chars in keyword, then match as whole words
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(lowerText);
  });
}

export { KB_ARTICLES };
