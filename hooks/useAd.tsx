import { IAviso, IValla } from '@/app/(tabs)';
import { useState, useEffect } from 'react';

export enum AdType {
  VALLA = 'valla',
  AVISO = 'aviso',
  BOTH = 'both'
}

type useAdvertisementsProps = {
  itemsPerPage?: number;
  type?: AdType;
  withCache?: boolean;
}

export const useAdvertisements = ({
  itemsPerPage = 10,
  type,
  withCache = true
}: useAdvertisementsProps) => {
  const [vallas, setVallas] = useState<IValla[]>([]);
  const [avisos, setAvisos] = useState<IAviso[]>([]);
  const [loading, setLoading] = useState({
    vallas: false,
    avisos: false
  });
  const [totalPagesAvisos, setTotalPagesAvisos] = useState(0);
  const [totalPagesVallas, setTotalPagesVallas] = useState(0);


  async function getVallas(page: number, limit: number) {
    try {
      setLoading(prev => ({ ...prev, vallas: true }));
      const vallasResponse = await fetch(`https://vallas-publicitaria.onrender.com/vallas?page=${page}&limit=${limit ? limit : itemsPerPage}&cache=${withCache}`);
      const vallasData = await vallasResponse.json();
      setVallas(vallasData.items);
      setTotalPagesVallas(vallasData.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, vallas: false }));
    }

  }

  async function getAvisos(page: number, limit: number) {
    try {
      setLoading(prev => ({ ...prev, avisos: true }));
      const avisosResponse = await fetch(`https://vallas-publicitaria.onrender.com/avisos?page=${page}&limit=${limit ? limit : itemsPerPage}&cache=${withCache}`);
      const avisosData = await avisosResponse.json();
      setAvisos(avisosData.items);
      setTotalPagesAvisos(avisosData.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, avisos: false }));
    }
  }

  const fetchData = async (page: number = 1) => {
    if (type === AdType.VALLA) {
      getVallas(page, itemsPerPage);
    } else if (type === AdType.AVISO) {
      getAvisos(page, itemsPerPage);
    } else {
      getVallas(page, itemsPerPage);
      getAvisos(page, itemsPerPage);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { vallas, avisos, loading, fetchData, totalPagesAvisos, totalPagesVallas };
};
