import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather as Icon } from "@expo/vector-icons";
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {Picker} from '@react-native-community/picker';

interface IBGEUFRespone {
  sigla: string;
}

interface IBGECityRespone {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();
  
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  

  useEffect(
    () => {
      axios.get<IBGEUFRespone[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(
        response => {
          const ufInitials = response.data.map(uf => uf.sigla);
          setUfs(ufInitials);          
            
        }
      );
    }, 
    []
  );
  
  useEffect(
    () => {
      if(selectedUf === '0'){
        return;
      }
      axios.get<IBGECityRespone[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(
        response => {          
          const cityName = response.data.map(city => city.nome);
          setCities(cityName);          
        }
      );
    }, 
    [selectedUf]
  );

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    });
  }


  return (    
    <KeyboardAvoidingView style={{flex: 1}} >
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu Marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
            </Text>
          </View>
        </View>
        <View style={styles.footer}>                      
          <View style={styles.select}>
            <Picker
              selectedValue={selectedUf}
              itemStyle={styles.selectItem}
              onValueChange={(itemValue) => setSelectedUf(itemValue.toString())}
            >
              <Picker.Item label="Selecione UF" value="0" />
              {ufs.map(uf=>(
                <Picker.Item key={uf} label={uf} value={uf} />
              ))}
            </Picker>
          </View>
          <View style={styles.select}>
            <Picker          
              selectedValue={selectedCity}
              onValueChange={(itemValue) => setSelectedCity(itemValue.toString())}
            >
              <Picker.Item  label="Selecione a Cidade" value="0" />
              {cities.map(city=>(
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>     
          

          <RectButton 
            style={styles.button} 
            onPress={handleNavigateToPoints}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},
  
  
  selectItem: {
    backgroundColor:"red"
  },

  select: {
    fontSize: 16,
    borderWidth: 1,
    backgroundColor:'#FFF',
    borderColor: '#FFF',
    marginBottom: 8,
    borderRadius: 10,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;