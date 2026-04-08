<script setup>
defineProps({
  category: Object,
});
</script>

<template>
  <div class="text-center mb-8">
    <p class="text-[10.5px] tracking-[0.3em] uppercase text-[#B8966B] mb-2">
      {{ category.course }}
    </p>

    <h2
      class="font-['Cormorant_Garamond'] text-4xl font-light italic"
      v-html="category.title"
    />

    <p class="text-[13px] text-[#7A6E65] mt-2">
      {{ category.desc }}
    </p>
  </div>
</template>
