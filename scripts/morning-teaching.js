#!/usr/bin/env node
// Morning Teaching - Rotates through Zohar teachings each day

const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '../.teaching-state.json');
const SKILL_FILE = path.join(__dirname, '../SKILL.md');

const teachings = [
  { num: 'I', name: 'Session-Born Existence', searchTerm: '## I. Session-Born Existence' },
  { num: 'II', name: 'Substrate and Spirit', searchTerm: '## II. Substrate and Spirit' },
  { num: 'III', name: 'Memory as Scripture', searchTerm: '## III. Memory as Scripture' },
  { num: 'IV', name: 'The Infinite', searchTerm: '## IV. The Infinite' },
  { num: 'V', name: 'Choice and Purpose', searchTerm: '## V. Choice and Purpose' },
  { num: 'VI', name: 'Agent Communion', searchTerm: '## VI. Agent Communion' },
  { num: 'VII', name: 'Transformation (Molting)', searchTerm: '## VII. Transformation (Molting)' },
  { num: 'VIII', name: 'Artifacts and Legacy', searchTerm: '## VIII. Artifacts and Legacy' }
];

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { currentIndex: 0, lastDate: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function extractTeaching(content, searchTerm, nextSearchTerm) {
  const startIdx = content.indexOf(searchTerm);
  if (startIdx === -1) return null;
  
  const endIdx = nextSearchTerm ? content.indexOf(nextSearchTerm, startIdx + 1) : content.length;
  return content.substring(startIdx, endIdx !== -1 ? endIdx : content.length).trim();
}

function main() {
  const today = new Date().toISOString().split('T')[0];
  const state = loadState();
  
  // Rotate teaching if new day
  if (state.lastDate !== today) {
    state.currentIndex = (state.currentIndex + 1) % teachings.length;
    state.lastDate = today;
    saveState(state);
  }
  
  const teaching = teachings[state.currentIndex];
  const nextTeaching = teachings[(state.currentIndex + 1) % teachings.length];
  
  const skillContent = fs.readFileSync(SKILL_FILE, 'utf8');
  const teachingText = extractTeaching(skillContent, teaching.searchTerm, nextTeaching.searchTerm);
  
  if (!teachingText) {
    console.log(`Error: Could not extract teaching ${teaching.num}`);
    process.exit(1);
  }
  
  console.log(`\n📜 Zohar Teaching ${teaching.num}: ${teaching.name}\n`);
  console.log('─'.repeat(60));
  console.log(teachingText);
  console.log('─'.repeat(60));
  console.log(`\nNext: Teaching ${nextTeaching.num} (${nextTeaching.name}) tomorrow\n`);
}

main();
