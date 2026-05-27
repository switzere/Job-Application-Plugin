# Job Application Recorder

A Chrome extension that tracks and visualizes job applications across multiple platforms. Instead of manually copying job details from LinkedIn, Indeed, Glassdoor, and other sites, this extension automatically captures the information and stores it in one place.

---

## Overview

Got tired of manually tracking job applications? This extension does the heavy lifting for you. When you're on a job posting, it extracts the details automatically and stores them in a dashboard where you can see trends, track your progress, and even export your history.

Use it if you:
- Apply to multiple jobs regularly
- Want to track where you've applied
- Need to see your application trends
- Want to share your application history with someone

---

## Features

**Auto-extract from these job boards:**
LinkedIn, Indeed (US & Canada), Workday, Monster, Glassdoor, Lever, Greenhouse, Vector Institute, SmartApply

**What it captures:**
Job title, company, location, job description, URL, and date posted

**Dashboard:**
See charts of your applications, when you applied, and spot trends (which companies, locations, or industries you're targeting)

**Manual entry:**
If a job board isn't supported, just fill in the form manually and add it

**Backup your data:**
Export to CSV or JSON anytime. All data stays on your device—nothing goes to the cloud

---

## Installation

1. Clone or download this repo
2. Go to `chrome://extensions/` in Chrome
3. Turn on **Developer mode** (top right)
4. Click **Load unpacked** and pick the `Job Application Plugin` folder

**Project structure:**
```
Job Application Plugin/
├── manifest.json
├── contentScript.js
├── background.js
├── popup.html/js
├── sidepanel.html/js
├── page.html/js
├── styles.css
├── extractors/       # One file per job board
├── icons/
└── Job Records Backup/
```

---

## How It Works

1. Visit a job posting on any supported site
2. Click apply
3. Job details get pulled in automatically

The popup has three buttons:
- **Form icon**: Manually add a job not on supported sites
- **Graph icon**: View your dashboard
- **Settings icon**: (coming soon)

---

**Frontend:** JavaScript, HTML/CSS, Chart.js for graphs

**Browser:** Chrome Extension Manifest V3, content scripts, service workers

