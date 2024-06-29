
<script setup>
defineProps(['class'])
</script>

<template>
  <div :class="props.class">
    <ContentSlot :use="$slots.default" unwrap="p" />
  </div>
</template>
<script setup lang="ts">j