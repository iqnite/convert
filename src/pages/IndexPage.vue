<template>
  <q-page class="flex flex-center">
    <div>
      <h1>YouTube video downloader</h1>
      <q-input filled label="YouTube Link" v-model="link" :error="!isValid" error-message="Not a valid YouTube link"></q-input>
      <q-btn :disable="!isValid || this.link === ''" @click="downloadvideo">Download</q-btn>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'IndexPage',
  data() {
    return {
      link: "",
    };
  },
  methods:  {
    async downloadvideo() {
      try {
        this.$q.loading.show({
          message: "Fetching video...",
        });
        const title = await this.$axios.post("http://localhost:5000/youtube/gettitle", {
          link: this.link,
        });
        this.$q.loading.show({
          message: `Downloading video: "${title.data}"`,
        });
        const video = await this.$axios.post("http://localhost:5000/youtube/downloadvideo", {
          link: this.link,
        }, {
          responseType: "blob",
        });
        this.$q.loading.show({
          message: "Almost there...",
        });
        const url = window.URL.createObjectURL(new Blob([video.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", video + ".mp4"); // TODO: Change to title
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error(error);
      }
      this.$q.loading.hide();
    }
  },

  computed: {
    isValid() {
      const regex = new RegExp(
        "^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$"
      );

      if (this.link && !this.link.match(regex)) {
        return false;
      }

      return true
    }
  }
});
</script>
