import { IAviso, IValla } from '@/app/(tabs)';
import { useState, useEffect } from 'react';

export const useAdvertisements = () => {
  const [vallas, setVallas] = useState<IValla[]>([]);
  const [avisos, setAvisos] = useState<IAviso[]>([]);
  const [loading, setLoading] = useState({
    vallas: false,
    avisos: false
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, vallas: true }));
      try {
        const vallasResponse = await fetch('https://vallas-publicitaria.onrender.com/vallas');
        const vallasData = await vallasResponse.json();
        setVallas(vallasData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(prev => ({ ...prev, vallas: false }));
      }

      setLoading(prev => ({ ...prev, avisos: true }));
      try {
        const avisosResponse = await fetch('https://vallas-publicitaria.onrender.com/avisos');
        const avisosData = await avisosResponse.json();
        setAvisos(avisosData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(prev => ({ ...prev, avisos: false }));
      }
    };

    fetchData();
  }, []);

  return { vallas, avisos, loading };
};
