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
          :key="`key-circle-${fireball.lat}${fireball.lon}${fireball.date}`"
          :center="{ lat: getLat(fireball), lng: getLng(fireball) }"
          :radius="10"
          :clickable="true"
          :draggable="false"
          :options="{
            strokeColor: getColor(fireball['impact-e']),
            strokeOpacity: 1,
            strokeWeight: getWeigth(fireball['impact-e']),
            fillColor: getColor(fireball['impact-e']),
            fillOpacity: 1
          }"
          @click="displayInfoWindow(fireball)"
        />

        <gmap-info-window
          :options="{ maxWidth: 300 }"
          :position="map.infoWindow.position"
          :opened="map.infoWindow.open"
          @closeclick="map.infoWindow.open=false">
          <div v-html="map.infoWindow.template"></div>
        </gmap-info-window>
      </GmapMap>

    </v-flex>

    <v-flex xs12>
      <v-data-table
        :headers="dataTable.headers"
        :items="fireballs"
        :loading="loading"
        hide-actions
        :pagination.sync="pagination"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <tr :class="props.item === selectedFireball ? 'Fireball-selected' : ''" @click="displayInfoWindow(props.item)">
            <td class="text-xs-right">{{ props.item.alt || '-' }}</td>
            <td class="text-xs-right">{{ `${props.item.lat || '-'}${props.item['lat-dir'] || ''}` }}</td>
            <td class="text-xs-right">{{ `${props.item.lon || '-'}${props.item['lon-dir'] || ''}` }}</td>
            <td class="text-xs-right">{{ formatDate(props.item.date) }}</td>
            <td class="text-xs-right">{{ props.item.vel || '-' }}</td>
            <td class="text-xs-right">{{ displayEnergy(props.item.energy) }}</td>
            <td class="text-xs-right">{{ props.item['impact-e']}}</td>
          </tr>
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
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
      selectedFireball: null,
      map: {
        zoom: 2,
        infoWindow: {
          open: false,
          position: { lat: 0, lng: 0 },
          template: ''
        }
      },
      pagination: {
        page: 1,
        rowsPerPage: 20,
        totalItems: 0
      },
      dataTable: {
        headers: [
          { text: 'Altitude (km)', align: 'right', value: 'alt' },
          { text: 'Latitude (deg.)', align: 'right', value: 'latCal' },
          { text: 'Longitude (deg.)', align: 'right', value: 'lonCal' },
          { text: 'Date', align: 'right', value: 'date' },
          { text: 'Velocity (km/s)', align: 'right', value: 'vel' },
          { text: 'Total Radiated Energy (J)', align: 'right', value: 'energy' },
          { text: 'Calculated Total Impact Energy (kt)', align: 'right', value: 'impact-e' }
        ]
      },
      loading: false
    }
  },
  watch: {
  },
  methods: {
    fetchFireballs () {
      console.info('[Fireballs:fetchFireballs]')
      this.loading = true
      fetch(endpoints.fireball.get, {}, 'fireballs').then(result => {
        console.info('[Fireballs:fetchFireballs] result', result)
        if (result && result.data && result.fields) {
          const fields = result.fields

          result.data.map(fireball => {
            const objFireball = {}
            fields.map((field, key) => {
              objFireball[field] = fireball[key]
            })

            objFireball.latCal = this.getLat(objFireball)
            objFireball.lonCal = this.getLng(objFireball)
            objFireball.date = moment(objFireball.date).format('X')

            this.fireballs.push(objFireball)
          })

          this.pagination.totalItems = this.fireballs.length
          this.loading = false

          console.info('[Fireballs:fetchFireballs] All fireballs : ', this.fireballs)
        }
      })
    },
    displayInfoWindow (fireball) {
      this.selectedFireball = fireball

      this.map.infoWindow.open = true
      this.map.infoWindow.position.lat = this.getLat(fireball)
      this.map.infoWindow.position.lng = this.getLng(fireball)
      this.map.infoWindow.template =
        `<p style="color: #303030;">(${fireball.lat}°${fireball['lat-dir']}, ${fireball.lon}°${fireball['lon-dir']})` +
        `<br/>Energy: ${fireball['impact-e']} kt` +
        `<br/>${this.formatDate(fireball.date)}</p>`
    },
    formatDate (timestamp) {
      return moment(moment.unix(timestamp)).format('LLL')
    },
    displayEnergy (energy) {
      if (energy) {
        const elements = energy.split('.')
        const power = `e${elements[0].length + 9}`
        const beforeDot = elements[0].substr(0, 1)
        const afterDot = elements.length === 2 ? elements[1] : elements[0].substr(1, 1)

        return `${beforeDot}.${afterDot}${power}`
      } else {
        return '-'
      }
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
    pages () {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
        return 0
      }

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  }
}
</script>

<style lang="scss">
.Fireball-selected {
  background-color: #455a64;
}
</style>
