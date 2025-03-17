import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity, FlatList, ActivityIndicator, Linking, Dimensions, RefreshControl } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import add from '../../assets/images/add.jpeg';
import banner from '../../assets/images/banner1.jpeg';
import image1 from '../../assets/images/p1.jpeg';
import image2 from '../../assets/images/p2.jpeg';
import image3 from '../../assets/images/p3.jpeg';
import image4 from '../../assets/images/p4.jpeg';  
import { AdType, useAdvertisements } from '@/hooks/useAd';

export interface IValla {
  id: number;
  nombre: string;
  imagenUrl: string;
  price: number;
  ubicacion:string;
  ciudad:string;
  estado:string;
}

export interface IAviso {
  id: number;
  tipo: string;
  material: string;
  precio: string;
  descripcion: string;
  fechaCreacion: string;
  imagenUrl: string;
  ubicacion:string;
}


const mostSoldCartParts = [
  {
    id: '1',
    name: 'Brake Pads',
    price: 49.99,
    soldCount: 1245,
    icon: 'car-outline',
    color: '#2563eb',
    image: image1, // Brake pads image
    isLocal:true
  },
  {
    id: '2',
    name: 'Oil Filter',
    price: 15.99,
    soldCount: 987,
    icon: 'filter-outline',
    color: '#10b981',
    image: image2, // Oil filter image
    isLocal:true
  },
  {
    id: '3',
    name: 'Battery',
    price: 89.99,
    soldCount: 756,
    icon: 'battery-charging-outline',
    color: '#f43f5e',
    image: image3,// Battery image
    isLocal:true
  },
  {
    id: '4',
    name: 'Air Filter',
    price: 24.99,
    soldCount: 623,
    icon: 'funnel-outline',
    color: '#8b5cf6',
    image:image4, // Air filter image
    isLocal:true
  }
];


export default function Browse() {
  //const [vallas, setVallas] = useState<IValla[]>([]);
  //const [avisos, setAvisos] = useState<IAviso[]>([]);
  //const [loading, setLoading] = useState({ vallas: false, avisos: false });
  const [selectedValla, setSelectedValla] = useState<IValla | null>(null);
  const [selectedAviso, setSelectedAviso] = useState<IAviso | null>(null);
  const [showSplashAd, setShowSplashAd] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { vallas, avisos, loading, fetchData } = useAdvertisements({ itemsPerPage: 3, type: AdType.BOTH, withCache: true });
/* 
  useEffect(() => {
    (async () => {
      setLoading({ vallas: true, avisos: true });

      try {
        const [vallasResponse, avisosResponse] = await Promise.all([
          fetch('https://vallas-publicitaria.onrender.com/vallas?page=1&limit=3').then((res) => res.json()),
          fetch('https://vallas-publicitaria.onrender.com/avisos?page=1&limit=3').then((res) => res.json()),
        ]);

        setVallas(vallasResponse.items);
        setAvisos(avisosResponse.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading({ vallas: false, avisos: false });
      }
    })();
  }, []); */

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Inside your Browse component
const navigation = useNavigation();
const renderItem = ({ item, onPress }: { item: IValla | IAviso; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.imagenUrl }} style={styles.image} />
    <View style={styles.cardInfo}>
      <Text style={styles.title}>{'nombre' in item ? item.nombre : item.tipo}</Text>
      <Text style={styles.price}>${'price' in item ? item.price : item.precio}</Text>
      
      {/* Conditionally render location information only for Vallas */}
      {'ubicacion' in item && (
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#007AFF" />
          <Text style={styles.locationText}>{item.ubicacion}</Text>
          {/* If ciudad is also part of the Valla, render it */}
          {'ciudad' in item && item.ciudad && (
            <Text style={styles.locationText}>{item.ciudad.ciudad}</Text>
          )}
          
        </View>
      )}
    </View>
  </TouchableOpacity>
);



