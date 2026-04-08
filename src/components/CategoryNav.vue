<script setup>
defineProps({
  categories: Array,
  activeCategory: String,
});

const emit = defineEmits(["select"]);
</script>

<template>
  <nav
    class="sticky top-0 z-50 bg-[#2A2520] border-b border-[#B8966B]/20 h-16 flex items-center"
  >
    <div class="flex overflow-x-auto px-4 gap-1 no-scrollbar w-full">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="emit('select', cat.id)"
        :class="[
          'flex-shrink-0 px-4 py-2 rounded-full text-[12.5px] tracking-widest',
          activeCategory === cat.id
            ? 'bg-[#B8966B] text-[#2A2520]'
            : 'text-white/45',
        ]"
      >
        {{ cat.label }}
      </button>
    </div>
  </nav>
</template>
