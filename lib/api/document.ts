
import { api } from '@/config/api-client'; 
import { VerificationDocument, DocumentFormData, DocumentPatchData, VerificationStatus } from '@/lib/data/document';
export const documentApi = {
  // Get all verification documents for a professional
  async getDocuments(professionalId: number): Promise<VerificationDocument[]> {
    try {
      const endpoint = `/professionals/${professionalId}/verification_documents`;
      const response = await api.get<any>(endpoint);
      // API returns a direct array, so response should be the array
      if (Array.isArray(response)) {
        return response;
      }
      // If response is an object that contains an array
      if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response.documents)) {
          return response.documents;
        }
        if (Array.isArray(response.results)) {
          return response.results;
        }
      }
      return [];
    } catch (error: any) {

      if (error.status) {
      }
      if (error.data) {
      }
      
      throw error;
    }
  },

  // Upload a new verification document
  async uploadDocument(
    professionalId: number, 
    data: DocumentFormData
  ): Promise<VerificationDocument> {
    try {
      const endpoint = `/professionals/${professionalId}/verification_documents/upload`;
      
      const formData = new FormData();
      
      if (data.image) {
        formData.append('file', data.image);
      }
      
      if (data.description) {
        formData.append('description', data.description);
      }
      

      const response = await api.post<VerificationDocument>(endpoint, formData);
   
      
      return response;
    } catch (error) {

      throw error;
    }
  },

  // Update an existing document
  async updateDocument(
    professionalId: number,
    documentId: number,
    data: DocumentPatchData
  ): Promise<VerificationDocument> {
    try {
      const endpoint = `/professionals/${professionalId}/verification_documents/${documentId}`;
      
      const formData = new FormData();
      
      if (data.image) {
        formData.append('file', data.image);
      }
      
      if (data.description !== undefined) {
        formData.append('description', data.description);
      }
      
      if (data.status !== undefined) {
        formData.append('status', data.status);
      }
      
      if (data.reason !== undefined) {
        formData.append('reason', data.reason || '');
      }

      const response = await api.patch<VerificationDocument>(endpoint, formData);
 
      
      return response;
    } catch (error) {
   
      throw error;
    }
  },

  // Delete a document
  async deleteDocument(
    professionalId: number,
    documentId: number
  ): Promise<void> {
    try {
      const endpoint = `/professionals/${professionalId}/verification_documents/${documentId}`;
      await api.delete(endpoint);
    } catch (error) {
      throw error;
    }
  },
};