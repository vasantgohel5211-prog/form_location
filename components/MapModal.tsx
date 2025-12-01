import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { LocationData } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  title?: string;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, location, title }) => {
  if (!isOpen) return null;

  // Uses the simple embed format which usually works without an API key for basic pin display.
  // We also provide a direct link as a robust fallback.
  const mapUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`;
  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            {title || 'Location Preview'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full transition text-gray-500 hover:text-gray-700"
            aria-label="Close map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative w-full h-[400px] bg-gray-100">
            <iframe
              title="Employee Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={mapUrl}
              className="w-full h-full"
              loading="lazy"
            ></iframe>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-sm gap-3">
           <div className="text-gray-500 font-mono bg-white px-3 py-1 rounded border border-gray-200 shadow-sm">
             {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
           </div>
           <a 
             href={externalUrl}
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline px-3 py-1"
           >
             Open in Google Maps <ExternalLink className="w-4 h-4" />
           </a>
        </div>
      </div>
      
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default MapModal;