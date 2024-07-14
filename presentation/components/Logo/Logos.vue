<script lang="ts" setup>
const props = defineProps<{
  logos: ("telegram" | "github" | "twitter" | "linkedin")[];
}>();
</script>

<template>
  <ul class="flex [&>*]:flex-1 gap-4">
    <template v-for="item in props.logos">
      <li
        v-if="item === 'telegram'"
        class="flex flex-col items-start gap-2 [&>p]:contents"
      >
        <a href="https://t.me/javastrippt">Telegram (javastrippt)</a>
        <img alt="alt text" src="./tg-qr-code.svg" />
      </li>

      <li v-if="item === 'github'" class="flex flex-col items-start gap-2">
        <a href="https://github.com/XantreDev"> GitHub (XantreDev) </a>
        <img alt="alt text" src="./github-qr-code.svg" />
      </li>

      <li v-if="item === 'twitter'" class="flex flex-col items-start gap-2">
        <a href="https://x.com/Xantre_"> Twitter/X (Xantre_) </a>
        <img alt="alt text" src="./twitter-qr-code.svg" />
      </li>

      <li v-if="item === 'linkedin'" class="flex flex-col items-start gap-2">
        <a href="https://x.com/Xantre_"> Linkedin (xantre) </a>
        <img alt="alt text" src="./twitter-qr-code.svg" />
      </li>
    </template>
  </ul>
</template>
