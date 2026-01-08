export class ApiConstants {
  // Pull from the single .env via process.env
  static localBaseUrl = process.env.NEXT_PUBLIC_API_URL_LOCAL || "http://localhost:8000";
  static prodBaseUrl = process.env.NEXT_PUBLIC_API_URL_PROD || "https://api.prod.com";

  // Automatically true when you build for production
  static isProduction = process.env.NODE_ENV === 'production';

  static get baseUrl(): string {
    return this.isProduction ? this.prodBaseUrl : this.localBaseUrl;
  }
}