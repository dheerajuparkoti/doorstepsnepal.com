
export class ApiConstants {
  static useProduction = true; 
  
  static get baseUrl(): string {
    const url = this.useProduction 
      ? "https://hrtgwbtnq9.execute-api.ap-south-1.amazonaws.com/api/v1"
      : "http://192.168.1.64:8000/api/v1";
    
    // console.log(' API URL:', url); 
    return url;
  }
}
