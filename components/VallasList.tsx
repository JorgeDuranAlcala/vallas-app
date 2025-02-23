import { IValla } from '@/app/(tabs)'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface Props {
    vallas: IValla[]
    styles: any
}

export default function VallasList({
    styles,
    vallas
}: Props) {

      const [selectedValla, setSelectedValla] = useState<IValla | null>(null);
      const [page, setPage] = useState(1);
      const ITEMS_PER_PAGE = 3;

      const totalPages = Math.ceil(vallas.length / ITEMS_PER_PAGE);
      const paginatedVallas = vallas.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    
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

  return (
    <>
       <FlatList
          data={vallas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={renderFooter}
        />
        {renderDetailsModal()}
    </>
  )
}
