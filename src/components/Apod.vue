<template>
  <v-flex xs12>
    <v-img src="https://apod.nasa.gov/apod/image/1905/SunriseCopernicusC.jpg" />
  </v-flex>
</template>

<script>

export default {
  name: 'Apod',
  components: {
  },
  props: {
  },
  mounted () {
    console.log('[Apod:mounted]')
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>

</style>
