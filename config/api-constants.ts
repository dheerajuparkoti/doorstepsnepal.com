import { Truculenta } from "next/font/google";

export class ApiConstants {
  static useProduction =false; 
  
  static get baseUrl(): string {
    const url = this.useProduction 
      // ? "https://hrtgwbtnq9.execute-api.ap-south-1.amazonaws.com/api/v1"
      // ? "https://5pkarxuueg.execute-api.ap-south-1.amazonaws.com/api/v1"
      ?"https://hrtgwbtnq9.execute-api.ap-south-1.amazonaws.com/api/v1"
      :"http://localhost:8000/api/v1";
    
    // console.log(' API URL:', url); 
    return url;
  }
}
