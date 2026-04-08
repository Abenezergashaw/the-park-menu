<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  "https://gruipgmcxdqkzdxhdfgd.supabase.co",
  "sb_publishable_dVjAQ8UTVDB7mUel7Xlorg_GdTiBybG",
);

// State Management
const allDishes = ref([]);
const categories = ref([]);
const activeCategory = ref("");
const isMenuOpen = ref(false);
const isLoading = ref(true);

/**
 * Fetch Data from Supabase
 */
const fetchData = async () => {
  isLoading.value = true;
  try {
    const [catRes, dishRes] = await Promise.all([
      supabase.from("categories").select("*").order("id"),
      supabase.from("dishes").select("*").eq("is_available", true),
    ]);

    if (catRes.data) {
      categories.value = catRes.data;
      // Set initial category if available
      if (catRes.data.length > 0) activeCategory.value = catRes.data[0].id;
    }

    if (dishRes.data) {
      allDishes.value = dishRes.data;
    }
  } catch (error) {
    console.error("Error fetching menu:", error);
  } finally {
    isLoading.value = false;
  }
};

// Computed Properties
const currentDishes = computed(() => {
  return allDishes.value.filter((d) => d.category_id === activeCategory.value);
});

const currentLabel = computed(() =>
  categories.value.find((c) => c.id === activeCategory.value),
);

// UI Methods
const selectCategory = (id) => {
  activeCategory.value = id;
  isMenuOpen.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Lifecycle Hooks
onMounted(fetchData);

// Watchers
watch(isMenuOpen, (val) => {
  document.body.style.overflow = val ? "hidden" : "auto";
});
</script>

<template>
  <div
    class="min-h-screen bg-[#1A1A1A] text-white font-sans selection:bg-[#DB7C2E]/30"
  >
    <header
      class="sticky top-0 z-40 bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center"
    >
      <div class="flex flex-col">
        <h1
          class="text-xl font-black tracking-tighter text-[#DB7C2E] uppercase"
        >
          THE PARK <span class="text-white/60 font-bold"> | ዘ ፓርክ</span>
        </h1>
        <div class="flex items-center gap-2">
          <div
            class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
          ></div>
          <p class="text-[10px] text-white/40 uppercase tracking-[0.2em]">
            {{ currentLabel?.label || "Loading..." }}
          </p>
        </div>
      </div>

      <button
        @click="isMenuOpen = true"
        class="p-3 bg-white/5 rounded-2xl active:scale-90 transition-all hover:bg-white/10 border border-white/5"
      >
        <div class="w-6 h-0.5 bg-[#DB7C2E] mb-1.5 rounded-full"></div>
        <div class="w-4 h-0.5 bg-white ml-auto rounded-full"></div>
      </button>
    </header>

    <Transition name="slide-fade">
      <div v-if="isMenuOpen" class="fixed inset-0 z-50 overflow-hidden">
        <div
          @click="isMenuOpen = false"
          class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        ></div>

        <aside
          class="absolute top-0 right-0 w-[85%] max-w-xs h-full bg-[#252525] shadow-2xl flex flex-col border-l border-white/5"
        >
          <div
            class="p-8 flex justify-between items-center border-b border-white/5"
          >
            <span
              class="font-bold text-[#DB7C2E] uppercase tracking-widest text-xs"
              >Menu Categories</span
            >
            <button @click="isMenuOpen = false" class="text-white/40 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            <button
              v-for="c in categories"
              :key="c.id"
              @click="selectCategory(c.id)"
              :class="[
                'w-full flex items-center justify-between p-4 rounded-3xl transition-all duration-300 group',
                activeCategory === c.id
                  ? 'bg-[#DB7C2E] text-white shadow-lg shadow-[#DB7C2E]/20'
                  : 'hover:bg-white/5 text-white/60',
              ]"
            >
              <div class="flex items-center gap-4">
                <span
                  class="text-2xl grayscale group-hover:grayscale-0 transition-all"
                  :class="{ 'grayscale-0': activeCategory === c.id }"
                >
                  {{ c.icon }}
                </span>
                <div class="text-left">
                  <p class="font-bold leading-none">{{ c.label_am }}</p>
                  <p
                    class="text-[10px] uppercase opacity-50 tracking-tighter mt-1"
                  >
                    {{ c.label }}
                  </p>
                </div>
              </div>
              <div
                v-if="activeCategory === c.id"
                class="w-1.5 h-1.5 rounded-full bg-white"
              ></div>
            </button>
          </nav>

          <div class="p-6 border-t border-white/5 bg-black/20">
            <p
              class="text-[10px] text-center text-white/20 uppercase tracking-widest"
            >
              ZemenBet Systems v2.0
            </p>
          </div>
        </aside>
      </div>
    </Transition>

    <main class="p-6 max-w-5xl mx-auto pb-32">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="h-64 bg-white/5 rounded-[2.5rem] animate-pulse"
        ></div>
      </div>

      <transition-group
        v-else
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div
          v-for="d in currentDishes"
          :key="d.id"
          class="group bg-[#2A2A2A] rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col hover:border-[#DB7C2E]/30 transition-all duration-500 shadow-2xl"
        >
          <div class="relative h-72 overflow-hidden">
            <img
              :src="d.image_url"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-[#2A2A2A] via-[#2A2A2A]/20 to-transparent"
            ></div>

            <div
              class="absolute top-6 right-6 bg-[#8E213A] px-4 py-2 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md"
            >
              <p class="text-white font-black text-sm">
                {{ d.price }} <span class="text-[10px] opacity-60">ETB</span>
              </p>
            </div>

            <div class="absolute bottom-6 left-8 right-8">
              <h3 class="text-3xl font-black text-white leading-tight">
                {{ d.name }}
              </h3>
              <div class="flex items-center gap-2 mt-2 opacity-60">
                <span
                  class="text-xs uppercase tracking-widest font-bold text-[#DB7C2E]"
                  >The Park Signature</span
                >
                <div class="h-px flex-1 bg-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <div
        v-if="currentDishes.length === 0 && !isLoading"
        class="mt-32 text-center animate-bounce"
      >
        <p class="text-6xl mb-4">🍽️</p>
        <p class="text-white/20 uppercase tracking-[0.4em] text-sm">
          Refreshing Menu...
        </p>
      </div>
    </main>

    <div
      v-if="false"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-xs px-6"
    >
      <button
        class="w-full bg-[#8E213A] hover:bg-[#a32642] text-white py-4 rounded-3xl font-black shadow-2xl shadow-black/50 transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
          />
        </svg>
        CALL WAITER
      </button>
    </div>
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

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-active aside,
.slide-fade-leave-active aside {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-from aside,
.slide-fade-leave-to aside {
  transform: translateX(100%);
}

/* Grid List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
