<template>
  <v-ons-page>

    <v-ons-list>
      <v-ons-list-header>Trouver un artiste</v-ons-list-header>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="fa-headphones" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-search-input maxlength="20"
            placeholder="Saisir le nom de l'artiste"
            v-model="artist.name" @keyup="searchArtist()"
          >
          </v-ons-search-input>
        </label>
      </v-ons-list-item>
    </v-ons-list>

    
    <ul class="artists-list">
       <li v-for="artist in artists" :key="artist.id">
          <v-ons-card class="expandable">
            <img v-if="artist.images.length > 0" class="artist-image" :src="artist.images[0].url" />
            <div class="title">{{ artist.name }}</div>
            <div v-if="artist.genres.length > 0" class="content">Genres: <span v-for="(genre, index) of artist.genres">{{ genre }}<span v-if="index < artist.genres.length - 1">, </span></span> </div>
            <v-ons-button modifier="cta" style="margin: 6px 0" @click="fetchAlbums(artist)">Voir les albums</v-ons-button>
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
      artist: {
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
              backLabel: 'Artistes',
              title: key
            }
          }
        }
      });
    },

    searchArtist() {

      if(this.artist.name != "") {

        this.$store.dispatch('spotify/getArtistsByName', this.artist.name).then(data => {
          console.log(this.artists)
        }, err => {
          console.log(err)
        })

      }
        
    },

    fetchAlbums(artist) {

      if(artist.hasOwnProperty('id')) {
        this.$store.dispatch('spotify/getAlbumsByArtist', artist).then(res => {
          this.$store.commit('tabbar/set', 0);
        }, err => {

        })
      }

    }
  },

  created() {
    console.log('Store')
    this.$store.dispatch('auth/requestAccessToken').then(res => {}, err => {
      console.log(err)
    })
  },

  computed: {
    ...mapGetters({access_token: 'auth/getAccessToken', artists: 'spotify/getArtists'})
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

.artists-list {
  list-style-type: none;
  padding: 0;
}

.artists-list .expandable {
  overflow: auto;
}

.artists-list img {
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
