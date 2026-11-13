import {api} from '@/lib/axios';
import { Coin } from "@/types/Coin.interface";

export const loadCriptos = async () => {
  try { 
        const { data } = await api.get<Coin[]>("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false");
        await  new Promise((resolve)=> setTimeout(resolve, 3000))
        return data
      } catch (error) {
        console.log(error);
      }
    };
  
    

