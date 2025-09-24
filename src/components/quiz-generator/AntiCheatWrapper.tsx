import React, { useEffect, useState, ReactNode } from 'react';
import { AlertTriangle, Eye } from 'lucide-react';

interface AntiCheatWrapperProps {
  children: ReactNode;
  onViolation: (type: string) => void;
}

export const AntiCheatWrapper: React.FC<AntiCheatWrapperProps> = ({ children, onViolation }) => {
  const [violations, setViolations] = useState<string[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let copyPasteHandler: (e: ClipboardEvent) => void;
    let visibilityHandler: () => void;
    let contextMenuHandler: (e: MouseEvent) => void;

    // Disable copy-paste
    copyPasteHandler = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation('Copy/Paste attempted');
    };

    // Detect tab switching
    visibilityHandler = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount === 1) {
            setShowWarning(true);
            addViolation('Tab switch detected (Warning)');
          } else if (newCount >= 2) {
            addViolation('Multiple tab switches - Quiz terminated');
            onViolation('tab-switch');
          }
          return newCount;
        });
      }
    };

    // Disable right-click context menu
    contextMenuHandler = (e: MouseEvent) => {
      e.preventDefault();
      addViolation('Right-click attempted');
    };

    document.addEventListener('copy', copyPasteHandler);
    document.addEventListener('paste', copyPasteHandler);
    document.addEventListener('cut', copyPasteHandler);
    document.addEventListener('visibilitychange', visibilityHandler);
    document.addEventListener('contextmenu', contextMenuHandler);

    return () => {
      document.removeEventListener('copy', copyPasteHandler);
      document.removeEventListener('paste', copyPasteHandler);
      document.removeEventListener('cut', copyPasteHandler);
      document.removeEventListener('visibilitychange', visibilityHandler);
      document.removeEventListener('contextmenu', contextMenuHandler);
    };
  }, [onViolation]);

  const addViolation = (violation: string) => {
    setViolations(prev => [...prev, violation]);
  };

  return (
    <div className="relative">
      {/* Anti-cheat Status Bar */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Anti-cheat Active</span>
            {tabSwitchCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                Tab switches: {tabSwitchCount}
              </span>
            )}
          </div>
          <div className="text-xs text-red-600">
            Copy/paste disabled • Right-click disabled • Tab monitoring active
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="p-3 bg-yellow-100 rounded-full w-fit mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Warning</h3>
              <p className="text-gray-600 mb-4">
                Tab switching has been detected. Another violation will result in automatic quiz submission.
              </p>
              <button
                onClick={() => setShowWarning(false)}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Content */}
      {children}

      {/* Violations Log (for debugging) */}
      {violations.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-2">Security Log:</div>
          <div className="space-y-1">
            {violations.map((violation, index) => (
              <div key={index} className="text-xs text-gray-500">
                {new Date().toLocaleTimeString()}: {violation}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};