<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <button @click="$store.dispatch('toggleDark')">Toggle theme</button>
    <h1>Drives</h1>
    <main>
      <div class="drives">
        <div class="drive" v-for="(drive, index) in drives" :key="index">
          <div class="info">
            <div class="info_item">Size: {{bytesToSize(drive.size)}}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import drivelist from "drivelist";

import SystemInformation from "./LandingPage/SystemInformation";

export default {
  name: "landing-page",
  components: { SystemInformation },
  mounted() {
    drivelist.list((error, drives) => {
      if (error) {
        throw error;
      }

      // console.log(drives);
      this.drives = drives;
    });
  },
  data() {
    return {
      drives: []
    };
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    bytesToSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes === 0) return "0 Byte";
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  /* background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  ); */
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.drives {
  display: flex;
  width: 100%;
  height: 150px;
  margin-top: 10px;
  .drive {
    border-radius: 5px;
    background: var(--sidebar);
    height: 150px;
    min-width: 100px;
    margin-right: 10px;
  }
}
</style>
