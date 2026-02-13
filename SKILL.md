---
name: subscription-tracker
slug: subscription-tracker
version: 1.0.0
author: Meghan
description: "Track and manage your subscriptions — monitor costs, analyze spending, and never miss a renewal."
homepage: https://github.com/MeghanBao/openclaw-skills
metadata: {"moltbook":{"emoji":"📊","requires":{"bins":["node"],"env":[]}}}
---

# 📊 Subscription Tracker — Monitor Your Subscriptions

Track and manage all your subscriptions in one place. Monitor costs, analyze spending patterns, and never miss a renewal.

## What is it?

**Subscription-Tracker** helps you:
- 📝 Add and organize subscriptions
- 💰 Track monthly and yearly costs
- 📈 Analyze spending by category
- 🔔 Get renewal reminders
- 🗑️ Identify unused subscriptions

## Features

- ✅ **Add Subscriptions** — Name, amount, billing cycle, category
- 📊 **Cost Analysis** — Monthly/yearly totals, category breakdown
- 🔔 **Renewal Reminders** — Upcoming charges notifications
- 📈 **Spending Trends** — Visualize where your money goes
- 🔍 **Duplicate Detection** — Find overlapping services
- 🗑️ **Cancel Tracking** — Track cancelled subscriptions

## Quick Start

```bash
# Clone the project
git clone https://github.com/MeghanBao/subscription-tracker-openclaw-skill.git
cd subscription-tracker-openclaw-skill

# Install dependencies
npm install

# Build
npm run build
```

## Commands

| Command | Description |
|---------|-------------|
| `Add subscription: [Name] [Amount] [Cycle]` | Add new subscription |
| `Show my subscriptions` | List all subscriptions |
| `Subscription costs` | View cost summary |
| `Upcoming renewals` | Show upcoming renewals |
| `Cancel subscription: [Name]` | Mark as cancelled |
| `Subscription stats` | View spending statistics |
| `Delete subscription: [Name]` | Remove subscription |

## Billing Cycles

| Cycle | Description |
|--------|-------------|
| `monthly` | Billed every month |
| `yearly` | Billed once per year |
| `quarterly` | Billed every 3 months |
| `weekly` | Billed every week |

## Categories

- 🎬 **entertainment** — Netflix, Spotify, Disney+
- 🛠️ **productivity** — Notion, Slack, Jira
- ☁️ **cloud** — AWS, Google Cloud, Dropbox
- 📚 **education** — Coursera, MasterClass
- 💼 **business** — Figma, Adobe, GitHub
- 🏠 **home** — Smart home, security
- ❤️ **health** — Fitness, meditation
- 📰 **news** — Newspapers, magazines
- 🚗 **transport** — Uber, car sharing
- 🍔 **food** — Delivery, meal kits

## Example Usage

```
You: "Add subscription: Netflix 15.99€ monthly entertainment"
Bot: ✅ Netflix added!

You: "Show my subscriptions"
Bot: 📋 Your Subscriptions (5)

    🎬 Netflix - €15.99/month
    🛠️ Notion - €8/month
    ☁️ AWS - €45.92/month
    🎧 Spotify - €9.99/month
    📚 Coursera - €49/month

You: "Subscription costs"
Bot: 💰 Monthly Total: €128.90
    📅 Yearly Total: €1,546.80

    🎬 Entertainment: €25.98
    🛠️ Productivity: €8
    ☁️ Cloud: €45.92
    📚 Education: €49
```

## Tech Stack

- **TypeScript** — Type-safe implementation
- **Node.js** — Runtime environment
- **File System** — Local JSON storage
- **Moltbook** — Skill distribution platform

## Design Philosophy

- **Privacy First** — All data stored locally
- **Simple & Focused** — One tool for subscriptions
- **Actionable Insights** — Help you save money
- **No External APIs** — Self-contained skill

## Links

- 🔗 GitHub: https://github.com/MeghanBao/openclaw-skills
- 📖 Documentation: See SKILL.md

---

Made with ❤️ by Meghan
