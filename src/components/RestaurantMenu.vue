<script setup>
import { ref, computed } from "vue";

const activeCategory = ref("starters");

const categories = [
  {
    id: "starters",
    label: "Starters",
    course: "To Begin",
    title: "<em>Les</em> Entrees",
    desc: "Delicate openings crafted to awaken the senses and set the tone for your evening.",
  },
  {
    id: "mains",
    label: "Mains",
    course: "Main Course",
    title: "<em>Les</em> Plats",
    desc: "Signature dishes where classical technique meets seasonal ingredients at their peak.",
  },
  {
    id: "pasta",
    label: "Pasta",
    course: "Handmade Daily",
    title: "<em>Pates</em> Fraiches",
    desc: "All pasta made in-house each morning with stone-milled flour from our partner mill.",
  },
  {
    id: "desserts",
    label: "Desserts",
    course: "Sweet Finale",
    title: "<em>Les</em> Douceurs",
    desc: "A sweet conclusion to your journey — each dessert a small work of art.",
  },
  {
    id: "drinks",
    label: "Drinks",
    course: "Libations",
    title: "<em>Les</em> Boissons",
    desc: "Curated wines, artisan cocktails and non-alcoholic pairings for every course.",
  },
];

const menu = {
  starters: [
    {
      id: "s1",
      name: "Burrata & Heritage Tomatoes",
      price: "€16",
      desc: "Creamy burrata from Puglia, heirloom tomatoes, aged balsamic reduction, fresh basil oil and fleur de sel.",
      emoji: "🍅",
      gradient: "from-[#f8e8d4] to-[#f5c4a0]",
      badge: "Chef's Pick",
      badgeType: "chef",
      tags: ["Vegetarian", "Gluten-free"],
    },
    {
      id: "s2",
      name: "Smoked Salmon Millefeuille",
      price: "€22",
      desc: "Scottish cold-smoked salmon, creme fraiche mousse, cucumber jelly, dill and golden caviar.",
      emoji: "🐟",
      gradient: "from-[#e8f4f0] to-[#b8ddd4]",
      badge: "New",
      badgeType: "new",
      tags: ["Pescatarian", "Gluten-free"],
    },
    {
      id: "s5",
      name: "Wagyu Beef Tartare",
      price: "€26",
      desc: "Hand-cut A4 Wagyu, aged Dijon, cornichon, shallots, Tabasco, quail egg and toasted sourdough.",
      emoji: "🥩",
      gradient: "from-[#f5e4e4] to-[#e8b4b4]",
      badge: "Chef's Pick",
      badgeType: "chef",
      tags: ["Premium"],
    },
  ],
  mains: [
    {
      id: "m1",
      name: "Roasted Turbot",
      price: "€44",
      desc: "Line-caught turbot fillet, Jerusalem artichoke puree, coastal herbs beurre blanc, sea vegetable salad.",
      emoji: "🐡",
      gradient: "from-[#e4eff8] to-[#a8ccec]",
      badge: "Chef's Pick",
      badgeType: "chef",
      tags: ["Gluten-free", "Sustainable"],
    },
    {
      id: "m3",
      name: "Truffle Risotto",
      price: "€34",
      desc: "Carnaroli risotto stirred with aged Parmigiano, black truffle shavings and Barolo wine reduction.",
      emoji: "🍄",
      gradient: "from-[#ede8e0] to-[#c4b89a]",
      badge: "Vegetarian",
      badgeType: "veg",
      tags: ["Vegetarian", "Seasonal"],
    },
  ],
  // ... other categories follow the same pattern
};

const currentCategory = computed(() =>
  categories.find((c) => c.id === activeCategory.value),
);
const currentDishes = computed(() => menu[activeCategory.value] || []);

const selectCategory = (id) => {
  activeCategory.value = id;
  const nav = document.getElementById("menu-nav");
  if (nav) window.scrollTo({ top: nav.offsetTop, behavior: "smooth" });
};
</script>

