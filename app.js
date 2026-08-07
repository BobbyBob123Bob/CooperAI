// CooperAI — local Fisch knowledge base + lightweight keyword-matching chat engine.
// Runs entirely in the browser: no server, no API key, no data leaves the page.
// FISH_DB (300 entries) is loaded separately from fish-data.js.

const RARITY_ORDER = ["Trash","Common","Uncommon","Unusual","Rare","Legendary","Mythical","Exotic","Secret","Relic","Fragment","Gemstone","Apex","Divine Secret"];

const KNOWLEDGE = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "yo", "sup", "greetings"],
    reply: "Hey there! I'm CooperAI, your Fisch assistant. Ask me about rods, bait, enchants, mutations, rarities, locations, bosses, currency, or type any fish name — I know 300 of them."
  },
  {
    id: "what-is-fisch",
    keywords: ["what is fisch", "about fisch", "fisch game", "explain fisch", "fisch mean"],
    reply: "Fisch is an open-world fishing adventure game on Roblox, created by developer WoozyNate and the Fisching team. It entered early access on March 13, 2024, with its full release on October 5, 2024. The core loop: explore different seas, catch fish of varying rarity and mutation, sell them or log them in your Bestiary, complete quests, and gear up with better rods, bait, and enchantments."
  },
  {
    id: "getting-started",
    keywords: ["start", "begin", "new player", "beginner", "tips", "how to play", "first rod"],
    reply: "Getting started in Fisch: you'll spawn near Moosewood, the starting hub. Talk to the NPC guide (Pierre) for a rundown of the basics, grab your starter rod, and fish along the docks and shallows to earn early money (C$). Sell common fish for cash, reinvest in a better rod and bait as soon as you can afford one, visit an Inn Keeper in any major location to set your spawn point, and keep an eye out for quest-giving NPCs — quests are one of the fastest ways to unlock new gear and areas."
  },
  {
    id: "currency",
    keywords: ["money", "currency", "cash", "sell", "coins", "shells", "how to make money", "earn", "c$"],
    reply: "Fisch's main currency is C$, earned mainly by selling the fish you catch — rarer, heavier, and mutated fish sell for dramatically more. That money goes toward better rods, bait, boats, totems, and enchant materials. Completing quests and hunting high-value or rare fish are the fastest ways to build a fishing budget. Heads up: when you move on to the Second Sea, your First Sea currency and rods no longer carry over, so it's worth finishing your First Sea goals first."
  },
  {
    id: "rods",
    keywords: ["rod", "rods", "fishing rod", "best rod", "which rod"],
    reply: "Fisch has well over 100 rods across a long progression, each with stats like Lure Speed, Control, Resilience, Luck, and Max Weight, plus some with unique passives. Notable named rods players chase include the Kings Rod, Kraken Rod, Leviathan's Fang Rod, Mythical Rod, Poseidon Rod, Rod of the Cosmos, Rod of the Depths, Rod of the Eternal King, Rod of the Exalted One, Sanguine Spire, Great Dreamer Rod, Crowbar Rod, and event rods like Santa's Miracle Rod. Early on, prioritize whatever rod improves your weakest stat; late game, the 'best' rod usually depends on the specific fish or boss you're targeting and which enchant you pair it with. New rods are added with almost every major update."
  },
  {
    id: "bait",
    keywords: ["bait", "lure", "which bait", "best bait"],
    reply: "Bait affects things like bite chance, luck for rarer fish, and sometimes which species can appear at all. Cheap common bait is fine for grinding early money, but stepping up to rarer bait — bought from shops, crafted, or found while exploring — noticeably improves your odds at Uncommon, Rare, Legendary, and rarer catches, especially at fishing spots known for good fish."
  },
  {
    id: "enchants",
    keywords: ["enchant", "enchantment", "enchants", "enchanting", "altar"],
    reply: "Enchantments are applied to rods at altars and boost specific stats. Notable ones: Flashline gives a 25% chance at +100% Progress Speed (75% chance at +15%), great on late/end-game rods. Swift adds +30% Lure Speed and +10% Progress Speed, ideal on slow rods. Wormhole gives an 80% chance to catch a fish from a random location — handy for Bestiary hunting. Overclocked adds +5% Progress Speed to any fish and suits high-Resilience rods. Sea Prince makes fish 15% bigger (up to 45% on the Kings Rod). Tryhard boosts Progress Speed by 30% but lowers Control slightly and adds a big max-kg bonus. Steady is one of the most XP-efficient all-round picks if your rod can consistently reel in Legendary+ fish."
  },
  {
    id: "mutations",
    keywords: ["mutation", "mutations", "shiny", "sparkling", "sunken", "sleet", "glossy", "silver", "darkened", "big fish", "giant fish", "aether", "golden part"],
    reply: "Mutations change a fish's appearance and multiply its sale value — a fish can only have one mutation at a time, and higher multipliers take priority over lower ones. Some of the strongest: Aether (12×), Fury (11.7×), Hades' Curse (11.1×), and Golden Part (11×) sit at the very top. Sunken (4×) comes from using the Sunken Rod. Sleet (2.4×) appears during an Avalanche event (via an Avalanche Totem). Shiny and Sparkling (both 1.85×) can come from the Destiny Rod, the Blessed Enchant, or special events. Glossy and Silver sit at 1.6×, and Darkened (from the Noir Enchantment) is 1.3×. Big and Giant don't multiply value but do increase weight and are boosted by the Sea King Enchantment or Kings Rod."
  },
  {
    id: "rarity",
    keywords: ["rarity", "rarities", "rare tier", "how rare", "trash tier", "secret fish", "apex", "divine secret", "relic", "gemstone"],
    reply: "Fish in Fisch are grouped into rarity tiers, roughly: Trash, Common, Uncommon, Unusual, Rare, Legendary, Mythical, Exotic, Secret, Relic, Fragment, Gemstone, Apex, and Divine Secret at the very top. Higher tiers are progressively harder to find, often need specific bait, locations, weather, or events, and are worth dramatically more C$ — especially when combined with a good mutation. Try typing a fish's name into the chat and I'll tell you its exact rarity."
  },
  {
    id: "appraising",
    keywords: ["appraise", "appraising", "appraiser", "reroll weight"],
    reply: "Appraising lets an NPC re-roll a fish's weight and gives it a chance at a new random mutation — but it also strips away any mutation the fish already had. It costs money (roughly C$450 at the standard appraiser), so it's generally only worth doing on expensive Mythical-or-rarer fish where a lucky reroll could massively boost the sale price."
  },
  {
    id: "reeling",
    keywords: ["reel", "reeling", "control bar", "progress bar", "how does fishing work", "cast", "mechanic"],
    reply: "Fishing plays out in stages: cast your line near water, wait for a bite, then reel it in by managing a control bar against the fish's resistance — this is affected by your rod's Control and Resilience stats plus the fish's own Progress Speed (some legendary and boss fish have strongly negative Progress Speed, making them fight back hard). Landing the catch fills a progress meter; letting the fish pull too far can lose the catch, so balancing tension is the core skill of fishing in Fisch."
  },
  {
    id: "locations",
    keywords: ["location", "locations", "map", "island", "sea", "where to fish", "zone", "area"],
    reply: "Fisch's world is split into progressively-unlocked seas, each with several islands and fishing zones. Major locations include Moosewood (the starting hub), Mariana's Veil, Mushgrove Swamp, Northern Expedition, Roslit Bay, Scoria Reach, Snowcap Island, the open Ocean, Ancient Isle, Forsaken Shores, Snorkel Island, and Terrapin Island, with further seas unlocked later by boat once you're geared up. Different zones favor different fish species, weather effects, and rare spawns, so exploring is a core part of Bestiary progress."
  },
  {
    id: "second-sea",
    keywords: ["second sea", "third sea", "new sea", "sea reset"],
    reply: "Moving to the Second Sea feels like starting a fresh character: your First Sea rods get nerfed and your First Sea currency doesn't carry over, so most players finish everything they want to do in the First Sea before making the jump. Later seas continue that pattern of tougher fish, new gear, and new zones to explore."
  },
  {
    id: "totems",
    keywords: ["totem", "totems", "sundial", "windset", "avalanche totem", "eclipse totem"],
    reply: "Totems are items you can carry to trigger temporary world effects, useful for hunting specific mutations or fish. Examples include the Sundial Totem (found on Sunstone Island, costs C$2000, switches day to night or back), the Avalanche Totem (from the Northern Summit, triggers an Avalanche that boosts the Sleet mutation), and the Eclipse Totem (from the Ancient Isle, triggers an Eclipse event tied to the Solarblaze mutation)."
  },
  {
    id: "bosses",
    keywords: ["boss", "bosses", "secret", "secrets", "colossal squid", "scylla", "leviathan", "megalodon"],
    reply: "Fisch has boss-tier fish and hidden secrets scattered through its world. The Colossal Squid is a notoriously tough catch, best tackled with a strong end-game rod (Resilient/Control-focused) and a matching enchant. Scylla is another high-difficulty target associated with the Leviathan's Fang Rod. The Megalodon is a sought-after limited-rarity catch. Beyond named bosses, many areas hide collectible 'secrets' — finding a full set per zone can unlock access to deeper or hidden areas, so exploring thoroughly pays off."
  },
  {
    id: "boats",
    keywords: ["boat", "boats", "travel", "sail", "ship"],
    reply: "Boats let you travel between seas and reach open-water fishing spots you can't access on foot. As you progress, you can acquire better boats, which typically travel faster and open up more distant or dangerous fishing grounds."
  },
  {
    id: "trading",
    keywords: ["trade", "trading", "trade fish", "trade rod"],
    reply: "Fisch supports player trading, letting you exchange fish, rods, and other items with other players. It's a common way to complete a Bestiary entry for a fish you haven't personally caught, or to get an item from an event you missed."
  },
  {
    id: "updates",
    keywords: ["update", "updates", "new", "patch", "changelog", "latest"],
    reply: "Fisch updates frequently — recent additions have included new equipment like Harpoon Guns, new areas such as the Chapel, reworks to systems like the Equipment Bag, and fresh enchantments. Because updates roll out often, it's worth checking the official Fisch wiki or in-game changelog for the very latest additions."
  },
  {
    id: "developer",
    keywords: ["developer", "who made", "creator", "woozynate", "fisching", "studio"],
    reply: "Fisch was created by Roblox developer WoozyNate and the Fisching development team. It entered early access on March 13, 2024, and had its full release on October 5, 2024."
  },
  {
    id: "fishdex",
    keywords: ["fishdex", "how many fish", "fish database", "fish list"],
    reply: "I've got 300 fish loaded, spanning every rarity tier from Rare all the way up to Divine Secret. Just type a fish's name — like 'Megalodon' or 'Scylla' — and I'll tell you its rarity. You can also scroll and search the full list in the Fishdex section on this page."
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

const FALLBACK = "I don't have a solid answer for that one yet. Try asking about rods, bait, enchants, mutations, rarities, locations, bosses, currency, appraising, totems, how to get started — or type a fish name from the Fishdex.";

const SUGGESTIONS = [
  "What is Fisch?",
  "Best enchants?",
  "What rarity is Megalodon?",
  "Tell me about Scylla",
  "How does reeling work?"
];

// Sort FISH_DB by name length descending so multi-word names (e.g. "Colossal Squid")
// are matched before a shorter substring inside them could cause a false match.
const FISH_LOOKUP = [...FISH_DB].sort((a, b) => b.name.length - a.name.length);

function findFishMatch(textLower) {
  for (const fish of FISH_LOOKUP) {
    if (textLower.includes(fish.name.toLowerCase())) return fish;
  }
  return null;
}

function fishReply(fish) {
  const tierIndex = RARITY_ORDER.indexOf(fish.rarity);
  const isTop = tierIndex >= RARITY_ORDER.indexOf("Exotic");
  const flavor = isTop
    ? " That puts it among the toughest catches in the game — worth building a dedicated rod and enchant setup for."
    : "";
  return `The ${fish.name} is a ${fish.rarity}-tier fish in Fisch.${flavor}`;
}

function scoreEntry(entry, textLower) {
  let score = 0;
  for (const kw of entry.keywords) {
    if (textLower.includes(kw)) score += kw.split(" ").length;
  }
  return score;
}

function getReply(userText) {
  const textLower = userText.toLowerCase();

  const fishMatch = findFishMatch(textLower);

  let best = null;
  let bestScore = 0;
  for (const entry of KNOWLEDGE) {
    const s = scoreEntry(entry, textLower);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }

  // Prefer a specific fish match unless a strong topic keyword also matched
  // (e.g. "what rarity is Megalodon" should still give the fish answer).
  if (fishMatch && (!best || bestScore <= 2)) return fishReply(fishMatch);
  if (fishMatch && textLower.includes(fishMatch.name.toLowerCase()) && bestScore < 3) return fishReply(fishMatch);

  return best ? best.reply : (fishMatch ? fishReply(fishMatch) : FALLBACK);
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

addMessage("Hey! I'm CooperAI 🎣 — ask me anything about Fisch: rods, bait, enchants, mutations, locations, bosses, or type any fish name (I know 300) to look up its rarity.", "bot");

// --- Fishdex browser ---
const RARITY_CLASS = {
  "Trash": "r-trash", "Common": "r-common", "Uncommon": "r-uncommon", "Unusual": "r-unusual",
  "Rare": "r-rare", "Legendary": "r-legendary", "Mythical": "r-mythical", "Exotic": "r-exotic",
  "Secret": "r-secret", "Relic": "r-relic", "Fragment": "r-fragment", "Gemstone": "r-gemstone",
  "Apex": "r-apex", "Divine Secret": "r-divine"
};

const fishdexGrid = document.getElementById("fishdexGrid");
const fishdexSearch = document.getElementById("fishdexSearch");

function renderFishdex(filter) {
  const f = (filter || "").toLowerCase().trim();
  const items = FISH_DB.filter((fish) => !f || fish.name.toLowerCase().includes(f) || fish.rarity.toLowerCase().includes(f));
  fishdexGrid.innerHTML = "";
  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "fishdex-empty";
    empty.textContent = "No fish match that search.";
    fishdexGrid.appendChild(empty);
    return;
  }
  const frag = document.createDocumentFragment();
  items.forEach((fish) => {
    const card = document.createElement("div");
    card.className = "fishdex-item";
    const name = document.createElement("span");
    name.className = "fname";
    name.textContent = fish.name;
    const rarity = document.createElement("span");
    rarity.className = "frarity " + (RARITY_CLASS[fish.rarity] || "r-common");
    rarity.textContent = fish.rarity;
    card.appendChild(name);
    card.appendChild(rarity);
    frag.appendChild(card);
  });
  fishdexGrid.appendChild(frag);
}

fishdexSearch.addEventListener("input", (e) => renderFishdex(e.target.value));
renderFishdex("");
