const clientId = '#';
const redirectURI = 'http://localhost:3000';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);  
    
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;  
    
    } else {
      window.location = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      } 
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    })
  },

  savePlaylist(playlistName, playlistURIs) {
    if (!playlistName || !playlistURIs.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken()
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userID;

    return fetch(`https://api.spotify.com/v1/me`, {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userID = jsonResponse.id; 
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: headers, 
        method: 'POST',
        body: JSON.stringify({name: playlistName, description:'My playlist from Jammming', public: true})})
    }).then(response => response.json()
    ).then(jsonResponse => {
      let playlistID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({uris: playlistURIs})}
      )
    }).then(alert('Playlist Saved'))
  }
}
 
export default Spotify;
