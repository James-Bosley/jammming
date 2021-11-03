import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'; 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults:[{title:'Mr Brightside', artist:'The Killers', album:'Hot Fuss', id:1, uri:'foiefijoacslk'},{title:'New Born', artist:'Muse', album:'Origin of Symmetry', id:2, uri:'ih'}],
      playlistName:'',
      playlistTracks:[]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term) {
    Spotify.search(term).then(results => {
      this.setState({searchResults: results})
    })
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(existingTrack => existingTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let newTracks = []
    tracks.forEach(playlistTrack => {
      if (playlistTrack.id !== track.id) {
        newTracks.push(playlistTrack)
      }
    })
    this.setState({playlistTracks: newTracks});
  }

  updatePlaylistName(newName) {
    this.setState({playlistName: newName})
  }

  savePlaylist() {
    let TrackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    return TrackURIs;
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
