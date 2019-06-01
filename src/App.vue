<template>
  <v-app dark id="app">
    <router-view/>
  </v-app>
</template>

<script>

export default {
  name: 'app',
  mounted () {
    document.querySelector('body').style.backgroundColor = '#303030'
  }
}
</script>

<style scoped>

#app {
  height: 100%;
  width: 100%;
}

</style>
