<template>
  <v-app dark id="app">
    <v-toolbar fixed height="48px">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="goTo('/apod')" flat>Apod</v-btn>
        <v-btn @click="goTo('/asteroid')" flat>Asteroid</v-btn>
        <v-btn @click="goTo('/fireballs')" flat>Fireballs</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-container>
      <router-view/>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  mounted () {
    document.querySelector('body').style.backgroundColor = '#303030'
  },
  methods: {
    goTo (route) {
      this.$router.push(route)
    }
  },
  computed: {
    ...mapGetters({
      'title': 'getTitle'
    })
  }
}
</script>

<style scoped lang="scss">

#app {
  height: 100%;
  width: 100%;
  padding-top: 48px;
}

</style>
