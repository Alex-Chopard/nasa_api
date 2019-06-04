<template>
  <v-layout row wrap>
    <v-flex xs12>

      <GmapMap
        :center="{lat:10, lng:10}"
        :zoom="map.zoom"
        map-type-id="terrain"
        style="height: 500px"
      >
        <GmapCircle
          v-for="fireball in fireballs"
          :key="`key-${fireball.lat}${fireball.lon}${fireball.date}`"
          :center="{ lat: getLat(fireball), lng: getLng(fireball) }"
          :radius="10"
          :clickable="false"
          :draggable="false"
          :options="{
            strokeColor: getColor(fireball['impact-e']),
            strokeOpacity: 1,
            strokeWeight: getWeigth(fireball['impact-e']),
            fillColor: getColor(fireball['impact-e']),
            fillOpacity: 1
          }"
        />
      </GmapMap>

    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import fetch from '@/services/fetch'
import endpoints from '@/services/endpoints'

export default {
  name: 'Fireballs',
  components: {
  },
  props: {
  },
  mounted () {
    console.log('[Fireballs:mounted]')

    this.setToolbarTitle('Fireballs Impacts')
    this.fetchFireballs()
  },
  data () {
    return {
      fireballs: [],
      map: {
        zoom: 2
      }
    }
  },
  watch: {
  },
  methods: {
    fetchFireballs () {
      console.info('[Fireballs:fetchFireballs]')
      fetch(endpoints.fireball.get, {

      }, 'fireballs').then(result => {
        console.info('[Fireballs:fetchFireballs] result', result)
        if (result && result.data && result.fields) {
          const fields = result.fields

          result.data.map(fireball => {
            const objFireball = {}
            fields.map((field, key) => {
              objFireball[field] = fireball[key]
            })

            this.fireballs.push(objFireball)
          })

          console.info('[Fireballs:fetchFireballs] All fireballs : ', this.fireballs)
        }
      })
    },
    getLat (fireball) {
      return fireball['lat-dir'] === 'N' ? parseFloat(fireball.lat) : -parseFloat(fireball.lat)
    },
    getLng (fireball) {
      return fireball['lon-dir'] === 'E' ? parseFloat(fireball.lon) : -parseFloat(fireball.lon)
    },
    getWeigth (energy) {
      switch (true) {
        case energy < 1: {
          return 10
        }
        case energy < 2: {
          return 12
        }
        case energy < 4: {
          return 14
        }
        case energy < 10: {
          return 18
        }
        case energy < 50: {
          return 20
        }
        case energy < 200: {
          return 25
        }
        default: {
          return 100
        }
      }
    },
    getColor (energy) {
      switch (true) {
        case energy < 1: {
          return '#0d47a1'
        }
        case energy < 2: {
          return '#1e88e5'
        }
        case energy < 4: {
          return '#00bcd4'
        }
        case energy < 10: {
          return '#4caf50'
        }
        case energy < 50: {
          return '#cddc39'
        }
        case energy < 200: {
          return '#ffc107'
        }
        default: {
          return '#ff5722'
        }
      }
    },
    ...mapActions({
      setToolbarTitle: 'setTitle'
    })
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">

</style>