const renderMostSoldPartsGrid = (title: string, parts: any[]) => (
  <View style={styles.gridSectionContainer}>
    <View style={styles.gridSectionHeader}>
      <Text style={styles.gridSectionTitle}>{title}</Text>
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllButtonText}>See All</Text>
        <Ionicons 
          name="chevron-forward-outline" 
          size={16} 
          color="#2563eb" 
        />
      </TouchableOpacity>
    </View>
    <FlatList
      data={parts}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.gridPartCard}
          onPress={() => {/* Navigate to part details */}}
        >
          <View style={styles.gridPartBadge}>
            <Text style={styles.gridPartBadgeText}>
              {item.soldCount} Sold
            </Text>
          </View>
          <Image 
            source={item.isLocal ? item.image : { uri: item.image }} // Handle local and remote images
            style={styles.gridPartImage} 
          />
          <View style={styles.gridPartDetails}>
            <Text style={styles.gridPartName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.gridPartPrice}>
              ${item.price.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.gridColumnWrapper}
    />
  </View>
);


  
const renderDetailsModal = (item: IValla | IAviso | null, closeModal: () => void) => (
  <Modal visible={!!item} transparent={true} onRequestClose={closeModal}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {item && (
          <>
            <Image source={{ uri: item.imagenUrl }} style={styles.modalImage} resizeMode="cover" />
            <Text style={styles.modalTitle}>{'nombre' in item ? item.nombre : item.tipo}</Text>
            <Text style={styles.modalPrice}>{`$${'price' in item ? item.price : item.precio}`}</Text>
            
            {/* Conditionally render description and location information only for Vallas */}
            {'descripcion' in item && <Text style={styles.modalDescription}>{item.descripcion}</Text>}
            
            {/* Render location information only for Vallas */}
            {'ubicacion' in item && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#007AFF" />
                <Text style={styles.locationText}>{item.ubicacion}</Text>
                <Text> ,</Text>
                {/* If ciudad is also part of the Valla, render it */}
                {'ciudad' in item && item.ciudad && (
                  <Text style={styles.locationText}>{item.ciudad.ciudad}</Text>
                )}
                <Text> ,</Text>
                 {'estado' in item && item.estado && (
                  <Text style={styles.locationText}>{item.estado.estado}</Text>
                )}
              </View>
            )}
          </>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
  return (
    <ScrollView 
    
       style={styles.container}
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
       }
    
    >
      {showSplashAd && (
        <Modal visible={showSplashAd} transparent={true} onRequestClose={() => setShowSplashAd(false)}>
          <View style={styles.splashAdContainer}>
            <TouchableOpacity style={styles.splashCloseButton} onPress={() => setShowSplashAd(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Image source={add} style={styles.splashImage} />
          </View>
        </Modal>
      )}

      <View style={styles.banner}>
        <Image source={banner} style={styles.bannerImage} />
      </View>

      <Text style={styles.sectionTitle}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <Text style={styles.vallastitle}>Vallas Disponibles</Text>
    <TouchableOpacity style={styles.seeMoreButton} onPress={() => navigation.navigate('vallas')}>
      <Text style={styles.seeMoreText}>Ver todos</Text>
    </TouchableOpacity>
  </View>
</Text>
      {loading.vallas ? <ActivityIndicator size="large" color="#007AFF" /> : <FlatList data={vallas} renderItem={({ item }) => renderItem({ item, onPress: () => setSelectedValla(item) })} keyExtractor={(item) => item.id.toString()} horizontal />}


      <Text style={styles.sectionTitle}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <Text style={styles.vallastitle}>Avisos Publicitarios</Text>
    <TouchableOpacity style={styles.seeMoreButton} onPress={() => navigation.navigate('avisos')}>
      <Text style={styles.seeMoreText}>Ver todos</Text>
    </TouchableOpacity>
  </View>
</Text>
      {loading.avisos ? <ActivityIndicator size="large" color="#007AFF" /> : <FlatList data={avisos} renderItem={({ item }) => renderItem({ item, onPress: () => setSelectedAviso(item) })} keyExtractor={(item) => item.id.toString()} horizontal />}

      {renderDetailsModal(selectedValla, () => setSelectedValla(null))}
      {renderDetailsModal(selectedAviso, () => setSelectedAviso(null))}


      {renderMostSoldPartsGrid('Nuestro Trabajo', mostSoldCartParts)}


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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  banner: { width: '100%', height: 200, marginBottom: 10 },
  bannerImage: { width: '100%', height: '100%', borderRadius: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 20, marginVertical: 10, color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', marginHorizontal: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2, width: 200 },
  image: { width: '100%', height: 120 },
  cardInfo: { padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 14, fontWeight: '600', color: '#007AFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '80%', alignItems: 'center' },
  modalImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  modalPrice: { fontSize: 16, fontWeight: '600', color: '#007AFF', marginBottom: 10 },
  modalDescription: { textAlign: 'center', marginBottom: 10, color: '#666' },
 // socialIcons: { flexDirection: 'row', gap: 20, marginVertical: 10 },
  closeButton: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
  splashAdContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  splashCloseButton: { position: 'absolute', top: 20, right: 20, zIndex: 1 },
  splashImage: { width: '60%', height: '60%' },
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
  },
  seeMoreButton: {
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 40,
    marginLeft: 50,
    marginTop: 10,
},
 
  seeMoreText: { 
    color: '#222831', 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  vallastitle:{
    fontSize: 20,
    color: '#222831',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5, // Optional: adds some space above the location text
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5, // Space between the icon and the text
  },
  gridSectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
    marginTop:19,
  },
  gridSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButtonText: {
    color: '#2563eb',
    fontSize: 14,
    marginRight: 4,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
  },
  gridPartCard: {
    width: (width - 48) / 2, // Responsive width
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridPartBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  gridPartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  gridPartImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridPartDetails: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridPartName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  gridPartPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  
  
});
