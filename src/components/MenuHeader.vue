<script setup></script>

<template>
  <header
    class="relative h-[360px] bg-[#2A2520] flex flex-col items-center justify-center overflow-hidden"
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

    <div class="relative text-center px-6">
      <!-- English -->
      <p class="text-[11px] tracking-[0.3em] text-[#B8966B] uppercase mb-1">
        Fine Dining Experience
      </p>

      <!-- Amharic subtitle -->
      <p class="text-[11px] tracking-wide text-[#B8966B]/70 mb-3 font-sans">
        ልዩ ተሞክሮ
      </p>

      <!-- Title -->
      <h1
        class="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[#FAF7F2] leading-none mb-1"
      >
        The <span class="italic text-[#D4B896]">PARK</span>
      </h1>

      <!-- Amharic Title (subtle, not competing) -->
      <p class="text-[14px] text-white/50 font-sans mb-2">ዘ ፓርክ</p>

      <div class="w-10 h-[1px] bg-[#B8966B]/60 mx-auto my-4"></div>

      <!-- Footer line -->
      <p class="text-[12px] tracking-[0.2em] text-white/40 uppercase">
        Est. 2025 · Gondar
      </p>

      <!-- Amharic footer -->
      <p class="text-[12px] text-white/30 mt-1 font-sans tracking-wider">
        ከ 2018 · ጎንደር
      </p>
    </div>
  </header>
</template>
