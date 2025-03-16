import React, { useState, useEffect } from 'react';
import { getStorage, setStorage } from '@/utils/storage';

const Options: React.FC = () => {
  const [settings, setSettings] = useState({
    enableFeatureA: false,
    enableFeatureB: false,
    theme: 'light',
    apiKey: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load settings
    const loadSettings = async () => {
      const storage = await getStorage();
      setSettings(storage);
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setStorage(settings);
      setSaveStatus('Settings saved successfully');

      // Update the UI
      setTimeout(() => {
        setSaveStatus('');
        setIsSaving(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('Failed to save settings');
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Memorja Options</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block mb-2">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>  
        <button 
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        {saveStatus && (
          <div className="mt-2 text-sm text-green-600">
            {saveStatus}
          </div>
        )}
      </form>
    </div>
  );
};

export default Options;
