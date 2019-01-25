<template>
  <div id="app">
    <Sidebar />
    <router-view></router-view>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar/Sidebar'
import { mapGetters } from 'vuex'

export default {
    name: 'space',
    components: {
      Sidebar
    },
    created() {
      // call method when app is created to build the styles
      this.initGlobalStyleVariables()
    },
    methods: {
      // this method appends a <style> element with the current theme varibales at the end of the <body>
      initGlobalStyleVariables() {
        // remove style tag by ID
        let element = document.getElementById('STYLE_VARS');
        if (element) element.parentNode.removeChild(element);
        // build element
        let style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'STYLE_VARS';
        // insert styles as a string from vuex store
        style.appendChild(document.createTextNode(this.getTheme));
        console.log(style)
        // append to body
        document.body.appendChild(style);
      }
    },
    computed: {
      ...mapGetters(['getTheme', 'getThemeName']) 
    },
    watch: {
      // when theme changes in the store, 
      getThemeName() {
        this.initGlobalStyleVariables();
      }
    }
  };
</script>

<style>
  /* CSS */
  #app {
    display: flex;
    transition: 200ms;
    background-color: var(--background);
    color: var(--text);
  }
</style>
