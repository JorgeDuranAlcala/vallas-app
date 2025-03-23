import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Alert } from 'react-native';
import MapView, { UrlTile, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import add from '../../assets/images/add2.jpg';

// Define a type for marker data
type MarkerData = {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  image: any; // You can make this more specific if needed
};

const MapContainer = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Define your markers in an array
  const markers: MarkerData[] = [
    {
      id: '1',
      coordinate: { latitude: 34.0522, longitude: -118.2437 },
      title: 'Los Angeles',
      description: 'City in California',
      image: add,
    },
    {
      id: '2',
      coordinate: { latitude: 10.4806, longitude: -66.9036 },
      title: 'Caracas',
      description: 'Capital of Venezuela',
      image: add,
    },
    {
      id: '3',
      coordinate: { latitude: 10.0689717, longitude: -69.3505807 },
      title: 'Barquisimeto',
      description: 'Capital of Lara State',
      image: add,
    },
    // You can add more markers here as needed
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied',
          [{ text: 'OK' }]
        );
        return;
      }
      
      try {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation || {
          latitude: 10.4806,
          longitude: -66.9036,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        padding={{ top: 50, bottom: 50, left: 50, right: 50 }}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {/* Render markers dynamically */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={(e) => {
              const { coordinate, position } = e.nativeEvent;
              console.log('Marker pressed:', marker.id, coordinate, position);
              setSelectedMarker({
                ...coordinate, // latitude and longitude
                x: position.x, // screen X coordinate
                y: position.y, // screen Y coordinate
              });
            }}
          >
            <Callout tooltip={true}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>{marker.description}</Text>
                <Image 
                  source={marker.image} 
                  style={styles.calloutImage}
                  onError={(e) => console.log(`Image error for ${marker.title}:`, e.nativeEvent.error)}
                />
              </View>
            </Callout>
          </Marker>
        ))}

       {/* Conditionally render an image above the selected marker */}
      {selectedMarker && (
        <View style={[styles.imageContainer, { top: selectedMarker.y, left: selectedMarker.x }]}>
          <Image source={add} style={styles.markerImage} />
        </View>
      )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  map: { 
    width: "100%", 
    height: "100%" 
  },
  calloutContainer: {
    alignItems: "center",
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 240,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  calloutImage: {
    width: 180,
    height: 140,
    resizeMode: "cover",
    borderRadius: 5,
  },
  markerImage: {
    width: 120,
    height: 180,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default MapContainer;

/*
import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  </head>
  <body>
    <div id="map" style="height: 100vh;"></div>
    <script>
      var map = L.map('map').setView([10.4806, -66.9036], 6);  // Centered on Caracas

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Markers
      var locations = [
        { coords: [34.0522, -118.2437], title: "Los Angeles", popup: "Welcome to LA!" },
        { coords: [10.4806, -66.9036], title: "Caracas", popup: "Capital of Venezuela" },
        { coords: [10.0689717, -69.3505807], title: "Barquisimeto", popup: "Capital of Lara State" }
      ];

      locations.forEach(loc => {
        L.marker(loc.coords).addTo(map)
          .bindPopup("<b>" + loc.title + "</b><br>" + loc.popup);
      });

    </script>
  </body>
  </html>
`;

const LeafletMap = () => {
  return (
    <View style={styles.container}>
      <WebView 
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default LeafletMap;
*/
