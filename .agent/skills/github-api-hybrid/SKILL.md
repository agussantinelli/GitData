---
name: github-api-hybrid
description: Rules for using both GraphQL and REST APIs simultaneously for GitHub data fetching.
---

# GitHub API Hybrid Querying

## Context
When building widgets for GitData, the GitHub GraphQL API is excellent for deep relational data (like PRs, repositories, and languages). However, it is poorly optimized for fetching chronological event feeds or exact timestamps of recent activity. Therefore, GitData uses a Hybrid approach.

## Guidelines
1. **Primary Fetching (GraphQL):** Always use GraphQL as the primary source of truth for aggregations, total counts, and fetching complex node structures (like `contributionsCollection`).
2. **Supplemental Fetching (REST):** Use the REST API (`GET /users/{username}/events/public`) strictly for time-sensitive, chronological feeds (e.g., Activity Stream or determining the exact hours a user codes).
3. **Error Isolation:** The REST API call must be wrapped in its own `try/catch` block. If it fails, the backend must gracefully degrade and return empty arrays for the activity stream, but MUST still return the GraphQL data successfully.

## Examples
```typescript
// GraphQL Call
const response = await octokit.graphql(query, { login: username });

// Supplemental REST Call
let publicEvents = [];
try {
  const eventsRes = await octokit.request('GET /users/{username}/events/public', { username, per_page: 50 });
  publicEvents = eventsRes.data;
} catch (e) {
  console.warn('Could not fetch REST events', e);
}
```
