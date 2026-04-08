<script setup>
defineProps({
  dish: Object,
});
</script>

<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
    <div class="relative aspect-video">
      <div
        :class="[
          'w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br',
          dish.gradient,
        ]"
      >
        {{ dish.emoji }}
      </div>

      <span
        v-if="dish.badge"
        class="absolute top-3 right-3 text-[10px] px-2 py-1 bg-black/60 text-white"
      >
        {{ dish.badge }}
      </span>
    </div>

    <div class="p-5">
      <div class="flex justify-between">
        <h3 class="text-xl">{{ dish.name }}</h3>
        <span class="text-[#B8966B]">{{ dish.price }}</span>
      </div>

      <p class="text-sm mt-2 text-gray-500">
        {{ dish.desc }}
      </p>
    </div>
  </div>
</template>
