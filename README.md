# 📊 Subscription Tracker Skill for OpenClaw

Track and manage all your subscriptions in one place. Monitor costs, analyze spending patterns, and never miss a renewal.

## Features

- ✅ Add subscriptions with name, amount, billing cycle, category
- 💰 Track monthly and yearly costs
- 📈 Analyze spending by category
- 🔔 Get renewal reminders
- 📊 Statistics and spending analysis
- 🔍 Auto-detect category from service name

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

## Usage

| Command | Description |
|---------|-------------|
| `Add subscription: Netflix 15.99€ monthly` | Add new subscription |
| `Show my subscriptions` | List all subscriptions |
| `Subscription costs` | View cost summary |
| `Upcoming renewals` | Show upcoming renewals |
| `Subscription stats` | View spending statistics |
| `Cancel subscription: [Name]` | Mark as cancelled |
| `Delete subscription: [Name]` | Remove subscription |

## Example

```
You: "Add subscription: Netflix 15.99€ monthly entertainment"
Bot: ✅ Netflix added!

You: "Subscription costs"
Bot: 💰 Monthly Total: €128.90
    📅 Yearly Total: €1,546.80

You: "Upcoming renewals"
Bot: 🔔 Netflix - Due in 5 days (€15.99)
```

## Categories

- 🎬 Entertainment — Netflix, Spotify
- 🛠️ Productivity — Notion, Slack
- ☁️ Cloud — AWS, Google Cloud
- 📚 Education — Coursera, Udemy
- 💼 Business — Figma, Adobe
- 🏠 Home — Smart home devices
- ❤️ Health — Fitness apps
- 📰 News — Newspapers
- 🚗 Transport — Uber, etc.
- 🍔 Food — Delivery services

## Links

- 📖 [SKILL.md](SKILL.md) — Full documentation
- 🔗 [GitHub](https://github.com/MeghanBao/openclaw-skills)

---

Made with ❤️ by Meghan
