import { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider'; // Add this import at the top

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IValla } from '.';
import VallasList from '@/components/VallasList';

const popularSearches = [
  'iPhone',
  'Apartment',
  'Used Cars',
  'Furniture',
  'Jobs',
  'Laptops',
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const [priceRangeMin, setPriceRangeMin] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValla, setSelectedValla] = useState<IValla | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const MAX_PRICE = 10000;

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://vallas-publicitaria.onrender.com/vallas/disponibles/search?minPrice=${priceRangeMin}&maxPrice=${priceRange}`
      );
      console.log(`https://vallas-publicitaria.onrender.com/vallas/disponibles/search?minPrice=${priceRangeMin}&maxPrice=${priceRange}`)
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

    const renderDetailsModal = () => (
      <Modal
        visible={!!selectedValla}
        transparent={true}
        onRequestClose={() => setSelectedValla(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Image 
                source={{ uri: selectedValla?.imagenUrl }} 
                style={styles.modalImage}
                resizeMode="cover"
              />
              <View style={styles.modalDetails}>
                <Text style={styles.modalTitle}>{selectedValla?.nombre}</Text>
                <Text style={styles.modalPrice}>Price: ${selectedValla?.price}</Text>
                <Text style={styles.modalPrice}>Price: ${selectedValla?.price}</Text>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedValla(null)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );

      const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
      const paginatedVallas = searchResults.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    
      const goToNextPage = () => {
        if (page < totalPages) {
          setPage(prev => prev + 1);
        }
      };
    
      const goToPreviousPage = () => {
        if (page > 1) {
          setPage(prev => prev - 1);
        }
      };
    
      const renderFooter = () => {
        return (
          <View style={styles.footer}>
            <View style={styles.paginationContainer}>
              <TouchableOpacity 
                onPress={goToPreviousPage}
                disabled={page === 1}
                style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
              >
                <Text style={styles.pageButtonText}>Anterior</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageInfo}>Pagina {page} de {totalPages}</Text>
              
              <TouchableOpacity 
                onPress={goToNextPage}
                disabled={page === totalPages}
                style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
              >
                <Text style={styles.pageButtonText}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      };

  useEffect(() => {
    handleSearch();
  }, [priceRange, priceRangeMin]);

    const renderItem = ({ item }: {
      item: IValla
    }) => (
      <TouchableOpacity
       style={styles.adCard}
       onPress={() => setSelectedValla(item)}
      >
        <Image source={{ uri: item.imagenUrl }} style={styles.adImage} />
        <View style={styles.adInfo}>
          <View style={styles.adHeader}>
            <View>
              <Text style={styles.adTitle}>{item.nombre}</Text>
              <Text style={styles.adPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );

  const renderSearchResults = () => (
    <>
            <FlatList
              data={paginatedVallas}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              ListFooterComponent={renderFooter}
            />
    {renderDetailsModal()}    
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.priceRangeContainer}>
        <Text style={styles.sectionTitle}>Precio Maximo: ${priceRange}</Text>
       <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={MAX_PRICE}
          value={priceRange}
          onValueChange={setPriceRange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ddd"
          step={10}
        /> 
        <View style={styles.priceLabels}>
          <Text style={styles.priceLabel}>$0</Text>
          <Text style={styles.priceLabel}>${MAX_PRICE}</Text>
        </View>
      </View>

      <View style={styles.priceRangeContainer}>
        <Text style={styles.sectionTitle}>Precio minimo: ${priceRangeMin}</Text>
      <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={MAX_PRICE}
          value={priceRangeMin}
          onValueChange={setPriceRangeMin}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ddd"
          step={100}
        /> 
        <View style={styles.priceLabels}>
          <Text style={styles.priceLabel}>$0</Text>
        </View>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        renderSearchResults()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 16,
  },
  adCard: {
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
  adImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  adInfo: {
    padding: 16,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  adPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  heartButton: {
    padding: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  adLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  
  savedDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20
  },
  pageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1c1c1e',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  popularSearches: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1c1c1e',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  priceRangeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    paddingVertical: 15
  },
  slider: {
    width: '100%',
    height: 10,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  priceLabel: {
    color: '#666',
    fontSize: 14,
  },
  tagText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  recentSearches: {
    padding: 16,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentSearchText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1c1c1e',
  },
  resultCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  resultImage: {
    width: '100%',
    height: 200,
  },
  resultInfo: {
    padding: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultPrice: {
    fontSize: 16,
    color: '#007AFF',
  },
  loader: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden'
  },
  modalImage: {
    width: '100%',
    height: 300
  },
  modalDetails: {
    padding: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalPrice: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 15
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
});