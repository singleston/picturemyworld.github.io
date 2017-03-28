/* global google */
/* global MarkerClusterer */
// eslint-disable-next-line no-unused-vars
var jekyllMaps = (function () {
  'use strict'
  var clusterSettings = {}
  var clusterReady = false
  var mapReady = false
  var options = {}
  var data = []
  var maps = []

  return {
    initializeMap: initializeMap,
    initializeCluster: initializeCluster,
    register: register
  }

  /**
   * Setup Google Maps options and call renderer.
   */
  function initializeMap () {
    options = {
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      streetViewControl: false,
      center: new google.maps.LatLng(0, 0)
    }
    mapReady = true
    render(getDefaultMarkerId())
  }

  /**
   * Register map data to be rendered once Google Maps API is loaded.
   *
   * @param string id
   * @param Array locations
   * @param Object settings
   */
  function register (id, locations, options) {
    data.push({ id: id, locations: locations, options: options })
    render(getDefaultMarkerId())
  }

  function getDefaultMarkerId() {
    var queryString = getQueryString()
    return queryString["p"]
  }

  function getQueryString() {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    } 
    return query_string;
  }

  /**
   * Render maps data if Google Maps API is loaded.
   */
  function render(defaultMarkerId) {
    if (!mapReady) { return }

    while (data.length > 0) {
      var item = data.pop()
      var bounds = new google.maps.LatLngBounds()
      var mapOptions = Object.assign({}, options, item.options)
      var map = new google.maps.Map(document.getElementById(item.id), mapOptions)
      var infoWindow = new google.maps.InfoWindow()
      var markers = item.locations.map(createMarker)

      var selectedMarker = undefined
      markers.map( function(item) {
        if (defaultMarkerId != undefined && item.image != undefined && item.image.endsWith(defaultMarkerId) == true) {
          selectedMarker = item
        }
      })

      map.fitBounds(bounds)

      google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        if (this.customZoom) this.setZoom(this.customZoom)
      })

      google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        // this part runs when the mapobject is created and rendered
        if (selectedMarker != undefined) {
          this.setCenter(selectedMarker.position)
          this.setZoom(this.customMarkerZoom)
          google.maps.event.trigger(selectedMarker, 'click', {});
        }
      });

      if (mapOptions.useCluster) {
        maps.push({ map: map, markers: markers })
        processCluster()
      }
    }

    function createMarker (item) {
      var date = moment(item.date, "YYYY-MM-DD HH:mm:ss Z")
      var position = new google.maps.LatLng(item.latitude, item.longitude)
      var marker = new google.maps.Marker({
        position: position,
        title: item.title,
        image: item.image,
        caption: item.caption,
        date: date.format('MMMM DD, YYYY'),
        location: item.location,
        map: map
      })

      bounds.extend(position)
      if (mapOptions.showMarkerPopup) {
        marker.addListener('click', markerPopup)
      }

      return marker
    }

    function markerPopup () {
      var contentString = '<div>'
      contentString += '<img src="/img/thumb/' + this.image + '" alt="' + this.title + '"/>'
      contentString += '<div class="data-container">'
      contentString += '<h3>' + this.title + '</h3>'
      contentString += '<i class="fa fa-globe" aria-hidden="true" id="onMapIcon"></i>'
      contentString += '<p class="location-text">' + this.location + '</p>'
      contentString += '<p>' + this.caption + '</p>'
      contentString += '<p class="post-date">' + this.date + '</p>'
      contentString += '</div></div>'
      infoWindow.setContent(contentString)
      infoWindow.open(map, this)
    }
  }

  function initializeCluster (settings) {
    clusterReady = true
    clusterSettings = settings || {}
    processCluster()
  }

  function processCluster () {
    if (!clusterReady) return

    while (maps.length > 0) {
      var obj = maps.pop()
      // eslint-disable-next-line no-new
      new MarkerClusterer(obj.map, obj.markers, {
        gridSize: clusterSettings.grid_size || 25,
        imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'
      })
    }
  }
}())

/* Object.assign polyfill */
if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    'use strict'
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    target = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[ index ]
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[ key ] = source[ key ]
          }
        }
      }
    }
    return target
  }
}
