import { CustomerAddress } from "@/lib/data/order";

export function formatAddress(address?: CustomerAddress) {
  if (!address) return "";

    return `${address.street_address}, 
     ${address.municipality}- 
  ${address.ward_no}, 
 
  ${address.district}, 
  ${address.province}`;
  
    
}
