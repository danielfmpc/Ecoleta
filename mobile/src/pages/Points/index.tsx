import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Constants from "expo-constants";
import { Feather as Icon } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as Location from "expo-location";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  img: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  selectedUf: string,
  selectedCity: string
}

const Points = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItem, setSelectedItem] = useState<number[]>([]);
  const [initialPostion, sertInitialPosition] = useState<[number, number]>([0,0]);
  
  

  useEffect(
    () => {
      api.get('items').then(
        response => {
          setItems(response.data);
        }
      )
    }, []
  );
  
  useEffect(
    () => {
      async function loadPosition() {
        const {status} = await Location.requestPermissionsAsync();

        if(status != 'granted') {
          Alert.alert('Oooops...', 'Precisamos de sua permissão para ober a sua localização')
          return;
        }

        const location = await Location.getCurrentPositionAsync();
        const {latitude, longitude} = location.coords;

        sertInitialPosition([latitude, longitude]);
      }
      loadPosition();
    }, []
  );
  
  useEffect(
    ()=> {
      api.get('points', {
        params: {
          city: routeParams.selectedCity,
          uf: routeParams.selectedUf,
          items: selectedItem
        }
      }).then(response => {
        setPoints(response.data);
      })
    }, [selectedItem]
  );
  
  function handleSelectItem(id: number) {
    const alreadySelected = selectedItem.findIndex(item => item === id);
    if(alreadySelected>=0){
      const filterdItems = selectedItem.filter(item => item !== id);
      setSelectedItem(filterdItems);
    } else {
      setSelectedItem([...selectedItem, id]);
    }
  }

  function handleNavigateBack() {
    navigation.goBack();
  }
  
  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', {point_id: id});
  }
  return (
    <>
      <View style={styles.container} >
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" color="#34cb79" size={20} />
        </TouchableOpacity>  
        <Text style={styles.title} >
          Bem vindo.
        </Text>
        <Text style={styles.description} >
          Encontre no mapa um ponto de coleta.
        </Text>
        <View style={styles.mapContainer}>
          {
            initialPostion[0] !==  0 && (
              <MapView
                style={styles.map}
                loadingEnabled={initialPostion[0]===0}
                initialRegion={{
                  latitude: initialPostion[0],
                  longitude: initialPostion[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014,
                }}
              >
                {points.map(point => (
                  <Marker 
                    key={String(point.id)}
                    style={styles.mapMarker}
                    onPress={() => handleNavigateToDetail(point.id)}
                    coordinate={{
                      latitude: Number(point.latitude),
                      longitude: Number(point.longitude),
                    }}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image style={styles.mapMarkerImage} source={{uri: point.image_url}} />
                      <Text style={styles.mapMarkerTitle}>
                        {point.name}
                      </Text>
                    </View>
                  </Marker>
                ))}
              </MapView>
            )
          }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20}}
        >
          {items.map(item => (
            <TouchableOpacity 
             key={item.id} 
             style={[
              styles.item,
              selectedItem.includes(item.id) ? styles.selectedItem : {}
             ]} 
             onPress={() => handleSelectItem(item.id)}
             activeOpacity={0.5}
            >
              <SvgUri width={42} height={42} uri={item.image_url}/>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}          
        </ScrollView>        
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;