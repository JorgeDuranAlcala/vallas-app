import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdvertisements } from '@/hooks/useAd';
import { IAviso, IValla } from '.';
import { useState } from 'react';
import { RefreshControl } from 'react-native'


export default function Avisos() {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const ITEMS_PER_PAGE = 3;
  const { avisos, loading, fetchData } = useAdvertisements({ itemsPerPage: ITEMS_PER_PAGE });

  const totalPages = Math.ceil(avisos.length / ITEMS_PER_PAGE);
  const paginatedAvisos = avisos.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

    const [selectedAviso, setSelectedAviso] = useState<IAviso | null>(null);
  
    const renderDetailsModal = () => (
      <Modal
        visible={!!selectedAviso}
        transparent={true}
        onRequestClose={() => setSelectedAviso(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {/* Image Section */}
              <Image 
                source={{ uri: selectedAviso?.imagenUrl }} 
                style={styles.modalImage}
                resizeMode="cover"
              />
    
              {/* Details Section */}
              <View style={styles.modalDetails}>
                {/* Title with Icon */}
                <View style={styles.modalRow}>
                  <Ionicons name="information-circle-outline" size={24} color="#eee" />
                  <Text style={styles.modalTitle}>{selectedAviso?.descripcion}</Text>
                </View>
    
                {/* Price with Icon */}
                <View style={styles.modalRow}>
                  <Ionicons name="pricetag-outline" size={24} color="#eee" />
                  <Text style={styles.modalPrice}>Precio: ${selectedAviso?.precio}</Text>
                </View>
    
                {/* Type with Icon */}
                <View style={styles.modalRow}>
                  <Ionicons name="cube-outline" size={24} color="#eee" />
                  <Text style={styles.modalDetail}>Tipo: {selectedAviso?.tipo}</Text>
                </View>
    
                {/* Material with Icon */}
                <View style={styles.modalRow}>
                  <Ionicons name="construct-outline" size={24} color="#eee" />
                  <Text style={styles.modalDetail}>Material: {selectedAviso?.material}</Text>
                </View>
    
                {/* Description with Icon */}
                <View style={styles.modalRow}>
                  <Ionicons name="document-text-outline" size={24} color="#eee" />
                  <Text style={styles.modalDetail}>Descripción: {selectedAviso?.descripcion}</Text>
                </View>
    
                {/* Close Button */}
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedAviso(null)}
                >
                  <Ionicons name="close-circle-outline" size={24} color="#eee" />
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );

  const renderFooter = () => {
    return (
      <View style={additionalStyles.footer}>
        <View style={additionalStyles.paginationContainer}>
          <TouchableOpacity 
            onPress={goToPreviousPage}
            disabled={page === 1}
            style={[additionalStyles.pageButton, page === 1 && additionalStyles.pageButtonDisabled]}
          >
            <Text style={additionalStyles.pageButtonText}>Anterior</Text>
          </TouchableOpacity>
          
          <Text style={additionalStyles.pageInfo}>Pagina {page} de {totalPages}</Text>
          
          <TouchableOpacity 
            onPress={goToNextPage}
            disabled={page === totalPages}
            style={[additionalStyles.pageButton, page === totalPages && additionalStyles.pageButtonDisabled]}
          >
            <Text style={additionalStyles.pageButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Add these new styles
  const additionalStyles = StyleSheet.create({
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 20,
    },
    pageButton: {
      backgroundColor: '#fd0100',
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
      color: 'black',
      fontWeight: '500',
    },
  });
  
  const renderItem = ({ item }: { item: IAviso }) => (
    <TouchableOpacity style={styles.adCard} onPress={() => setSelectedAviso(item)}>
      <Image source={{ uri: item.imagenUrl }} style={styles.adImage} />
      <View style={styles.adInfo}>
        <View style={styles.adHeader}>
          <View>
            {/* Title with Icon */}
            <View style={styles.adRow}>
              <Ionicons name="information-circle-outline" size={24} color="#333" />
              <Text style={styles.adTitle}>Titulo: {item.tipo}</Text>
            </View>
  
            {/* Price with Icon */}
            <View style={styles.adRow}>
              <Ionicons name="pricetag-outline" size={24} color="#333" />
              <Text style={styles.adPrice}>Precio: {item.precio} $</Text>
            </View>
  
            {/* Material with Icon */}
            <View style={styles.adRow}>
              <Ionicons name="cube-outline" size={24} color="#333" />
              <Text style={styles.adPrice}>Material: {item.material}</Text>
            </View>
  
            {/* Description with Icon */}
            <View style={styles.adRow}>
              <Ionicons name="document-text-outline" size={24} color="#333" />
              <Text style={styles.addDescription}>Descripción: {item.descripcion}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  async function onRefresh() {
    setRefreshing(true);
    // Aquí puedes realizar la lógica para actualizar los datos
    // Por ejemplo, puedes llamar a una función que recupere los datos actualizados
    // y luego establecer los datos actualizados en el estado
    // setAvisos(nuevoAvisos);
    await fetchData();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      {avisos.length > 0 ? (
        <>
        <FlatList
          data={paginatedAvisos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
        {renderDetailsModal()}
        </>

      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#666" />
            {  !loading.avisos ?    ( 
                            <>
                                <Text style={styles.emptyStateTitle}>No Saved Ads</Text>
                                <Text style={styles.emptyStateText}>
                                    Items you save will appear here
                                </Text>
                            </>
                    ) : (
                        <ActivityIndicator size="large"  color="#007AFF" />
                    )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    footer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
      },
      footerText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500'
      },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  
    
  },
  listContainer: {
    padding: 16,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden', // Ensure the image corners are rounded
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  adImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover', // Ensure the image covers the area without stretching
  },
  adInfo: {
    padding: 16,
  },
  adRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  adTitle: {
    fontSize: 26,
  fontWeight: '700',
  color: '#333',
  marginBottom: 8,
  marginLeft:10,
  },
  adPrice: {
    fontSize: 22,
  fontWeight: '700',
  color: '#333',
  marginLeft:10,
  },
  addDescription: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft:10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
    color:'white'
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  modalDetails: {
    backgroundColor:'#fd0100',
    padding: 20,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 28, // Larger font size

    fontWeight: '800',
    marginLeft: 10,
    color: '#eee',
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 10,
    color: '#eee',
  },
  modalDetail: {
    fontSize: 16,
    marginLeft: 10,
    color: '#eee',
    fontWeight: '700',
  },
  closeButton: {
    flexDirection: 'row',
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
});