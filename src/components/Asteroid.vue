<template>
    <v-layout row wrap>
      <v-flex xs12>
        <v-data-table
          :headers="dataTable.headers"
          :items="dataTable.nearEarthObjects"
          :loading="loading"
          :pagination.sync="pagination"
          hide-actions
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.designation }}</td>
            <td class="text-xs-right">{{ getCloseApprochDate(props.item.close_approach_data) }}</td>
            <td class="text-xs-right">{{ props.item.estimated_diameter.meters.estimated_diameter_max }}</td>
            <td class="text-xs-right">{{ props.item.estimated_diameter.meters.estimated_diameter_min }}</td>
            <td class="text-xs-right">{{ getDate(props.item.orbital_data.first_observation_date) }}</td>
            <td class="text-xs-right">{{ getDate(props.item.orbital_data.last_observation_date) }}</td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pagination.currentLoaded"></v-pagination>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import fetch from '@/services/fetch'
import endpoints from '@/services/endpoints'

export default {
  name: 'Asteroid',
  components: {
  },
  props: {
  },
  mounted () {
    console.log('[Asteroid:mounted]')
    this.setToolbarTitle('Browse Asteroids')
  },
  data () {
    return {
      pagination: {
        currentLoaded: 0,
        page: 0,
        rowsPerPage: 20,
        totalItems: 0
      },
      dataTable: {
        headers: [
          { text: 'Asteroid Name', align: 'left', value: 'name' },
          { text: 'Designation', align: 'right', value: 'designation' },
          { text: 'Close Approach Date', align: 'right', value: 'close_approach_data' },
          { text: 'Estimated Diameter Max (meters)', align: 'right', value: 'estimated_diameter.meters.estimated_diameter_max' },
          { text: 'Estimated Diameter Min (meters)', align: 'right', value: 'estimated_diameter.meters.estimated_diameter_min' },
          { text: 'First Observation Date', align: 'right', value: 'orbital_data.first_observation_date' },
          { text: 'Last Observation Date', align: 'right', value: 'orbital_data.last_observation_date' }
        ],
        nearEarthObjects: []
      },
      loading: false
    }
  },
  watch: {
    async 'pagination.page' () {
      if (this.pagination.page === this.pagination.currentLoaded || this.pagination.currentLoaded === 0) {
        this.loading = 'warning'
        for (var i = 0; i < 5; i++) {
          await this.fetchAsteroids(this.pagination.currentLoaded)
        }
        this.loading = false
      }
    }
  },
  methods: {
    fetchAsteroids (page) {
      return new Promise(resolve => {
        try {
          console.log('[Asteroid:fetchAsteroids]', page)
          fetch(endpoints.neo.browse, { page }).then(result => {
            console.log('[fetchAsteroids:fetchApod] Result', result)
            if (result) {
              this.pagination.totalItems = result.page.total_elements
              this.pagination.currentLoaded++

              result.near_earth_objects.map(nearEarthObject => {
                var closeApprochDate = null
                if (nearEarthObject.close_approach_data && nearEarthObject.close_approach_data.length > 0) {
                  let date = nearEarthObject.close_approach_data[0].close_approach_date_full
                  closeApprochDate = moment(date).format('X')
                }

                nearEarthObject.close_approach_data = closeApprochDate

                this.dataTable.nearEarthObjects.push(nearEarthObject)
              })
            }

            resolve(true)
          })
        } catch (error) {
          console.error('Asteroid:fetchAsteroids]', error)
          resolve(false)
        }
      })
    },
    getCloseApprochDate (closeApprochDate) {
      if (closeApprochDate) {
        return moment(moment.unix(closeApprochDate)).format('LLL')
      } else {
        return '-'
      }
    },
    getDate (date) {
      return moment(date).format('LL')
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
