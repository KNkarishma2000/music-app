import React from 'react';
import './App.css';
import Playlist from './components/Playlist/Playlist';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Spotify from './components/uitl/Spotify';
import Track from './components/Track/Track';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };

    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.removeTrackSearch = this.removeTrackSearch.bind(this);
    this.doThese = this.doThese.bind(this);
  }

  search(term) {
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  }

 addTrack(track) {
  let tracks = this.state.playlistTracks;
  if (tracks.find(savedTrack => savedTrack.id === track.id)) {
    return;
  }
  tracks.push(track);

  let searchResults = this.state.searchResults;
  searchResults = searchResults.filter(
    currentTrack => currentTrack.id !== track.id
  );

  this.setState({
    playlistTracks: tracks,
    searchResults: searchResults,
  });
}

  
  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id)
    });
  }
  

  removeTrackSearch(track) {
    let tracks = this.state.searchResults;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ searchResults: tracks });
  }

  doThese(track) {
    this.addTrack(track);
    this.removeTrackSearch(track);
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }
  
  savePlaylist() {
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
  
    // Check if there are tracks in the playlist before attempting to save
    if (!trackUris.length) {
      console.log("Playlist is empty. Add tracks before saving.");
      return;
    }
  
    Spotify.savePlaylist(this.state.playlistName, trackUris)
      .then(() => {
        // Clear the playlist after saving
        this.setState({
          playlistName: "New Playlist",
          playlistTracks: []
        });
      })
      .catch((error) => {
        console.error("Error saving playlist:", error);
      });
  }
  

  render() {
    return (
      <div className='App-header'>
        <h1>
          <a href="http://localhost:3000">Musicophile</a>
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search}></SearchBar>
          <div className="App-playlist">
          <SearchResults
  searchResults={this.state.searchResults}
  onAdd={this.addTrack}
  // other props
/>

<Playlist
  playlistTracks={this.state.playlistTracks}
  onRemove={this.removeTrack}
  onSave={this.savePlaylist}
  onNameChange={this.updatePlaylistName}
  // other props
/>

            
          </div>
        </div>
      </div>
    );
  }
}

export default App;
