// CooperAI — local Fisch knowledge base + lightweight keyword-matching chat engine.
// Runs entirely in the browser: no server, no API key, no data leaves the page.
// FISH_DB (624 entries) is loaded separately from fish-data.js.

const RARITY_ORDER = ["Trash","Common","Uncommon","Unusual","Rare","Legendary","Mythical","Exotic","Secret","Relic","Fragment","Gemstone","Apex","Divine Secret"];

const KNOWLEDGE = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "yo", "sup", "greetings"],
    reply: "Hey there! I'm CooperAI, your Fisch assistant. Ask me about rods, bait, enchants, mutations, rarities, locations, bosses, currency, or type any fish name — I know 624 of them, most with price and catch location."
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
    reply: "I've got 624 fish loaded, spanning every rarity tier from Trash all the way up to Divine Secret. Just type a fish's name — like 'Megalodon' or 'Scylla' — and I'll tell you its rarity, average sale price, and where to catch it when that data's available. You can also scroll and search the full list in the Fishdex section on this page."
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

const FALLBACK = "I don't have a solid answer for that one yet. Try asking about rods, bait, enchants, mutations, rarities, locations, bosses, currency, appraising, totems, how to get started — or type a fish name from the Fishdex for its rarity, price, and catch location.";

const SUGGESTIONS = [
  "What is Fisch?",
  "Best enchants?",
  "Where do I catch Megalodon?",
  "How much is Scylla worth?",
  "How does reeling work?"
];

const FISH_LOOKUP = [...FISH_DB].sort((a, b) => b.name.length - a.name.length);

function findFishMatch(textLower) {
  for (const fish of FISH_LOOKUP) {
    if (textLower.includes(fish.name.toLowerCase())) return fish;
  }
  return null;
}

function formatPrice(price) {
  if (price == null) return null;
  return "C$" + price.toLocaleString(undefined, { maximumFractionDigits: price < 100 ? 1 : 0 });
}

function fishReply(fish) {
  const tierIndex = RARITY_ORDER.indexOf(fish.rarity);
  const isTop = tierIndex >= RARITY_ORDER.indexOf("Exotic");
  const flavor = isTop
    ? " That puts it among the toughest catches in the game — worth building a dedicated rod and enchant setup for."
    : "";
  let extra = "";
  const priceText = formatPrice(fish.price);
  if (priceText && fish.location) {
    extra = ` It's caught around ${fish.location} and sells for roughly ${priceText} on average.`;
  } else if (fish.location) {
    extra = ` It's typically found around ${fish.location}.`;
  } else if (priceText) {
    extra = ` It sells for roughly ${priceText} on average.`;
  }
  return `The ${fish.name} is a ${fish.rarity}-tier fish in Fisch.${extra}${flavor}`;
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

addMessage("Hey! I'm CooperAI 🎣 — ask me anything about Fisch: rods, bait, enchants, mutations, locations, bosses, or type any fish name (I know 624) to look up its rarity, price, and where to catch it.", "bot");

// ============== Fishdex browser ==============
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
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    const name = document.createElement("span");
    name.className = "fname";
    name.textContent = fish.name;

    const rarity = document.createElement("span");
    rarity.className = "frarity " + (RARITY_CLASS[fish.rarity] || "r-common");
    rarity.textContent = fish.rarity;

    card.appendChild(name);
    card.appendChild(rarity);

    if (fish.price != null) {
      const priceLine = document.createElement("span");
      priceLine.className = "fprice";
      priceLine.textContent = formatPrice(fish.price) + (fish.location ? " · " + fish.location : "");
      card.appendChild(priceLine);
    }

    card.addEventListener("click", () => openFishModal(fish));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFishModal(fish);
      }
    });

    frag.appendChild(card);
  });
  fishdexGrid.appendChild(frag);
}

fishdexSearch.addEventListener("input", (e) => renderFishdex(e.target.value));
renderFishdex("");

