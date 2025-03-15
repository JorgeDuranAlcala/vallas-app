import { IAviso, IValla } from '@/app/(tabs)';
import { useState, useEffect } from 'react';

type useAdvertisementsProps = {
  itemsPerPage?: number;
}

export const useAdvertisements = ({
  itemsPerPage = 10
}: useAdvertisementsProps) => {
  const [vallas, setVallas] = useState<IValla[]>([]);
  const [avisos, setAvisos] = useState<IAviso[]>([]);
  const [loading, setLoading] = useState({
    vallas: false,
    avisos: false
  });
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page: number = 1, limit?: number) => {
    setLoading(prev => ({ ...prev, vallas: true }));
    try {
      const vallasResponse = await fetch(`https://vallas-publicitaria.onrender.com/vallas?page=${page}&limit=${limit ? limit : itemsPerPage}`);
      const vallasData = await vallasResponse.json();
      setVallas(vallasData.items);
      setTotalPages(vallasData.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, vallas: false }));
    }

    setLoading(prev => ({ ...prev, avisos: true }));
    try {
      const avisosResponse = await fetch(`https://vallas-publicitaria.onrender.com/avisos?page=${page}&limit=${limit ? limit : itemsPerPage}`);
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

  return { vallas, avisos, loading, fetchData, totalPages };
};
