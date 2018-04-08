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
      <v-ons-list-header>Trouver vos albums</v-ons-list-header>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="fa-music" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-search-input maxlength="20"
            placeholder="Saisir le nom de l'album"
            v-model="album.name" @keyup="searchAlbum()"
          >
          </v-ons-search-input>
        </label>
      </v-ons-list-item>
    </v-ons-list>

    
    <ul class="albums-list">
       <li v-for="album in albums" :key="album.id">
          <v-ons-card class="expandable">
            <img v-if="album.images.length > 0" class="album-image" :src="album.images[0].url" />
            <div class="title">{{ album.name }}</div>
            <div v-if="album.artists.length > 0" class="content">Artistes: <span v-for="(artist, index) of album.artists">{{ artist.name }}<span v-if="index < album.artists.length - 1">, </span></span> </div>
            <v-ons-button modifier="cta" style="margin: 6px 0" @click="fetchTracks(album)">Voir les pistes</v-ons-button>
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
      album: {
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
              backLabel: 'Albums',
              title: key
            }
          }
        }
      });
    },

    searchAlbum() {

      if(this.album.name != "") {

        this.$store.dispatch('spotify/getAlbumByName', this.album.name).then(data => {
          console.log(this.albums)
        }, err => {
          console.log(err)
        })

      }
        
    },

    fetchTracks(album) {

      if(album.hasOwnProperty('id')) {
        this.$store.dispatch('spotify/getTracksByAlbum', album).then(res => {
          this.$store.commit('tabbar/set', 2);
        }, err => {

        })
      }

    }
  },

  created() {

  },

  computed: {
    ...mapGetters({albums: 'spotify/getAlbums'})
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

.albums-list {
  list-style-type: none;
  padding: 0;
}

.albums-list .expandable {
  overflow: auto;
}

.albums-list img {
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
