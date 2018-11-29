import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: '', albumArt: '' },
      queuedSongs: {1: {name: 'Space Cadet', uri: 'spotify:track:5gub2bpJRgJP4m4MliqtdV' },
                    2: {name: 'Overdue', uri: 'spotify:track:2mYDDUkBcgFNBqkWctyyuc'}}
      
    }
    }
  

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlayingTrack()
      .then((response) => {
        if(response) {
          this.setState({
            nowPlaying: { 
                name: response.item.name, 
                albumArt: response.item.album.images[0].url,
              }
          });
        }
      })
  }

  // playSong(song) {
  //   console.log('test')
  //   spotifyApi.play(
  //     {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]}
  //   );
  // }

  togglePlay() {
    // this.isSongPlaying()
    // .then((isPlaying) => {
    //   if(isPlaying) {
    //     spotifyApi.play();
    //   }
    //   else {
    //     spotifyApi.pause()
    //   }
    // });
    // this.getNowPlaying();
    spotifyApi.getMyCurrentPlayingTrack()
      .then((response) => {
        if(response) {
          console.log(response.is_playing)
          if(response.is_playing) {
            spotifyApi.pause();
          }
          else {
            spotifyApi.play();
          }
          this.getNowPlaying()
        }
      });
  }

  SongList() {
    var songList = [];
    for(var id in this.state.queuedSongs) {
      console.log(this.state.queuedSongs[id]['name'])
      songList.push(<li>
        {this.state.queuedSongs[id]['name']}
      </li>)
    }

    return (
      <ul>{songList}</ul>
    );
  }

  render() {
    return (
      <div className="App">
        { this.state.loggedIn ?
          <Fragment>
            <div>
              Now Playing: { this.state.nowPlaying.name }
            </div>
            <div>
              <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
            </div>
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </button>
            <button onClick={() => this.togglePlay()}>
              Play/Pause
            </button>
            {this.SongList()}
          </Fragment>:
          <a href='http://localhost:8888' > Login to Spotify </a>
        }
        
      </div>


    );
  }
}

export default App;
