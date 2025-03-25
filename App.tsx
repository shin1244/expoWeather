import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'; 
import { Fontisto } from "@expo/vector-icons"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const API_KEY = "3d4176a6d062cf82e448aab11e18d053"

  const icons = {
    Clouds: "cloudy", 
    Clear: "day-sunny",
    Snow: "snow",
    Rain: "rains",
    Drizzle:"rain",
    Thunderstorm: "lightning",
  }

  const getWeather =async() => {
    const permission = await Location.requestForegroundPermissionsAsync()
    if(!permission) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})

    const loaction = await Location.reverseGeocodeAsync({latitude, longitude})
    setCity(loaction[0].city ?? "Loading...")
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(
      json.list.filter((weather: any) => {
        if (weather.dt_txt.includes("00:00:00")) {
          return weather
        }
      })
    )
  }

  useEffect(() => {
    getWeather();
  }, [])

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
    {days.length === 0 ? 
    (<View style={styles.day}>
      <ActivityIndicator color="white" size="large" style= {{marginTop: 10}} />
    </View>) : (
      days.map((day, index) => 
      <View key= {index} style={styles.day}>

        <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
        
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Text style={styles.description}>{day.weather[0].main}</Text>
        <Fontisto style={{marginLeft:20}} name={icons[day.weather[0].main]} size={68} color="white" />
        </View>
        <Text style={styles.tinyText}>{day.weather[0].description}</Text>
      </View>
    )
    )}
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
    color: "white",
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
    color: "white",
    fontWeight: "500",
  },
  description: {
    fontSize: 60,
    color: "white",
    marginTop: -30,
  },
  tinyText: {
    fontSize:20,
    color: "white",
  }
})