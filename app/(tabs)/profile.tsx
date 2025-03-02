import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.jpg')}
          style={styles.companyLogo}
        />
        <Text style={styles.companyName}>Imprime Publicidad</Text>
        <Text style={styles.tagline}>Expertos en Publicidad Exterior</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre Nosotros</Text>
        <Text style={styles.sectionText}>
          Somos líderes en soluciones de publicidad exterior, especializados en vallas publicitarias y avisos luminosos. Con años de experiencia en el mercado venezolano.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servicios</Text>
        <View style={styles.servicesList}>
          <View style={styles.serviceItem}>
            <Ionicons name="image-outline" size={24} color="#fd0100" />
            <Text style={styles.serviceText}>Vallas Publicitarias</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="bulb-outline" size={24} color="#fd0100" />
            <Text style={styles.serviceText}>Avisos Luminosos</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="print-outline" size={24} color="#fd0100" />
            <Text style={styles.serviceText}>Impresión Digital</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL('tel:+584267472630')}
        >
          <Ionicons name="call-outline" size={24} color="#fd0100" />
          <Text style={styles.contactText}>+58 426-7472630</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL('mailto:info@imprimepublicidad.com')}
        >
          <Ionicons name="mail-outline" size={24} color="#fd0100" />
          <Text style={styles.contactText}>info@imprimepublicidad.com</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL('https://maps.app.goo.gl/your-location')}
        >
          <Ionicons name="location-outline" size={24} color="#fd0100" />
          <Text style={styles.contactText}>Caracas, Venezuela</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fd0100',
  },
  companyLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fd0100',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  servicesList: {
    marginTop: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  }
});
