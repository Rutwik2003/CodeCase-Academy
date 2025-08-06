import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface MaintenanceConfig {
  enabled: boolean;
  title: string;
  message: string;
  estimatedDuration: string;
  enabledAt?: string;
  enabledBy?: string;
}

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time updates to maintenance config
    const unsubscribe = onSnapshot(
      doc(db, 'system', 'maintenance'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as MaintenanceConfig;
          setMaintenanceConfig(data);
          setIsMaintenanceMode(data.enabled);
        } else {
          // If document doesn't exist, assume maintenance is off
          setIsMaintenanceMode(false);
          setMaintenanceConfig(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to maintenance config:', error);
        // On error, assume maintenance is off to avoid blocking users
        setIsMaintenanceMode(false);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    isMaintenanceMode,
    maintenanceConfig,
    loading
  };
};
