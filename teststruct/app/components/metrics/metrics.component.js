angular.module('metrics', []).component('metrics', {
	templateUrl: 'app/components/metrics/metrics.template.html',
	controller: function metricsController($http){
		this.test = 'this is a test';
		
		$http.get('/top-tracks').then(response => {
			console.log('got tracks', response.data.items)
			this.topTracks = response.data.items.slice(0,20);
		})
		$http.get('/top-artists').then(response => {
			this.topArtists = response.data.items.slice(0,20);
		})
		$http.get('/recently-played').then(response => {
			this.recentlyPlayed = response.data.items;
		})
		$http.get('/top-artists50').then(response => {
			this.recentlyPlayed = response.data.items;
		})
		$http.get('/top-tracks50').then(response => {
			console.log('got tracks', response.data.items)
			this.topTracks50 = response.data.items;
		})
		// Load google charts
    
    $http.get('/top-tracks50').then(response => {
      var trackPop = [0, 0, 0, 0, 0]
      response.data.items.forEach(track => {
        trackPop[Math.floor(track.popularity / 20)]++;
      })

      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Very Popular', trackPop[4]],
          ['Popular', trackPop[3]],
          ['Average', trackPop[2]],
          ['Underground', trackPop[1]],
          ['Very Underground', trackPop[0]]
        ]);

        var options = {
          title: 'Track Popularity'
        };
        var chart = new google.visualization.PieChart(document.getElementById('popularity'));
        chart.draw(data, options);
      });
    })

    $http.get('/top-tracks50').then(response => {
      // console.log(response)
      
      var exp=0;
      var clean = 0;
      response.data.items.forEach(track => {
        if(track.explicit == true){
          exp++;
        }else{
          clean++;
        }
      })
      // Draw the chart and set the chart values
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(
          [
            ['Task', 'Hours per Day'],
            ['explicit', Number(exp)],
            ['clean', Number(clean)]
          ]
        );
        var options = {
          title: 'Explicit or Not?'
        };

        var chart = new google.visualization.PieChart(document.getElementById('expl'));

        chart.draw(data, options);
      });
    })

    $http.get('/top-artists50').then(response => {
      var artistPop = [0, 0, 0, 0, 0]
      response.data.items.forEach(artist => {
        artistPop[Math.floor(artist.popularity / 20)]++;
      })
      // Draw the chart and set the chart values
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(function(){      
        var data = google.visualization.arrayToDataTable(
          [
            ['Task', 'Hours per Day'],
            ['Very Popular', artistPop[4]],
            ['Popular', artistPop[3]],
            ['Average', artistPop[2]],
            ['Underground', artistPop[1]],
            ['Very Underground', artistPop[0]]
          ]
        );
        var options = {
          title: 'Artist Popularity'
        };

        var chart = new google.visualization.PieChart(document.getElementById('ArtPop'));

        chart.draw(data, options);
      })
    })
    $http.get('/top-tracks50').then(response => {
      // console.log(response)
      
      var times = [0, 0, 0, 0, 0, 0, 0, 0]
      response.data.items.forEach(track => {
        times[Math.floor(track.duration_ms / 60000)]++;
      })
      // Draw the chart and set the chart values
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(function(){
        data = google.visualization.arrayToDataTable(
          [
            ['Task', 'Hours per Day'],
            ['>7 minutes', times[7]],
            ['6 minutes', times[6]],
            ['5 minutes', times[5]],
            ['4 minutes', times[4]],
            ['3 minutes', times[3]],
            ['2 minutes', times[2]],
            ['1 minute', times[1]],
            ['<1 minutes', times[0]]
          ]
        );
        var options = {
          title: 'Track Length'
        };

        var chart = new google.visualization.PieChart(document.getElementById('length'));

        chart.draw(data, options);
      });      
    })
    $http.get('/top-artists50').then(response => {
      var genres = {};
      response.data.items.forEach(artist => {
        artist.genres.forEach(genre => {
          if(genres[genre]){
            genres[genre]++;
          }else{
            genres[genre] = 1;
          }
        })
      })
      var topGenres = Object.keys(genres)
        .map(function(key) {
          return [key, genres[key]];
        })
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      topGenres.unshift(['blank', 'test']);
      // Draw the chart and set the chart values
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(topGenres);
        var options = {
          title: 'Genres'
        };

        var chart = new google.visualization.PieChart(document.getElementById('Genres'));

        chart.draw(data, options);
      })
    })

    
    var tracks = document.getElementById('top-tracks')
    var artists = document.getElementById('top-artists')
    var rec = document.getElementById('recently-played')
    var pop = document.getElementById('popularity-avg')
    var recs = document.getElementById('recent')
    $http.get('/top-artists').then(response => {
      console.log(response);
      var count = 1;
      artistHtml = ''
      response.data.items.forEach(artist => {
        artistHtml += '<li class=\"list-group-item\">';
        artistHtml += '<img src="' + artist.images[2].url + '" alt="album art" width="32" height="32">' +"  ";
        artistHtml += count + ': ' + artist.name;
        // artistHtml += ' Genre: ' + artist.genres[0];
        artistHtml += '</li>';
        count++;
      })
      artists.innerHTML = artistHtml;
    })

    $http.get('/top-tracks').then(response => {
      console.log(response)
      var trackHtml = '';
      var count = 1;
      response.data.items.forEach(track => {
        trackHtml += '<li class=\"list-group-item\">';
        trackHtml+='<img src="' + track.album.images[2].url + '" alt="album art" width="32" height="32">' +"  ";
        trackHtml+= count + ': ' + track.name;
        trackHtml += ' Album: ' + track.album.name;
        trackHtml += ' Artist: ' + track.artists[0].name;
        if(track.artists[1] !==null && track.artists[1] != undefined)
              {
                trackHtml +=", " +track.artists[1];
                if(track.artists[2] !==null && track.artists[2] != undefined)
                {
                  trackHtml +=", " +track.artists[2].name;
                }
              }
        trackHtml += '</li>';
        count++;
      })
      tracks.innerHTML = trackHtml;

    })
    $http.get('/recently-played').then(response => {

      console.log(response)
      var recHtml = '';
      var count = 1;
      console.log('1', response.data.items)
      response.data.items.sort(function(a,b){
        var nameA = a.played_at.toUpperCase(); // ignore upper and lowercase
        var nameB = b.played_at.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
      })
        console.log('2', response.data.items)

      response.data.items.forEach(item => {
          recHtml += '<li class=\"list-group-item\">';
          recHtml+='<img src="' + item.track.album.images[2].url + '" alt="album art" width="32" height="32">' +"  ";
          recHtml+= count + ': ' + item.track.name + ": " + item.track.artists[0].name;
          if(item.track.artists[1] !==null && item.track.artists[1] != undefined)
          {
            recHtml +=", " +item.track.artists[1];
            if(item.track.artists[2] !==null && item.track.artists[2] != undefined)
            {
              recHtml +=", " +item.track.artists[2];
            }
          }
          // recHtml += ' Album: ' + item.album.name;
          recHtml += '</li>';
          count++;
      })

      rec.innerHTML = recHtml;
    })
	}
})