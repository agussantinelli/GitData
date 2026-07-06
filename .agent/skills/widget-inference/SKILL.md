---
name: widget-inference
description: Guidelines for mathematically deducing advanced widget data on the backend.
---

# Widget Inference Engine

## Context
GitData's premium UI (like Tech Radar, Achievements, and Dev Clock) requires data that GitHub does not natively provide. Instead of adding complex databases, GitData infers these states algorithmically in the backend (`OctokitGithubRepository.ts`) using the raw metrics available.

## Guidelines
1. **Tech Radar Categorization:** Languages must be statically mapped into three core pillars: `Frontend`, `Backend`, and `DevOps/Data`. The percentage is calculated by summing the total bytes of languages matching these buckets.
2. **Achievements Deduction:** Trophies are awarded based on absolute thresholds of existing data (e.g., `prs >= 5` -> Pull Shark, `followers >= 10` -> Influencer).
3. **Time Analysis:** Time-based widgets (Dev Clock, Hourly Frequency) rely exclusively on the `created_at` timestamp extracted from the last 50 REST API `publicEvents`. 
4. **Backend Processing:** All inference MUST happen in the Backend. The Frontend should only receive the finalized, computed structures (e.g., arrays of objects) and should NOT perform heavy mapping or categorization logic.

## Examples
```typescript
// Inferring an achievement
const achievements = [];
if (prs >= 5) achievements.push({ id: 'pull-shark', title: 'Pull Shark', description: '...', icon: '🦈' });

// Inferring Tech Radar
let frontend = 0;
const feLangs = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React'];
Object.keys(languageMap).forEach(lang => {
  if (feLangs.includes(lang)) frontend += languageMap[lang];
});
```
