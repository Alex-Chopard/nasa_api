<template>
  <v-container>
    <v-layout>
      <apod></apod>
    </v-layout>
  </v-container>
</template>

<script>
import Apod from '@/components/Apod'

export default {
  name: 'Home',
  components: {
    Apod
  },
  props: {
  },
  mounted () {
    console.log('[Home:mounted]')
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

<style scoped lang="scss">

</style>
