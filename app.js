// CooperAI — local Fisch knowledge base + lightweight keyword-matching chat engine.
// This runs entirely in the browser: no server, no API key, no data leaves the page.

const KNOWLEDGE = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "yo", "sup", "greetings"],
    reply: "Hey there! I'm CooperAI, your Fisch assistant. Ask me about rods, bait, enchants, locations, bosses, currency, or how to get started."
  },
  {
    id: "what-is-fisch",
    keywords: ["what is fisch", "about fisch", "fisch game", "explain fisch", "fisch mean"],
    reply: "Fisch is an open-world fishing adventure game on Roblox, created by developer WoozyNate and the Fisching team. It first launched in early access on March 13, 2024, with its full release on October 5, 2024. The core loop is exploring different seas, catching fish of varying rarity, selling or collecting them for your bestiary, completing quests, and gearing up with better rods, bait, and enchantments."
  },
  {
    id: "getting-started",
    keywords: ["start", "begin", "new player", "beginner", "tips", "how to play", "first rod"],
    reply: "Getting started in Fisch: you'll spawn near Moosewood, the starting hub. Talk to the NPC guide (Pierre) for a rundown of the basics, grab your starter rod, and fish along the docks and shallows to earn early money. Sell common fish for cash, reinvest in a better rod and bait as soon as you can afford one, and keep an eye out for quest-giving NPCs — quests are one of the fastest ways to unlock new gear and areas."
  },
  {
    id: "rods",
    keywords: ["rod", "rods", "fishing rod", "best rod", "which rod"],
    reply: "Rods in Fisch follow a long progression from cheap starter rods up to high-end, quest- or event-locked rods with strong stats (Control, Lure Speed, Progress Speed, Resilience). Early on, prioritize whatever rod you can afford that improves your weakest stat; mid and late game, the best rod usually depends on the specific fish or boss you're targeting and which enchant you pair it with. New rods are added with almost every major update, so the 'best' rod list changes over time — check the in-game shop and quest rewards for the current top tier."
  },
  {
    id: "bait",
    keywords: ["bait", "lure", "which bait", "best bait"],
    reply: "Bait affects things like bite chance, luck for rarer fish, and sometimes which species can appear at all. As a rule of thumb: cheap common baits are fine for grinding early money, but stepping up to rarer bait (bought from shops, crafted, or found while exploring) noticeably improves your odds at uncommon, rare, and legendary catches — especially when fishing spots known for good fish."
  },
  {
    id: "enchants",
    keywords: ["enchant", "enchantment", "enchants", "enchanting", "altar"],
    reply: "Enchantments are applied to rods (via altars) and boost specific stats. Some notable ones: Flashline gives a 25% chance at +100% Progress Speed (75% chance at +15%) and pairs well with late/end-game rods. Swift adds +30% Lure Speed and +10% Progress Speed, great on rods with slow lure speed. Wormhole gives an 80% chance to catch a fish from a random location — handy for bestiary hunting. Overclocked adds +5% Progress Speed to any fish and suits high-resilience rods. Sea Prince makes fish 15% bigger (up to 45% bigger on the Kings Rod). Tryhard boosts Progress Speed by 30% but lowers Control slightly and adds a huge max-kg bonus. Steady is one of the most XP-efficient all-round options if your rod can consistently reel in Legendary+ fish."
  },
  {
    id: "locations",
    keywords: ["location", "locations", "map", "island", "sea", "where to fish", "zone", "area"],
    reply: "Fisch's world is split into multiple seas you unlock progressively, each with several islands and fishing zones — starting around Moosewood and expanding outward to islands like Snorkel Island, Forsaken Shores, Ancient Isle, Terrapin Island, and Roslit Bay, then further seas reachable by boat once you're geared up. Different zones favor different fish species, weather effects, and rare spawns, so exploring is a core part of bestiary progress."
  },
  {
    id: "bosses",
    keywords: ["boss", "bosses", "secret", "secrets", "colossal squid", "scylla", "leviathan"],
    reply: "Fisch has boss-tier fish and hidden secrets scattered through its world. The Colossal Squid, for example, is a notoriously tough catch best tackled with a strong end-game rod (Resilient/Control-focused) and matching enchant. Scylla is another high-difficulty target associated with the Leviathan Fang's Rod. Beyond bosses, many areas hide collectible 'secrets' — finding a set of them per zone can unlock access to deeper or hidden areas, so exploring thoroughly pays off."
  },
  {
    id: "currency",
    keywords: ["money", "currency", "cash", "sell", "coins", "shells", "how to make money", "earn"],
    reply: "You earn money mainly by selling the fish you catch — rarer and heavier fish sell for significantly more. That money goes toward better rods, bait, boats, and enchant materials. Completing quests and hunting specific high-value or rare fish are the fastest ways to build up a fishing budget."
  },
  {
    id: "boats",
    keywords: ["boat", "boats", "travel", "sail", "ship"],
    reply: "Boats let you travel between seas and reach open-water fishing spots you can't access on foot. As you progress, you can acquire better boats, which typically travel faster and open up more distant or dangerous fishing grounds."
  },
  {
    id: "trading",
    keywords: ["trade", "trading", "trade fish", "trade rod"],
    reply: "Fisch supports player trading, letting you exchange fish, rods, and other items with other players. It's a common way to complete a bestiary entry for a fish you haven't personally caught, or to get hold of an item from an event you missed."
  },
  {
    id: "updates",
    keywords: ["update", "updates", "new", "patch", "changelog", "latest"],
    reply: "Fisch is updated frequently — recent additions have included new equipment like Harpoon Guns, new areas such as the Chapel, reworks to systems like the Equipment Bag, and fresh enchantments. Because updates roll out often, it's worth checking the official Fisch wiki or in-game changelog for the very latest additions."
  },
  {
    id: "developer",
    keywords: ["developer", "who made", "creator", "woozynate", "fisching", "studio"],
    reply: "Fisch was created by Roblox developer WoozyNate and the Fisching development team. It entered early access on March 13, 2024, and had its full release on October 5, 2024."
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "thx", "appreciate"],
    reply: "Anytime! Tight lines out there — ask me anything else about Fisch whenever you need it."
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see ya", "later"],
    reply: "See you on the water! Come back anytime you need a Fisch refresher."
  }
];

