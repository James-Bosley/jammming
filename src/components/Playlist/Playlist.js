import React from 'react';
import './Playlist.css'; 
import {TrackList} from '../TrackList/TrackList';

export class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.updateName = this.updateName.bind(this);
  }

  updateName(event) {
    let newName = event.target.value;
    this.props.onNameChange(newName);
  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={'New Playlist'} onChange={this.updateName}/>
        <TrackList searchResults={this.props.playlistTracks} onRemove={this.props.onRemove}/>
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    );
  }
}