// ============== Fish detail modal ==============
const RARITY_INFO = {
  "Trash": "Trash-tier catches are the most common junk items in Fisch. They sell for very little but are easy to reel in, making them useful mainly for early Bestiary progress rather than profit.",
  "Common": "Common fish are plentiful and easy to catch almost anywhere. They're the backbone of early-game income before better rods and bait open up rarer water.",
  "Uncommon": "Uncommon fish show up a bit less often than Common ones. They're still accessible early on but usually reward slightly better bait or a bit of patience.",
  "Unusual": "Unusual-tier fish sit between Uncommon and Rare — a modest step up in both rarity and payout, often found in the same waters as easier fish.",
  "Rare": "Rare fish take real effort to land: better bait, the right location, or specific weather and time-of-day conditions noticeably improve your odds.",
  "Legendary": "Legendary fish are a major mid-to-late-game target. Landing one usually calls for a rod with strong stats and often a matching enchant.",
  "Mythical": "Mythical fish are among the toughest standard catches in Fisch, typically requiring end-game rods, specific bait, and favorable conditions.",
  "Exotic": "Exotic fish are elite-tier catches — some are boss-like sea creatures, others require rare keys, items, or hard-to-reach locations to even attempt.",
  "Secret": "Secret-tier fish are hidden behind unique unlock conditions, events, or exploration puzzles rather than plain luck — many are tied to specific storylines or areas.",
  "Relic": "Relics are rare non-fish collectibles tied to end-game crafting or enchanting systems, usually found in specific late-game zones.",
  "Fragment": "Fragments are crafting materials used in high-level recipes or upgrades, generally sourced from specific elemental or thematic areas.",
  "Gemstone": "Gemstones are valuable mineral-type catches used in crafting and trading, distinct from standard fish species.",
  "Apex": "Apex predators are some of the most powerful and difficult catches in the entire game, often requiring top-tier gear and strategy to land.",
  "Divine Secret": "Divine Secret is the rarest tier in Fisch — these are the game's ultimate hidden catches, usually tied to the deepest secrets and most demanding challenges available."
};

const fishModalOverlay = document.getElementById("fishModalOverlay");
const fishModalRarity = document.getElementById("fishModalRarity");
const fishModalName = document.getElementById("fishModalName");
const fishModalStats = document.getElementById("fishModalStats");
const fishModalDesc = document.getElementById("fishModalDesc");
const fishModalLink = document.getElementById("fishModalLink");
const fishModalClose = document.getElementById("fishModalClose");

function openFishModal(fish) {
  fishModalRarity.textContent = fish.rarity;
  fishModalRarity.className = "fish-modal-rarity " + (RARITY_CLASS[fish.rarity] || "r-common");
  fishModalName.textContent = fish.name;

  fishModalStats.innerHTML = "";
  const priceText = formatPrice(fish.price);
  if (priceText) {
    const priceBox = document.createElement("div");
    priceBox.className = "fish-modal-stat";
    priceBox.innerHTML = '<span class="label">Avg. Sale Price</span><span class="value">' + priceText + "</span>";
    fishModalStats.appendChild(priceBox);
  }
  if (fish.location) {
    const locBox = document.createElement("div");
    locBox.className = "fish-modal-stat";
    locBox.innerHTML = '<span class="label">Catch Location</span><span class="value">' + fish.location + "</span>";
    fishModalStats.appendChild(locBox);
  }

  fishModalDesc.textContent = RARITY_INFO[fish.rarity] || "No further details are available for this rarity tier yet.";
  fishModalLink.href = "https://fischipedia.org/index.php?search=" + encodeURIComponent(fish.name);
  fishModalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeFishModal() {
  fishModalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

fishModalClose.addEventListener("click", closeFishModal);
fishModalOverlay.addEventListener("click", (e) => {
  if (e.target === fishModalOverlay) closeFishModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeFishModal();
});

// ============== Scroll reveal ==============
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// ============== Animated stat counters ==============
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"), 10);
  if (!target) return;
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window && counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterObserver.observe(el));
} else {
  counters.forEach((el) => { el.textContent = el.getAttribute("data-count"); });
}

// ============== Page loader ==============
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 300);
});

// ============== Lightweight floating fish canvas ==============
(function initFishCanvas() {
  const canvas = document.getElementById("fishCanvas");
  if (!canvas) return;
  const ctx2d = canvas.getContext("2d");
  let width, height, particles;
  const COLORS = ["#2de2c9", "#5b8cff", "#b06bff", "#ff6fd8", "#ffc857"];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(28, Math.floor(width / 60));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      speedY: 0.15 + Math.random() * 0.35,
      drift: Math.random() * 0.6 - 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.15 + Math.random() * 0.25
    }));
  }

  function draw() {
    ctx2d.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += Math.sin(p.y * 0.01) * p.drift * 0.4;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      ctx2d.beginPath();
      ctx2d.fillStyle = p.color;
      ctx2d.globalAlpha = p.alpha;
      ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx2d.fill();
    });
    ctx2d.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  resize();
  makeParticles();
  draw();
  window.addEventListener("resize", () => { resize(); makeParticles(); });
})();
