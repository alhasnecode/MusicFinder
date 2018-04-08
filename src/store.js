import auth_api from './api/auth'
import api from './api'
import config from './config'

export default {
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: [],
        options: {}
      },
      mutations: {
        push(state, page) {
          state.stack.push(page);
        },
        pop(state) {
          if (state.stack.length > 1) {
            state.stack.pop();
          }
        },
        replace(state, page) {
          state.stack.pop();
          state.stack.push(page);
        },
        reset(state, page) {
          state.stack = [page || state.stack[0]];
        },
        options(state, newOptions = {}) {
          state.options = newOptions;
        }
      }
    },

    splitter: {
      strict: true,
      namespaced: true,
      state: {
        open: false
      },
      mutations: {
        toggle(state, shouldOpen) {
          if (typeof shouldOpen === 'boolean') {
            state.open = shouldOpen;
          } else {
            state.open = !state.open;
          }
        }
      }
    },

    tabbar: {
      strict: true,
      namespaced: true,
      state: {
        index: 1
      },
      mutations: {
        set(state, index) {
          state.index = index;
        }
      }
    },

    auth: {
      strict: true,
      namespaced: true,
      state: {
        access_token: null
      },
      mutations: {
        setAccessToken: (state, at) => {
          state.access_token = at
        }
      },
      getters: {

        getAccessToken: (state) => {
          return state.access_token
        }

      },
      actions: {

        requestAccessToken: ({commit}) => {

          return auth_api.get('').then(res => {
            commit('setAccessToken', res.data.access_token)
            return Promise.resolve(res.data)
          }, err => {
            commit('setAccessToken', "CORS error")
            return Promise.reject(err)
          })

        }

      }
    },

    spotify: {
      strict: true,
      namespaced: true,

      state: {
        artists: [],
        selected_artist: null,
        tracks: [],
        selected_track: null,
        albums: [],
        selected_album: null
      },

      mutations: {

        setArtists: (state, artists_array) => {
          state.artists = artists_array
        },

        setSelectedArtist: (state, artist) => {
          state.selected_artist = artist
        },

        setAlbums: (state, albums_array) => {
          state.albums = albums_array
        },

        setSelectedAlbum: (state, album) => {
          state.selected_album = album
        },

        setTracks: (state, tracks_array) => {
          state.tracks = tracks_array
        },

        setSelectedTrack: (state, track) => {
          state.selected_track = track
        }

      },
      getters: {

        getArtists: (state) => {
          return state.artists
        },

        getSelectedArtist: (state) => {
          return state.selected_artist
        },

        getAlbums: (state) => {
          return state.albums
        },

        getSelectedAlbum: (state) => {
          return state.selected_album
        },

        getTracks: (state, tracks_array) => {
          return state.tracks
        },

        getSelectedTrack: (state, track) => {
          return state.track
        }

      },
      actions: {

        getArtistsByName: ({commit, state, rootState}, name) => {
          return api.get(`/search`, {
              headers: {
                  'Authorization': 'Bearer '+rootState.auth.access_token
              },
              params: {
                type: 'artist',
                q: name,
                limit: 6
              }
          }).then(res => {
            commit('setArtists', res.data.artists.items)
            return Promise.resolve(res.data.artists.items)
          }, err => {
            return Promise.reject(err)
          })
        },

        getAlbumByName: ({commit, state, rootState}, name) => {
          return api.get(`/search`, {
              headers: {
                  'Authorization': 'Bearer '+rootState.auth.access_token
              },
              params: {
                type: 'album',
                q: name,
                limit: 6
              }
          }).then(res => {
            commit('setAlbums', res.data.albums.items)
            return Promise.resolve(res.data.albums.items)
          }, err => {
            return Promise.reject(err)
          })
        },

        getTrackByName: ({commit, state, rootState}, name) => {
          return api.get(`/search`, {
              headers: {
                  'Authorization': 'Bearer '+rootState.auth.access_token
              },
              params: {
                type: 'track',
                q: name,
                limit: 6
              }
          }).then(res => {
            commit('setTracks', res.data.tracks.items)
            console.log(state.tracks)
            return Promise.resolve(res.data.tracks.items)
          }, err => {
            return Promise.reject(err)
          })
        },

        getAlbumsByArtist ({commit, state, rootState}, artist) {
          let real_artist = state.artists.find(a => a.id == artist.id)

          if(real_artist != undefined) {
            commit('setSelectedArtist', artist)
            return api.get(`/artists/${artist.id}/albums`, {
                headers: {
                    'Authorization': 'Bearer '+rootState.auth.access_token
                },
                params: {
                  limit: 50
                }
            }).then(res => {
              commit('setAlbums', res.data.items)
              return Promise.resolve(res.data.items)
            }, err => {
              return Promise.reject(err)
            })
          }

          return Promise.reject('Artist not valid')
        },

        getTracksByAlbum ({commit, state, rootState}, album) {
          let real_album = state.albums.find(a => a.id == album.id)

          if(real_album != undefined) {
            commit('setSelectedAlbum', album)
            return api.get(`/albums/${album.id}/tracks`, {
                headers: {
                    'Authorization': 'Bearer '+rootState.auth.access_token
                },
                params: {
                  limit: 50
                }
            }).then(res => {
              commit('setTracks', res.data.items)
              return Promise.resolve(res.data.items)
            }, err => {
              return Promise.reject(err)
            })
          }

          return Promise.reject('Album not valid')
        }

      }
    }

  }
};
