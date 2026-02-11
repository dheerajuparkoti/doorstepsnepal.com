'use client';

import { useState, useEffect } from 'react';
import { fetchFavorites, removeFavorite } from '@/lib/api/favorites';
import { FavoritesResponse } from '@/lib/data/favorites';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritesResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = useI18n();

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err: any) {
      console.error('Error loading favorites:', err);
      
      if (err.message.includes('Authentication required')) {
        setError(locale === 'ne' 
          ? 'प्रमाणीकरण आवश्यक छ' 
          : 'Authentication required');
      } else {
        setError(locale === 'ne' 
          ? 'मनपराएका सेवाहरू लोड गर्न असफल' 
          : 'Failed to load favorites');
      }
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(favoriteId: number) {
    const confirmMessage = locale === 'ne'
      ? 'के तपाईं यो मनपराएको सूचीबाट हटाउन चाहनुहुन्छ?'
      : 'Are you sure you want to remove this from favorites?';
    
    if (!confirm(confirmMessage)) return;
    
    try {
      await removeFavorite(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert(locale === 'ne'
        ? 'मनपराएको हटाउन असफल'
        : 'Failed to remove favorite');
    }
  }

  function navigateToService(serviceId?: number, serviceName?: string) {
    if (serviceId) {
      router.push(`/services/${serviceId}?name=${encodeURIComponent(serviceName || '')}`);
    }
  }

  function navigateToProfessional(professionalId?: number) {
    if (professionalId) {
      router.push(`/professionals/${professionalId}`);
    }
  }

  const serviceFavorites = favorites.filter(
    fav => fav.professional_service !== null
  );
  const professionalFavorites = favorites.filter(
    fav => fav.professional !== null && !fav.professional_service
  );

  const getLocalizedName = (item: any) => {
    if (!item) return '';
    
    if (locale === 'ne' && item.service_name_np) {
      return item.service_name_np;
    }
    return item.service_name_en || item.full_name || '';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error?.includes('Authentication required')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center mt-12">
          <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-3">
            {locale === 'ne' ? 'लगइन आवश्यक' : 'Login Required'}
          </h2>
          <p className="text-gray-600 mb-8">
            {locale === 'ne' 
              ? 'तपाईंका मनपराएका सेवाहरू हेर्न लगइन गर्नुहोस्'
              : 'Please login to view your favorite items'}
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              {locale === 'ne' ? 'लगइन गर्नुहोस्' : 'Go to Login'}
            </Link>
            <Link
              href="/"
              className="inline-block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              {locale === 'ne' ? 'गृह पृष्ठमा फर्कनुहोस्' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {locale === 'ne' ? 'मनपराएका' : 'Favorites'}
        </h1>
        <p className="text-gray-600">
          {locale === 'ne' 
            ? 'तपाईंले बचत गर्नुभएका सेवा र पेशेवरहरू'
            : 'Your saved services and professionals'}
        </p>
      </div>
      
      {error && !error.includes('Authentication') && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadFavorites}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            {locale === 'ne' ? 'फेरि प्रयास गर्नुहोस्' : 'Try Again'}
          </button>
        </div>
      )}
      
      {serviceFavorites.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {locale === 'ne' ? 'सेवाहरू' : 'Services'} ({serviceFavorites.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceFavorites.map((fav) => (
              <ServiceFavoriteCard 
                key={fav.id} 
                favorite={fav} 
                onRemove={handleRemoveFavorite}
                onClick={() => navigateToService(
                  fav.professional_service?.service_id,
                  getLocalizedName(fav.professional_service)
                )}
                getLocalizedName={getLocalizedName}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
      
      {professionalFavorites.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {locale === 'ne' ? 'पेशेवरहरू' : 'Professionals'} ({professionalFavorites.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionalFavorites.map((fav) => (
              <ProfessionalFavoriteCard 
                key={fav.id} 
                favorite={fav} 
                onRemove={handleRemoveFavorite}
                onClick={() => navigateToProfessional(fav.professional?.id)}
                getLocalizedName={getLocalizedName}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
      
      {favorites.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">
            {locale === 'ne' ? 'कुनै मनपराएका छैनन्' : 'No Favorites Yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {locale === 'ne'
              ? 'आफ्ना मनपराएका सूचीमा सेवा र पेशेवरहरू थप्न सुरु गर्नुहोस्'
              : 'Start exploring and add services and professionals to your favorites list'}
          </p>
          <div className="space-x-4">
            <Link
              href="/services"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              {locale === 'ne' ? 'सेवाहरू ब्राउज गर्नुहोस्' : 'Browse Services'}
            </Link>
            <Link
              href="/professionals"
              className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              {locale === 'ne' ? 'पेशेवरहरू खोज्नुहोस्' : 'Find Professionals'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  favorite: FavoritesResponse[0];
  onRemove: (id: number) => void;
  onClick: () => void;
  getLocalizedName: (item: any) => string;
  locale: string;
}

function ServiceFavoriteCard({ 
  favorite, 
  onRemove,
  onClick,
  getLocalizedName,
  locale
}: CardProps) {
  const service = favorite.professional_service;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    onRemove(favorite.id);
    setIsRemoving(false);
  };

  const localizedName = getLocalizedName(service);
  const price = service?.price ? 
    (locale === 'ne' ? `रु ${service.price}` : `Rs. ${service.price}`) : 
    (locale === 'ne' ? 'रु ०' : 'Rs. 0');

  return (
    <div 
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          {service?.image ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img 
                src={service.image} 
                alt={localizedName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center border border-red-100">
              <HeartIcon className="w-8 h-8 text-red-400" />
            </div>
          )}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600">
            {localizedName || (locale === 'ne' ? 'सेवा' : 'Service')}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-blue-600">
              {price}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500 truncate">
              {service?.full_name || (locale === 'ne' ? 'पेशेवर' : 'Professional')}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={locale === 'ne' ? 'हटाउनुहोस्' : 'Remove'}
        >
          {isRemoving ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <TrashIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

function ProfessionalFavoriteCard({ 
  favorite, 
  onRemove,
  onClick,
  getLocalizedName,
  locale
}: CardProps) {
  const professional = favorite.professional;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    onRemove(favorite.id);
    setIsRemoving(false);
  };

  return (
    <div 
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer hover:border-green-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          {professional?.profile_image ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img 
                src={professional.profile_image} 
                alt={professional.full_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center border-2 border-white shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-green-600">
                  {professional?.full_name?.charAt(0) || 'P'}
                </span>
              </div>
            </div>
          )}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-green-600">
            {professional?.full_name || (locale === 'ne' ? 'पेशेवर' : 'Professional')}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {locale === 'ne' ? 'सत्यापित' : 'Verified'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              4.8
            </span>
            <span className="text-xs text-gray-500">
              • 50+ {locale === 'ne' ? 'समीक्षाहरू' : 'reviews'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={locale === 'ne' ? 'हटाउनुहोस्' : 'Remove'}
        >
          {isRemoving ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <TrashIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

// Icon Components
function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 011.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>
  );
}