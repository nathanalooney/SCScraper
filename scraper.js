const request = require('request');
const ffmetadata = require('request');
const fs = require('fs');

client_id = 'client_id=0b6acabf19f39d3eab148ff23b8cd57e'
song_url = 'https://soundcloud.com/lnymsc'
request.get('http://api.soundcloud.com/resolve?url='+song_url+'&'+client_id, function(err, response, data) {
	if (err) {
		console.log(err);
	} else {
		var user = JSON.parse(data);
		getFavorites(user.id);
	}
});

var getFavorites = function(id) {
	request.get('http://api.soundcloud.com/users/'+id+'/favorites?'+client_id+'&linked_partitioning=1', function(err, response, data) {
		if (err) {
			console.log(err);
		} else {
			var response_object = JSON.parse(data);
			var favorites = response_object.collection;
			var next_href = favorites.next_href;
			console.log(favorites.length);
			startDownloads(favorites);
		}
	});
}

var startDownloads = function(favorites) {
	var count = 0;
	var downloadInterval = setInterval(function() {
		if (favorites[count].stream_url) {
			request.get(favorites[count].stream_url+'?'+client_id).pipe(fs.createWriteStream('songs/'+favorites[count].title+'.mp3'));			
		}
		count += 1;
		if (count == favorites.length) clearInterval(downloadInterval);
	}, 1000);

}