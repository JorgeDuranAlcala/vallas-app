import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdvertisements } from '@/hooks/useAd';
import { IAviso, IValla } from '.';
import { useState } from 'react';


export default function Avisos() {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const { avisos, loading } = useAdvertisements();

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
              <Image 
                source={{ uri: selectedAviso?.imagenUrl }} 
                style={styles.modalImage}
                resizeMode="cover"
              />
              <View style={styles.modalDetails}>
                <Text style={styles.modalTitle}>{selectedAviso?.descripcion}</Text>
                <Text style={styles.modalPrice}>Price: ${selectedAviso?.precio}</Text>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedAviso(null)}
                >
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
  });
  const renderItem = ({ item }: {
    item: IAviso
  }) => (
    <TouchableOpacity style={styles.adCard} onPress={() => setSelectedAviso(item)}>
        <Text>{item.id}</Text>
      <Image source={{ uri: item.imagenUrl }} style={styles.adImage} />
      <View style={styles.adInfo}>
        <View style={styles.adHeader}>
          <View>
            <Text style={styles.adTitle}>{item.descripcion}</Text>
            <Text style={styles.adPrice}>{item.precio}</Text>
          </View>
          <TouchableOpacity style={styles.heartButton}>
            <Ionicons name="heart" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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