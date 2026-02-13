import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'subscriptions.json');

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  nextBilling: string;
  autoRenew: boolean;
  url?: string;
  notes?: string;
  cancelled: boolean;
  dateAdded: string;
  dateCancelled?: string;
}

interface SubscriptionData {
  subscriptions: Record<string, Subscription>;
}

const CATEGORIES: Record<string, string> = {
  'entertainment': '🎬',
  'productivity': '🛠️',
  'cloud': '☁️',
  'education': '📚',
  'business': '💼',
  'home': '🏠',
  'health': '❤️',
  'news': '📰',
  'transport': '🚗',
  'food': '🍔',
  'other': '📦'
};

const CYCLE_MULTIPLIERS: Record<string, number> = {
  'weekly': 52,
  'monthly': 12,
  'quarterly': 4,
  'yearly': 1
};

function loadData(): SubscriptionData {
  if (!fs.existsSync(DATA_FILE)) {
    return { subscriptions: {} };
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { subscriptions: {} };
  }
}

function saveData(data: SubscriptionData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculateNextBilling(cycle: string): string {
  const today = new Date();
  let nextDate = new Date(today);
  
  switch (cycle) {
    case 'weekly':
      nextDate.setDate(today.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(today.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(today.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(today.getFullYear() + 1);
      break;
  }
  
  return nextDate.toISOString().split('T')[0];
}

function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

export async function handleAddSubscription(
  name: string,
  amount: number,
  cycle: string,
  category?: string
): Promise<string> {
  const data = loadData();
  const normalizedName = normalizeName(name);
  
  // Check if exists
  const existingId = Object.keys(data.subscriptions).find(
    key => normalizeName(data.subscriptions[key].name) === normalizedName
  );

  if (existingId && !data.subscriptions[existingId].cancelled) {
    return `⚠️ **Subscription already exists!**\n\n` +
           `${data.subscriptions[existingId].name} - ${data.subscriptions[existingId].amount}${data.subscriptions[existingId].currency}/${data.subscriptions[existingId].billingCycle}\n\n` +
           `*Use "Update subscription: [Name]" to modify.*`;
  }

  // Determine category
  const detectedCategory = category || detectCategory(name);
  const categoryEmoji = CATEGORIES[detectedCategory] || CATEGORIES['other'];

  // Calculate next billing
  const billingCycle = (cycle?.toLowerCase() || 'monthly') as 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  const nextBilling = calculateNextBilling(billingCycle);

  const subscription: Subscription = {
    id: generateId(),
    name: name.trim(),
    amount: parseFloat(amount.toString()),
    currency: '€',
    billingCycle,
    category: detectedCategory,
    nextBilling,
    autoRenew: true,
    cancelled: false,
    dateAdded: new Date().toISOString().split('T')[0]
  };

  data.subscriptions[subscription.id] = subscription;
  saveData(data);

  return `✅ **Subscription added!**\n\n` +
         `${categoryEmoji} **${subscription.name}**\n` +
         `💰 ${subscription.amount}${subscription.currency}/${subscription.billingCycle}\n` +
         `📅 Next billing: ${subscription.nextBilling}\n` +
         `📂 Category: ${subscription.category}`;
}

export async function handleListSubscriptions(): Promise<string> {
  const data = loadData();
  const subs = Object.values(data.subscriptions).filter(s => !s.cancelled);
  
  if (subs.length === 0) {
    return `📋 **No subscriptions yet**\n\n` +
           `*Use "Add subscription: [Name] [Amount] [Cycle]" to get started.*`;
  }

  let message = `📋 **Your Subscriptions (${subs.length})**\n\n`;

  // Sort by category
  const byCategory: Record<string, Subscription[]> = {};
  subs.forEach(s => {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(s);
  });

  Object.keys(byCategory).forEach(category => {
    const emoji = CATEGORIES[category] || CATEGORIES['other'];
    message += `${emoji} **${category.charAt(0).toUpperCase() + category.slice(1)}**\n`;
    byCategory[category].forEach(s => {
      message += `   • ${s.name} - ${s.amount}${s.currency}/${s.billingCycle}\n`;
    });
    message += '\n';
  });

  return message;
}

export async function handleSubscriptionCosts(): Promise<string> {
  const data = loadData();
  const subs = Object.values(data.subscriptions).filter(s => !s.cancelled);
  
  if (subs.length === 0) {
    return `💰 **No subscriptions to calculate**\n\n` +
           `*Add some subscriptions first.*`;
  }

  // Calculate totals
  let monthlyTotal = 0;
  let yearlyTotal = 0;
  const byCategory: Record<string, number> = {};

  subs.forEach(s => {
    const multiplier = CYCLE_MULTIPLIERS[s.billingCycle] || 12;
    const monthlyAmount = s.amount / (multiplier / 12);
    monthlyTotal += monthlyAmount;
    yearlyTotal += monthlyAmount * 12;
    
    if (!byCategory[s.category]) byCategory[s.category] = 0;
    byCategory[s.category] += monthlyAmount;
  });

  let message = `💰 **Subscription Costs**\n\n`;
  message += `📅 **Monthly:** €${monthlyTotal.toFixed(2)}\n`;
  message += `📆 **Yearly:** €${yearlyTotal.toFixed(2)}\n\n`;
  
  message += `**By Category (Monthly):**\n`;
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, amount]) => {
      const emoji = CATEGORIES[category] || CATEGORIES['other'];
      const bar = '█'.repeat(Math.ceil(amount / monthlyTotal * 10));
      message += `${emoji} ${category}: €${amount.toFixed(2)} ${bar}\n`;
    });

  return message;
}

export async function handleUpcomingRenewals(days: number = 7): Promise<string> {
  const data = loadData();
  const subs = Object.values(data.subscriptions).filter(s => !s.cancelled);
  
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const upcoming = subs.filter(s => {
    const billingDate = new Date(s.nextBilling);
    return billingDate >= today && billingDate <= futureDate;
  }).sort((a, b) => new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime());

  if (upcoming.length === 0) {
    return `🔔 **No renewals in the next ${days} days**\n\n` +
           `*All clear! No upcoming charges.*`;
  }

  let message = `🔔 **Upcoming Renewals (${days} days)**\n\n`;

  upcoming.forEach(s => {
    const daysUntil = Math.ceil((new Date(s.nextBilling).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    message += `📅 **${s.name}** - ${s.amount}${s.currency}\n`;
    message += `   Due: ${s.nextBilling} (${daysUntil} days)\n\n`;
  });

  const totalDue = upcoming.reduce((sum, s) => sum + s.amount, 0);
  message += `💰 **Total Due:** €${totalDue.toFixed(2)}`;

  return message;
}

export async function handleCancelSubscription(name: string): Promise<string> {
  const data = loadData();
  const normalizedName = normalizeName(name);
  
  const subId = Object.keys(data.subscriptions).find(
    key => normalizeName(data.subscriptions[key].name) === normalizedName
  );

  if (!subId) {
    return `⚠️ **Subscription not found:** ${name}`;
  }

  data.subscriptions[subId].cancelled = true;
  data.subscriptions[subId].dateCancelled = new Date().toISOString().split('T')[0];
  saveData(data);

  return `🗑️ **Subscription cancelled**\n\n` +
         `${data.subscriptions[subId].name} will be removed from active subscriptions.`;
}

export async function handleDeleteSubscription(name: string): Promise<string> {
  const data = loadData();
  const normalizedName = normalizeName(name);
  
  const subId = Object.keys(data.subscriptions).find(
    key => normalizeName(data.subscriptions[key].name) === normalizedName
  );

  if (!subId) {
    return `⚠️ **Subscription not found:** ${name}`;
  }

  const deleted = data.subscriptions[subId];
  delete data.subscriptions[subId];
  saveData(data);

  return `🗑️ **Subscription deleted**\n\n` +
         `${deleted.name} has been permanently removed.`;
}

export async function handleSubscriptionStats(): Promise<string> {
  const data = loadData();
  const subs = Object.values(data.subscriptions);
  const active = subs.filter(s => !s.cancelled);
  const cancelled = subs.filter(s => s.cancelled);

  if (subs.length === 0) {
    return `📊 **No statistics available**\n\n` +
           `*Add some subscriptions first.*`;
  }

  // Calculate totals
  let monthlyTotal = 0;
  active.forEach(s => {
    const multiplier = CYCLE_MULTIPLIERS[s.billingCycle] || 12;
    monthlyTotal += s.amount / (multiplier / 12);
  });

  const avgPerSub = active.length > 0 ? monthlyTotal / active.length : 0;

  let message = `📊 **Subscription Statistics**\n\n`;
  message += `📈 **Total Subscriptions:** ${subs.length}\n`;
  message += `✅ **Active:** ${active.length}\n`;
  message += `❌ **Cancelled:** ${cancelled.length}\n\n`;
  message += `💰 **Monthly Spending:** €${monthlyTotal.toFixed(2)}\n`;
  message += `📊 **Avg per Subscription:** €${avgPerSub.toFixed(2)}\n\n`;

  // Top categories
  const byCategory: Record<string, number> = {};
  active.forEach(s => {
    if (!byCategory[s.category]) byCategory[s.category] = 0;
    byCategory[s.category] += s.amount;
  });

  message += `**Top Categories:**\n`;
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([category, amount], i) => {
      const emoji = CATEGORIES[category] || CATEGORIES['other'];
      message += `${i + 1}. ${emoji} ${category}: €${amount.toFixed(2)}\n`;
    });

  return message;
}

function detectCategory(name: string): string {
  const nameLower = name.toLowerCase();
  
  const patterns: Record<string, string[]> = {
    'entertainment': ['netflix', 'spotify', 'disney', 'hulu', 'hbo', 'youtube', 'prime', 'apple music', 'twitch', 'audible', 'kindle'],
    'productivity': ['notion', 'slack', 'jira', 'trello', 'asana', 'monday', 'clickup', 'linear', 'obsidian', 'notion'],
    'cloud': ['aws', 'azure', 'google cloud', 'dropbox', 'icloud', 'drive', 'cloud', 'firebase', 'supabase'],
    'education': ['coursera', 'udemy', 'masterclass', 'skillshare', 'linkedin learning', 'edx', 'khan', 'duolingo', 'babbel'],
    'business': ['figma', 'adobe', 'github', 'figma', 'canva', 'zoom', 'webex', 'blue', 'miro', 'mural'],
    'home': ['ring', 'nest', 'ecobee', 'smart', 'security', 'camera', 'home'],
    'health': ['fitbit', 'myfitnesspal', 'calm', 'headspace', 'whoop', 'oura', 'strava', 'garmin', 'yoga', 'fitness'],
    'news': ['newspaper', 'magazine', 'times', 'post', 'guardian', 'economist', 'washington', 'nytimes'],
    'transport': ['uber', 'lyft', 'bolt', 'car2go', 'share now', 'deutsche', 'bahn', 'vvs'],
    'food': ['doordash', 'ubereats', 'hellofresh', 'blue apron', 'grubhub', 'delivery', 'glovo', 'lieferando']
  };

  for (const [category, keywords] of Object.entries(patterns)) {
    if (keywords.some(kw => nameLower.includes(kw))) {
      return category;
    }
  }

  return 'other';
}

// Main handler
export async function handler(message: string): Promise<string> {
  const lowerMsg = message.toLowerCase();
  
  // Add subscription
  if (lowerMsg.includes('add subscription') || 
      lowerMsg.includes('new subscription') ||
      lowerMsg.includes('subscribe to')) {
    
    const patterns = [
      /(?:add|new|subscribe to)\s+(?:subscription\s+)?(.+?)\s+(\d+\.?\d*)\s*(€|$|EUR|EUR)?\s*(weekly|monthly|quarterly|yearly)?/i,
      /(?:add|new)\s+(?:subscription\s+)?(.+?)\s+(\d+\.?\d*)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const name = match[1];
        const amount = parseFloat(match[2]);
        const cycleMatch = message.match(/(weekly|monthly|quarterly|yearly)/i);
        const categoryMatch = message.match(/(\w+)(?:\s*$|\s+category)/i);
        
        return handleAddSubscription(
          name,
          amount,
          cycleMatch?.[1],
          categoryMatch?.[1]
        );
      }
    }
    
    return `📝 **Add Subscription**\n\n` +
           `Use: "Add subscription: [Name] [Amount] [Cycle]"\n\n` +
           `Examples:\n` +
           `• "Add subscription: Netflix 15.99€ monthly"\n` +
           `• "Add subscription: Spotify 9.99€ monthly entertainment"\n` +
           `• "Add subscription: AWS 45€ monthly cloud"`;
  }
  
  // List subscriptions
  if (lowerMsg.includes('show my subscriptions') ||
      lowerMsg.includes('list subscriptions') ||
      lowerMsg.includes('all subscriptions') ||
      lowerMsg.includes('my subscriptions')) {
    return handleListSubscriptions();
  }
  
  // Costs
  if (lowerMsg.includes('subscription costs') ||
      lowerMsg.includes('how much') ||
      lowerMsg.includes('spending') ||
      lowerMsg.includes('total cost')) {
    return handleSubscriptionCosts();
  }
  
  // Upcoming renewals
  if (lowerMsg.includes('upcoming') ||
      lowerMsg.includes('renewals') ||
      lowerMsg.includes('renewing') ||
      lowerMsg.includes('next billing')) {
    const daysMatch = message.match(/in\s+(\d+)\s+days?/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 7;
    return handleUpcomingRenewals(days);
  }
  
  // Cancel subscription
  if (lowerMsg.includes('cancel subscription') ||
      lowerMsg.includes('cancel my subscription')) {
    const nameMatch = message.replace(/(?:cancel|cancellation)\s+(?:subscription\s+)?/i, '');
    if (nameMatch.trim()) {
      return handleCancelSubscription(nameMatch.trim());
    }
    return `🗑️ **Cancel Subscription**\n\n` +
           `Use: "Cancel subscription: [Name]"`;
  }
  
  // Delete subscription
  if (lowerMsg.includes('delete subscription') ||
      lowerMsg.includes('remove subscription')) {
    const nameMatch = message.replace(/(?:delete|remove)\s+(?:subscription\s+)?/i, '');
    if (nameMatch.trim()) {
      return handleDeleteSubscription(nameMatch.trim());
    }
    return `🗑️ **Delete Subscription**\n\n` +
           `Use: "Delete subscription: [Name]"`;
  }
  
  // Stats
  if (lowerMsg.includes('subscription stats') ||
      lowerMsg.includes('subscription statistics') ||
      lowerMsg.includes('subscription overview')) {
    return handleSubscriptionStats();
  }
  
  // Help
  return `📊 **Subscription Tracker Commands**\n\n` +
         `• "Add subscription: [Name] [Amount] [Cycle]"\n` +
         `• "Show my subscriptions"\n` +
         `• "Subscription costs"\n` +
         `• "Upcoming renewals"\n` +
         `• "Subscription stats"\n` +
         `• "Cancel subscription: [Name]"\n` +
         `• "Delete subscription: [Name]"`;
}
