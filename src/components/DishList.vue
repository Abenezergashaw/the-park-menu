<script setup>
import DishCard from "./DishCard.vue";

defineProps({
  dishes: Array,
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <DishCard v-for="dish in dishes" :key="dish.id" :dish="dish" />
  </div>
</template>
