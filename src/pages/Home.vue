<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-text>
      <div class="text-h4">Lumika</div>
      <p>
        Lumika 是一个编解码转换工具，用于将任意数据转换为以<strong>视频</strong>形式存储数据。
      </p>
      <p>
        它使用里德所罗门码对数据进行编码，并提供冗余校验和丢失数据恢复功能。同时，它使用 <code>FFmpeg</code> 将编码后的数据转换为视频。
      </p>
      <p>
        Lumika 支持多线程处理，能够进行帧级别的数据纠错，并且提供一键编解码文件和自定义分割编码视频长度的功能。
      </p>
      <p>
        它适用于文件分享、文件加密、反审查、混淆等场景。
      </p>
      <p>
        经过测试，使用默认配置生成的编码视频经过 B 站压制后仍然能够正常解码，并且能够恢复编码视频的原始文件数据。
      </p>
    </v-card-text>
  </v-card>

  <v-card class="mx-auto" max-width="800">
    <v-card-title class="headline">安装</v-card-title>
    <v-card-text>
      <p>在开始使用 Lumika 之前，你需要安装 <code>FFmpeg</code> 和 <code>FFprobe</code>。</p>
      <p><strong>Linux</strong></p>
      <pre><code>apt update</code></pre>
      <pre><code>apt install ffmpeg</code></pre>
      <p><strong>Windows</strong></p>
      <p>你可以在 <a href="https://ffmpeg.org/download.html">FFmpeg</a> 官方网站下载安装包并进行安装。</p>
    </v-card-text>
  </v-card>

  <v-card class="mx-auto" max-width="800">
    <v-card-title class="headline">教程</v-card-title>
    <v-card-text>
      <p>你可以参考在
        <a
          href="https://gal.bilinside.eu.org/normal/normal-it/%E3%80%90%E6%8A%80%E6%9C%AF%E6%95%99%E7%A8%8B%E3%80%91%E9%80%9A%E8%BF%87-Lumika-%E5%AF%B9%E5%93%94%E5%93%A9%E6%BA%90%E5%88%86%E4%BA%AB%E7%9A%84%E6%96%87%E4%BB%B6%E8%BF%9B%E8%A1%8C%E8%A7%A3%E7%A0%81%E7%9A%84%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B/"
          target="_blank">
          GalInside
        </a>
        上发布的教程，或者也可以在
        <a
          href="https://www.bilibili.com/video/BV1CN4y1X7GQ/"
          target="_blank">
          BiliBili
        </a>
        上观看教程视频。</p>
    </v-card-text>
  </v-card>
</template>

<script setup>

</script>

<style scoped>

</style>
