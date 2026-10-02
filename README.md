# Repository Atlas

A personal archive of public GitHub repositories, with Korean summaries and local notes. Built with static HTML, CSS, and JavaScript. No build step, sign-in, or API key is required.

## Features

- Korean and English search; category, language, and license filters; sorting by stars, name, or recent code activity.
- Read-only GitHub Stars sync, batch additions by URL or `owner/repo`, and separate recommendations.
- Local saves, notes, and tags; repository comparison; validated JSON import and export.
- Light and dark themes, an offline snapshot, and existing data retained when refreshes fail.

## Run locally

From the repository root:

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/. Saves and notes stay in this browser's local storage.

Repository sources and license notes are recorded in [data/curation.json](data/curation.json) and [data/snapshot.json](data/snapshot.json). Design references and validation records are in [reviews/verification.md](reviews/verification.md).
