import { IAviso, IValla } from '@/app/(tabs)';
import { useState, useEffect } from 'react';

export const useAdvertisements = () => {
  const [vallas, setVallas] = useState<IValla[]>([]);
  const [avisos, setAvisos] = useState<IAviso[]>([]);
  const [loading, setLoading] = useState({
    vallas: false,
    avisos: false
  });

  const fetchData = async () => {
    setLoading(prev => ({ ...prev, vallas: true }));
    try {
      const vallasResponse = await fetch('https://vallas-publicitaria.onrender.com/vallas?page=1&limit=4');
      const vallasData = await vallasResponse.json();
      setVallas(vallasData.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, vallas: false }));
    }

    setLoading(prev => ({ ...prev, avisos: true }));
    try {
      const avisosResponse = await fetch('https://vallas-publicitaria.onrender.com/avisos?page=1&limit=4');
      const avisosData = await avisosResponse.json();
      setAvisos(avisosData.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, avisos: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { vallas, avisos, loading, fetchData };
};