const FALLBACK = "I don't have a solid answer for that one yet. Try asking about rods, bait, enchants, locations, bosses, currency, boats, trading, or how to get started in Fisch.";

const SUGGESTIONS = [
  "What is Fisch?",
  "Best enchants?",
  "How do I make money?",
  "Tell me about bosses",
  "Where should I fish?"
];

function scoreEntry(entry, textLower) {
  let score = 0;
  for (const kw of entry.keywords) {
    if (textLower.includes(kw)) score += kw.split(" ").length; // reward longer/more specific phrase matches
  }
  return score;
}

function getReply(userText) {
  const textLower = userText.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const entry of KNOWLEDGE) {
    const s = scoreEntry(entry, textLower);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }
  return best ? best.reply : FALLBACK;
}

const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSuggestions = document.getElementById("chatSuggestions");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + (sender === "user" ? "msg-user" : "msg-bot");
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "msg msg-bot msg-typing";
  div.id = "typingIndicator";
  div.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function handleUserMessage(text) {
  if (!text.trim()) return;
  addMessage(text, "user");
  chatInput.value = "";
  showTyping();
  const delay = 450 + Math.random() * 500;
  setTimeout(() => {
    hideTyping();
    addMessage(getReply(text), "bot");
  }, delay);
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserMessage(chatInput.value);
});

SUGGESTIONS.forEach((s) => {
  const btn = document.createElement("button");
  btn.className = "chip-btn";
  btn.type = "button";
  btn.textContent = s;
  btn.addEventListener("click", () => handleUserMessage(s));
  chatSuggestions.appendChild(btn);
});

// Opening message
addMessage("Hey! I'm CooperAI 🎣 — ask me anything about Fisch: rods, bait, enchants, locations, bosses, or how to get started.", "bot");
