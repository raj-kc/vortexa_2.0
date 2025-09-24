import React, { useEffect, useRef } from 'react';
import { X, BookOpen } from 'lucide-react';

interface GlossaryPopupProps {
  visible: boolean;
  term: string;
  definition: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const GlossaryPopup: React.FC<GlossaryPopupProps> = ({
  visible,
  term,
  definition,
  position,
  onClose
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm animate-in fade-in zoom-in duration-200"
      style={{
        left: Math.min(position.x, window.innerWidth - 400),
        top: position.y + 10
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-blue-100 rounded-lg">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 text-sm">Definition</h4>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <p className="font-medium text-blue-700 text-sm">{term}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{definition}</p>
      </div>
      
      <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
    </div>
  );
};