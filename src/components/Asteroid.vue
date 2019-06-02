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
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pagination.currentLoaded"></v-pagination>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
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
          { text: 'Asteroid', align: 'left', value: 'name' },
          { text: 'Designation', align: 'right', value: 'designation' }
        ],
        nearEarthObjects: []
      },
      loading: false
    }
  },
  watch: {
    async 'pagination.page' () {
      if (this.pagination.page > this.pagination.currentLoaded - 10) {
        this.loading = 'warning'
        for (var i = 0; i < 50; i++) {
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
              this.dataTable.nearEarthObjects.push(...result.near_earth_objects)
            }

            resolve(true)
          })
        } catch (error) {
          console.error('Asteroid:fetchAsteroids]', error)
          resolve(false)
        }
      })
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
