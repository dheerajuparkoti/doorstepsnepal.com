
import { create } from 'zustand';
import { VerificationDocument, VerificationStatus } from '@/lib/data/document';
import { documentApi } from '@/lib/api/document';

interface DocumentStore {
  documents: VerificationDocument[];
  isLoading: boolean;
  error: string | null;
  isUploading: boolean;
  isDeleting: boolean;
  
  fetchDocuments: (professionalId: number) => Promise<void>;
  uploadDocument: (professionalId: number, file: File, description: string) => Promise<VerificationDocument>;
  updateDocument: (professionalId: number, documentId: number, file: File | null, description: string) => Promise<VerificationDocument>;
  deleteDocument: (professionalId: number, documentId: number) => Promise<void>;
  clearError: () => void;
  clearDocuments: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial state
  documents: [],
  isLoading: false,
  error: null,
  isUploading: false,
  isDeleting: false,

  // Fetch all documents for a professional - SIMPLIFIED
  fetchDocuments: async (professionalId: number) => {

    set({ isLoading: true, error: null });
    
    try {
      const documents = await documentApi.getDocuments(professionalId);

      
      set({ 
        documents: documents,
        isLoading: false 
      });
    } catch (error: any) {
 
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch documents';
      set({ 
        error: errorMessage, 
        isLoading: false,
        documents: [] 
      });
    }
  },

  // Upload a new document
  uploadDocument: async (professionalId: number, file: File, description: string) => {
    set({ isUploading: true, error: null });
    try {
      const newDocument = await documentApi.uploadDocument(professionalId, {
        image: file,
        description,
      });
      
      set(state => ({
        documents: [...state.documents, newDocument],
        isUploading: false,
      }));
      
      return newDocument;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload document';
      set({ 
        error: errorMessage, 
        isUploading: false 
      });
      throw error;
    }
  },

  // Update an existing document
  updateDocument: async (professionalId: number, documentId: number, file: File | null, description: string) => {
    set({ isUploading: true, error: null });
    try {
      const updatedDocument = await documentApi.updateDocument(
        professionalId,
        documentId,
        {
          image: file,
          description,
          status: VerificationStatus.PENDING,
          reason: null,
        }
      );
      
      set(state => ({
        documents: state.documents.map(doc => 
          doc.id === documentId ? updatedDocument : doc
        ),
        isUploading: false,
      }));
      
      return updatedDocument;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update document';
      set({ 
        error: errorMessage, 
        isUploading: false 
      });
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (professionalId: number, documentId: number) => {
    set({ isDeleting: true, error: null });
    try {
      await documentApi.deleteDocument(professionalId, documentId);
      
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== documentId),
        isDeleting: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete document';
      set({ 
        error: errorMessage, 
        isDeleting: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear all documents
  clearDocuments: () => set({ documents: [] }),
}));