<template>
  <div class="min-h-screen bg-[#F9F4EE] text-[#2A2520] font-['Jost']">
    <header
      class="relative h-[340px] bg-[#2A2520] flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(184,150,107,0.18)_0%,transparent_70%)] bg-gradient-to-br from-[#1a1510] via-[#2A2520] to-[#1a1510]"
      ></div>

      <div
        class="absolute inset-0 opacity-[0.04] pointer-events-none"
        style="
          background-image:
            repeating-linear-gradient(
              45deg,
              #b8966b 0,
              #b8966b 1px,
              transparent 0,
              transparent 50%
            ),
            repeating-linear-gradient(
              -45deg,
              #b8966b 0,
              #b8966b 1px,
              transparent 0,
              transparent 50%
            );
          background-size: 18px 18px;
        "
      ></div>

      <div
        class="relative text-center px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
      >
        <p class="text-[11px] tracking-[0.3em] text-[#B8966B] uppercase mb-3.5">
          Fine Dining Experience
        </p>
        <h1
          class="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[#FAF7F2] leading-none mb-2.5"
        >
          Maison <span class="italic text-[#D4B896]">Eclat</span>
        </h1>
        <div class="w-10 h-[1px] bg-[#B8966B]/60 mx-auto my-4"></div>
        <p class="text-[12px] tracking-[0.2em] text-white/40 uppercase">
          Est. 2019 &nbsp;·&nbsp; Brussels
        </p>
      </div>
    </header>

    <nav
      id="menu-nav"
      class="sticky top-0 z-50 bg-[#2A2520] border-b border-[#B8966B]/20 h-16 flex items-center"
    >
      <div
        class="flex overflow-x-auto px-4 gap-1 no-scrollbar w-full scroll-smooth"
      >
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          :class="[
            'flex-shrink-0 px-4 py-2 rounded-full text-[12.5px] tracking-widest transition-all duration-300',
            activeCategory === cat.id
              ? 'bg-[#B8966B] text-[#2A2520] font-medium'
              : 'text-white/45 hover:bg-[#B8966B]/10 hover:text-[#D4B896]',
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </nav>

    <main class="max-w-2xl mx-auto px-4 py-8 pb-24">
      <transition
        name="fade"
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-3"
        leave-active-class="transition duration-200 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div :key="activeCategory">
          <div class="text-center mb-8">
            <p
              class="text-[10.5px] tracking-[0.3em] uppercase text-[#B8966B] mb-2"
            >
              {{ currentCategory.course }}
            </p>
            <h2
              class="font-['Cormorant_Garamond'] text-4xl font-light leading-tight italic"
              v-html="currentCategory.title"
            ></h2>
            <p
              class="text-[13px] text-[#7A6E65] mt-2 leading-relaxed font-light"
            >
              {{ currentCategory.desc }}
            </p>

            <div class="flex items-center justify-center gap-3 mt-4">
              <span class="w-7 h-[1px] bg-[#B8966B]/50"></span>
              <span class="w-1 h-1 bg-[#B8966B]/70 rotate-45"></span>
              <span class="w-7 h-[1px] bg-[#B8966B]/50"></span>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div
              v-for="(dish, i) in currentDishes"
              :key="dish.id"
              class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.985] duration-200"
            >
              <div class="relative aspect-video overflow-hidden">
                <div
                  :class="[
                    'w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br',
                    dish.gradient,
                  ]"
                >
                  <span>{{ dish.emoji }}</span>
                </div>
                <span
                  v-if="dish.badge"
                  :class="[
                    'absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase',
                    dish.badgeType === 'chef'
                      ? 'bg-[#2A2520]/75 text-[#D4B896]'
                      : dish.badgeType === 'veg'
                        ? 'bg-white/85 text-[#4a7c3a]'
                        : 'bg-[#B8966B] text-[#2A2520]',
                  ]"
                >
                  {{ dish.badge }}
                </span>
              </div>

              <div class="p-5">
                <div class="flex justify-between items-start gap-3">
                  <h3
                    class="font-['Cormorant_Garamond'] text-2xl font-normal leading-none"
                  >
                    {{ dish.name }}
                  </h3>
                  <span
                    class="font-['Cormorant_Garamond'] text-xl font-light text-[#B8966B] whitespace-nowrap"
                    >{{ dish.price }}</span
                  >
                </div>
                <p
                  class="text-[13px] text-[#7A6E65] mt-2 leading-relaxed font-light"
                >
                  {{ dish.desc }}
                </p>

                <div class="flex flex-wrap gap-1.5 mt-3">
                  <span
                    v-for="tag in dish.tags"
                    :key="tag"
                    class="text-[10.5px] text-[#7A6E65] border border-[#B8966B]/25 px-2.5 py-0.5 rounded-full tracking-wide"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <footer class="text-center mt-12 pt-8 border-t border-[#B8966B]/25">
            <p class="text-[12px] text-[#7A6E65] tracking-wide">
              Please inform us of any allergies or dietary requirements
            </p>
            <p class="text-[11px] text-[#7A6E65]/60 mt-1.5">
              All dishes are prepared fresh to order
            </p>
          </footer>
        </div>
      </transition>
    </main>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
