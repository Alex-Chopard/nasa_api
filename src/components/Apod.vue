<template>
  <v-layout class="Apod" row wrap v-if="apod">
    <v-flex xs12>
      <v-card-text class="Apod-title" v-text="apod.title"></v-card-text>
      <v-flex class="Apod-content" xs12>
        <v-img
          v-if="apod.media_type === 'image'"
          max-height="80vh"
          :src="url"
          contain/>

          <iframe v-else-if="apod.media_type == 'video'" width="560" height="315" :src="apod.url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </v-flex>
      <v-layout row justify-space-between>

        <v-flex xs4>
          <v-switch
            v-model="useHdUrl"
            label="HD picure" />
        </v-flex>

        <v-flex xs4>
          <p class="Apod-date my-4" v-text="formatDate(apodDate)"></p>
        </v-flex>

        <v-flex xs4>
          <v-btn
            class="Apod-pickDate my-3"
            @click="openDialog"
            flat
            icon
          >
            <v-icon>event</v-icon>
          </v-btn>
        </v-flex>

      </v-layout>
      <p class="Apod-explanation" v-text="apod.explanation"></p>
    </v-flex>
    
    <!-- Dialog for pick a date -->

    <v-dialog
      v-model="displayDialog"
      max-width="290px"
    >
      <v-card>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker class="DatePicker" v-model="datePicked" :allowed-dates="allowedDates"></v-date-picker>
          </v-flex>
          <v-flex xs12>
            <v-layout row justify-space-between>

              <v-flex class="DatePicker-btn" xs6>
                <v-btn round @click="displayDialog = false">cancel</v-btn>
              </v-flex>

              <v-flex class="DatePicker-btn" xs6>
                <v-btn round @click="valideDate">done</v-btn>
              </v-flex>

            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
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
    this.setToolbarTitle('Astronomy Picture of the Day')
    this.fetchApod()
  },
  data () {
    return {
      apod: null,
      useHdUrl: false,
      apodDate: new Date().toISOString().substr(0, 10),
      displayDialog: false,
      datePicked: new Date().toISOString().substr(0, 10)
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
      fetch(endpoints.planetary.apod, { hd: this.useHdUrl, date: this.apodDate }).then(result => {
        console.log('[Apod:fetchApod] Result', result)
        if (result) {
          this.apod = result
        }
      })
    },
    openDialog () {
      console.log(`[Apod:openDialog]`)
      this.datePicked = this.apodDate
      this.displayDialog = true
    },
    valideDate () {
      console.log(`[Apod:valideDate] ${this.datePicked}`)
      this.apodDate = this.datePicked
      this.displayDialog = false

      this.fetchApod()
    },
    allowedDates (date) {
      return date <= new Date().toISOString().substr(0, 10)
    },
    formatDate (date) {
      return moment(date, 'YYYY-MM-DD').format('LL')
    },
    ...mapActions({
      setToolbarTitle: 'setTitle'
    })
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

<style scoped lang="scss">
.Apod {
  &-title {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
  }

  &-content {
    text-align: center;
  }

  &-date {
    text-align: center;
    font-weight: 500;
  }

  &-pickDate {
    margin-left: 88%;
  }

  &-explanation {
    text-align: justify;
  }
}

.DatePicker {
  box-shadow: none;

  &-btn {
    text-align: center;
  }
}
</style>
