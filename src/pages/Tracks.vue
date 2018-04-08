<template>
  <v-ons-page>
    <!--<p class="intro">
      This is a kitchen sink example that shows off the Vue bindings for Onsen UI.<br><br>
      <span>
        Access token: {{access_token}}
        Data: {{music_data}}
      </span>
    </p>-->

    <v-ons-list>
      <v-ons-list-header>Trouver vos chansons</v-ons-list-header>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="fa-play" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-search-input maxlength="20"
            placeholder="Saisir le nom de la chanson"
            v-model="track.name" @keyup="searchTrack()"
          >
          </v-ons-search-input>
        </label>
      </v-ons-list-item>
    </v-ons-list>

    
    <ul class="tracks-list">
       <li v-for="track in tracks" :key="track.id">
          <v-ons-card class="expandable">
            <img v-if="track.album && track.album.images.length > 0" class="track-image" :src="track.album.images[0].url" />
            <img v-else-if="selected_album && selected_album.images.length > 0" class="track-image" :src="selected_album.images[0].url" />
            <div class="title">{{ track.name }}</div>
            <div v-if="track.artists.length > 0" class="content">
              Artistes: <span v-for="(artist, index) of track.artists">{{ artist.name }}<span v-if="index < track.artists.length - 1">, </span></span>
            </div>
            <v-ons-button modifier="cta" style="margin: 6px 0" @click="loadLink(track.preview_url)">
              <v-ons-icon icon="fa-play" class="list-item__icon"></v-ons-icon>Écouter sur Spotify</v-ons-button>
          </v-ons-card>
          <br style="clear: both;">
       </li>
    </ul>
  </v-ons-page>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      track: {
        name: ""
      }
    };
  },

  methods: {
    push(page, key) {
      this.$store.commit('navigator/push', {
        extends: page,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Chansons',
              title: key
            }
          }
        }
      });
    },

    searchTrack() {

      if(this.track.name != "") {

        this.$store.dispatch('spotify/getTrackByName', this.track.name).then(data => {
          console.log(this.tracks)
        }, err => {
          console.log(err)
        })

      }
        
    },

    loadLink(url) {
      window.open(url, '_blank');
    }
  },

  created() {
    console.log(this.tracks)
  },

  computed: {
    ...mapGetters({tracks: 'spotify/getTracks', selected_album: 'spotify/getSelectedAlbum'})
  }

};
</script>

<style>
.intro {
  text-align: left;
  padding: 0 22px;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, .54);
}

ons-card {
  cursor: pointer;
  color: #333;
}

.card__title, .card--material__title {
  font-size: 20px;
}

.tracks-list {
  list-style-type: none;
  padding: 0;
}

.tracks-list .expandable {
  overflow: auto;
}

.tracks-list img {
  width: 20%;
  height: auto;
  margin-right: 10px;
  float: left;
  border-radius: 3px;
}

.card__title {
  margin-top: 0px;
  margin-top: 4px;
}

</style>
