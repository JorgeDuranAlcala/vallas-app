import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Button, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

const categories = [
  { id: '1', name: 'Vehicles', icon: 'car-outline' },
  { id: '2', name: 'Property', icon: 'home-outline' },
  { id: '3', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '4', name: 'Furniture', icon: 'bed-outline' },
  { id: '5', name: 'Jobs', icon: 'briefcase-outline' },
  { id: '6', name: 'Services', icon: 'construct-outline' },
];

const featuredAds = [
  {
    id: '1',
    title: '2022 Tesla Model 3',
    price: '$45,000',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title: 'Luxury Apartment',
    price: '$2,500/mo',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title: 'MacBook Pro M1',
    price: '$1,200',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60',
  },
];

export interface IValla {
  id: number
  nombre: string
  imagenUrl: string
  price: number
}

export interface IAviso {
  id: number
  tipo: string
  material: string
  precio: string
  descripcion: string
  fechaCreacion: string
  imagenUrl: string
}


export default function Browse() {

  const [vallas, setVallas] = useState<IValla[]>([])
  const [avisos, setAvisos] = useState<IAviso[]>([])
  const [loading, setLoading] = useState({
    vallas: false,
    avisos: false
  })

  useEffect(() => {
    (async () => {
      setLoading(prev => ({
        ...prev,
        vallas: true,
      }));
      await fetch('https://vallas-publicitaria.onrender.com/vallas')
        .then(response => response.json())
        .then(json => {
          setVallas(json)
          console.log(json)
        })
        .catch(error => console.error(error))
        .finally(() =>       setLoading(prev => ({
          ...prev,
          vallas: false,
        })))

        setLoading(prev => ({
          ...prev,
          avisos: true,
        }))
      await fetch('https://vallas-publicitaria.onrender.com/avisos')
      .then(response => response.json())
      .then(json => {
          setAvisos(json)
          console.log(json)
        })
      .catch(error => console.error(error))
      .finally(() =>       setLoading(prev => ({
        ...prev,
        avisos: false,
      })))
    })()
  }, [])

  const renderCategory = ({ item }: {item: any}) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={24} color="#007AFF" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedAd = ({ item: {
    nombre,
    imagenUrl,
    price
  } }: { item: IValla }) => (
    <TouchableOpacity style={styles.adCard}>
      <Image source={{ uri: imagenUrl }} style={styles.adImage} />
      <View style={styles.adInfo}>
        <Text style={styles.adTitle}>{nombre}</Text>
        <Text style={styles.adPrice}>{price}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAviso = ({ item: {
    tipo,
    material,
    precio,
    descripcion,
    fechaCreacion,
    imagenUrl
  } }: { item: IAviso }) => (
    <TouchableOpacity style={styles.adCard}>
      <Image source={{ uri: imagenUrl }} style={styles.adImage} />
      <View style={styles.adInfo}>
        <Text style={styles.adTitle}>{tipo}</Text>
        <Text style={styles.adPrice}>{material}</Text>
        <Text style={styles.adPrice}>{precio}</Text>
        <Text style={styles.adPrice}>{descripcion}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.featuredSection}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
          alignItems: 'center'
        }}>
          <Text style={styles.sectionTitle}>Vallas publicitarias</Text>
          <TouchableOpacity onPress={() => router.push('/vallas')} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
{   !loading.vallas  ? <FlatList
          data={vallas.reverse().slice(0, 5)}
          renderItem={renderFeaturedAd}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        /> : (
          <ActivityIndicator size="large"  color="#007AFF" />
        )}
      </View>

      <View style={styles.recentSection}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
            alignItems: 'center'
          }}>
            <Text style={styles.sectionTitle}>Avisos</Text>
            <TouchableOpacity onPress={() => router.push('/avisos')} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          {   !loading.avisos  ? <FlatList
            data={avisos.reverse().slice(0, 5)}
            renderItem={renderAviso}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          /> : (
            <ActivityIndicator size="large"  color="#007AFF" />
          )}
      </View>
      <View style={styles.socialSection}>
  <Text style={styles.sectionTitle}>Contactanos</Text>
  <View style={styles.socialIcons}>
    <TouchableOpacity 
      style={styles.socialButton}
      onPress={() => Linking.openURL('https://instagram.com/victorcamacaro1999')}
    >
      <Ionicons name="logo-instagram" size={24} color="#E1306C" />
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.socialButton}
      onPress={() => Linking.openURL('https://facebook.com/yourpage')}
    >
      <Ionicons name="logo-facebook" size={24} color="#4267B2" />
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.socialButton}
      onPress={() => Linking.openURL('https://wa.me/+584267472630')}
    >
      <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
    </TouchableOpacity>
  </View>
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  seeAllButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1c1c1e',
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#1c1c1e',
    textAlign: 'center',
  },
  featuredSection: {
    padding: 16,
  },
  featuredList: {
    paddingRight: 16,
  },
  adCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  adInfo: {
    padding: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  adPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  recentSection: {
    padding: 16,
  },
  recentAdCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentAdImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  recentAdInfo: {
    flex: 1,
    padding: 12,
  },
  socialSection: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 10
  },
  socialButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});