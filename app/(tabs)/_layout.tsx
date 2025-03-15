import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Platform, Image, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../assets/images/logo.jpg';
import banner from '../../assets/images/imprime.png';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#fd0100',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 2,
          borderTopColor: '#fff',
          paddingBottom: Platform.OS === 'ios' ? 15 : 10,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5, // Android shadow
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#ffb3b3',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      
       {/* HOME */}
       <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: () => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 10,
            }}>
              <Image
                source={logo}
                style={{ width: 120, height: 60, resizeMode: 'contain' }}
              />
              <Image
                source={banner}
                style={{ width: 120, height: 60, borderRadius: 10, resizeMode: 'contain' }}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fd0100',
  height: 100,
  borderBottomWidth: 2,
  borderBottomColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5, // Android shadow
          },
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      {/* SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          headerTitle: ({ children }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={logo}
                style={{ width: 100, height: 40, resizeMode: 'contain', marginRight: 10 }}
              />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                {children}
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fd0100',
            height: 100,
            borderBottomWidth: 2,
            borderBottomColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // Android shadow
          },
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />

      {/* BILLBOARDS */}
      <Tabs.Screen
        name="vallas"
        options={{
          title: 'Vallas',
          headerTitle: ({ children }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={logo}
                style={{ width: 100, height: 40, resizeMode: 'contain', marginRight: 10 }}
              />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                {children}
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fd0100',
            height: 100,
            borderBottomWidth: 2,
            borderBottomColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // Android shadow
          },
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="image" size={size} color={color} />
          ),
        }}
      />

      {/* ADS */}
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          headerTitle: ({ children }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={logo}
                style={{ width: 100, height: 40, resizeMode: 'contain', marginRight: 10 }}
              />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                {children}
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fd0100',
            height: 100,
            borderBottomWidth: 2,
            borderBottomColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // Android shadow
          },
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="bullhorn" size={size} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: ({ children }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={logo}
                style={{ width: 100, height: 40, resizeMode: 'contain', marginRight: 10 }}
              />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                {children}
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fd0100',
            height: 100,
            borderBottomWidth: 2,
            borderBottomColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // Android shadow
          },
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}