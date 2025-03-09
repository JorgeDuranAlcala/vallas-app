import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  ActivityIndicator, Modal, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdvertisements } from '@/hooks/useAd';
import { IValla } from '.';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshControl } from 'react-native'


const ITEMS_PER_PAGE = 3;

export default function Vallas() {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { vallas, loading,fetchData, totalPages: vallasTotalPages } = useAdvertisements({ itemsPerPage: ITEMS_PER_PAGE });
  const [selectedValla, setSelectedValla] = useState<IValla | null>(null);
  console.log('vallas', vallas)
  const totalPages = vallasTotalPages;
  const paginatedVallas = vallas;

  const handleNextPage = () => {
    fetchData(page + 1)
    setPage(page + 1);
  };
  const handlePrevPage = () => {
    fetchData(page - 1)
    setPage(page - 1);
  };

  const renderDetailsModal = () => (
    <Modal
      visible={!!selectedValla}
      transparent
      onRequestClose={() => setSelectedValla(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            {selectedValla && (
              <>
                <Image 
                  source={{ uri: selectedValla.imagenUrl }} 
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <View style={styles.modalDetails}>
                  <Text style={styles.modalTitle}>{selectedValla.nombre}</Text>
                  <Text style={styles.modalPrice}>Precio: ${selectedValla.price}</Text>
                  <Text style={styles.modalPrice}>Ubicacion: {selectedValla.ubicacion}</Text>
                  <Text style={styles.modalPrice}>Estado: {selectedValla.estado.estado}</Text>
                  <Text style={styles.modalPrice}>Ciudad: {selectedValla.ciudad.ciudad}</Text>
                  <Text style={styles.modalPrice}>Tamaño: {selectedValla.ancho} x {selectedValla.alto}</Text>


                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setSelectedValla(null)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );


  console.log('vallas debug', {
    diablebtn: page === totalPages
  })

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity 
        onPress={handlePrevPage}
        disabled={page === 1}
        style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
      >
        <Text style={styles.pageButtonText}>Anterior</Text>
      </TouchableOpacity>
      
      <Text style={styles.pageInfo}>Página {page} de {totalPages}</Text>
      
      <TouchableOpacity 
        onPress={handleNextPage}
        disabled={page === totalPages}
        style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
      >
        <Text style={styles.pageButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: IValla }) => (
    <TouchableOpacity
      style={styles.adCard}
      onPress={() => setSelectedValla(item)}
    >
      <Image source={{ uri: item.imagenUrl }} style={styles.adImage} />
      <LinearGradient
      colors={['rgba(0,0,0,0)', 'rgba(0, 0, 0, 0.1)']}
      style={styles.imageOverlay}
    />
      <View style={styles.adInfo}>
        <View style={styles.adHeader}>
          <View>
            <Text style={styles.adTitle}>{item.nombre}</Text>
            <Text style={styles.adPrice}>Precio: ${item.price}</Text>
            
             <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={16} color="#007AFF" />
                            <Text style={styles.locationText}>
                              {item.ubicacion}
                              {item.ciudad && `, ${item.ciudad.ciudad}`}
                              {item.estado && `, ${item.estado.estado}`}
                            </Text>
                          </View>
          </View>
          <TouchableOpacity style={styles.heartButton}>
            <Ionicons name="heart" size={24} color="#FF5A5F" />
          </TouchableOpacity>
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
    await fetchData(page, ITEMS_PER_PAGE);
    setRefreshing(false);
  }


  return (
    <View style={styles.container}>
      {vallas.length > 0 ? (
        <>
          <FlatList
            data={paginatedVallas}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={renderPagination}
            refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      }
          />
          {selectedValla && renderDetailsModal()}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#666" />
          {!loading ? (
            <>
              <Text style={styles.emptyStateTitle}>No Saved Ads</Text>
              <Text style={styles.emptyStateText}>
                Items you save will appear here
              </Text>
            </>
          ) : (
            <ActivityIndicator size="large" color="#007AFF" />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  adTitle: {
    fontSize: 20,
  fontWeight: '700',
  color: '#333',
  marginBottom: 8,
  },
  adPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#007AFF',
  },
  heartButton: {
    padding: 4,
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
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
    color: '#333',
    fontWeight: '500',
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
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  modalDetails: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalPrice: {
    fontSize: 22,
  color: '#007AFF',
  fontWeight: '700',
  marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#fd0100',
  padding: 15,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 20,
  width: '100%',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  }
});
