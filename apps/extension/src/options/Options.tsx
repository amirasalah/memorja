import React from 'react';

const Options: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Memorja Options</h1>
      <div className="grid gap-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">General Settings</h2>
          <p>Configure your Memorja settings here.</p>
        </div>
      </div>
    </div>
  );
};

export default Options;
