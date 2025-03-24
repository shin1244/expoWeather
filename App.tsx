import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather =async() => {
    const permission = await Location.requestForegroundPermissionsAsync()
    if(!permission) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
    console.log(latitude, longitude)

    const loaction = await Location.reverseGeocodeAsync({latitude, longitude})
    setCity(loaction[0].city ?? "Loading...")
  }

  useEffect(() => {
    getWeather();
  })

  return <View style={styles.container}>
    <View style={styles.city}>
      <Text style={styles.cityName}>{city}</Text>
    </View>
    <ScrollView 
      showsHorizontalScrollIndicator = {false}
      pagingEnabled
      horizontal 
      contentContainerStyle={styles.weather}
    >
      <View style={styles.day}>
        <Text style={styles.temp}>27</Text>
        <Text style={styles.description}>Sunny</Text>
      </View>
      <View style={styles.day}>
        <Text style={styles.temp}>27</Text>
        <Text style={styles.description}>Sunny</Text>
      </View>
      <View style={styles.day}>
        <Text style={styles.temp}>27</Text>
        <Text style={styles.description}>Sunny</Text>
      </View>
    </ScrollView>
  </View>
}

const styles = StyleSheet.create({
  container :{
    flex:1, 
    backgroundColor: "tomato",
  },
  city:{
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather:{
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp : {
    marginTop: 50,
    fontSize:178,
    fontWeight: "500",
  },
  description: {
    fontSize: 60,
    marginTop: -30,
  }
})