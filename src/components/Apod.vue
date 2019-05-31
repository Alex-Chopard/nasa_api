<template>
  <v-layout row wrap v-if="apod">
    <v-card-text v-text="apod.title"></v-card-text>
    <v-flex xs12>
      <v-img
        max-height="80vh"
        :src="url"
        contain/>
    </v-flex>
    <v-layout column>
      <v-switch
        v-model="useHdUrl"
        label="HD picure"
      >
      </v-switch>
    </v-layout>
    <p v-html="apod.explanation"></p>
  </v-layout>
</template>

<script>
import fetch from '@/services/fetch'
import endpoints from '@/services/endpoints'

export default {
  name: 'Apod',
  components: {
  },
  props: {
  },
  mounted () {
    console.log('[Apod:mounted]')
    this.fetchApod()
  },
  data () {
    return {
      apod: null,
      useHdUrl: true
    }
  },
  watch: {
    'useHdUrl' () {
      this.fetchApod()
    }
  },
  methods: {
    fetchApod () {
      console.log('[Apod:fetchApod]')
      fetch(endpoints.planetary.apod, { hd: this.useHdUrl }).then(result => {
        console.log('[Apod:fetchApod] Result', result)
        if (result) {
          this.apod = result
        }
      })
    }
  },
  computed: {
    url () {
      if (this.apod) {
        return this.useHdUrl ? this.apod.hdurl : this.apod.url
      }
    }
  }
}
</script>

<style scoped>

</style>
