import React, { useState } from 'react';
import { trpc } from './index';
import { Button } from '@/components/ui/button';

const Popup: React.FC = () => {
  const [localCount, setLocalCount] = useState(0);
  
  // tRPC queries and mutations
  const hello = trpc.hello.useQuery({ name: 'Chrome Extension' });
  const getCount = trpc.getCount.useQuery(undefined);
  const incrementMutation = trpc.incrementCount.useMutation({
    onSuccess: (data) => {
      console.log(`Incremented by ${data.incrementedBy}`);
    },
  });

  // Direct chrome API communication
  const fetchCountFromStorage = () => {
    chrome.runtime.sendMessage({ type: 'GET_COUNT' }, (response) => {
      if (response.success) {
        setLocalCount(response.count);
      }
    });
  };

  const incrementCountInStorage = () => {
    chrome.runtime.sendMessage(
      { type: 'INCREMENT_COUNT', payload: { amount: 1 } },
      (response) => {
        if (response.success) {
          setLocalCount(response.count);
        }
      }
    );
  };

  // Call content script
  const analyzeCurrentPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.tabs.sendMessage(
          tab.id,
          { type: 'ANALYZE_PAGE' },
          (response) => {
            console.log('Page analysis:', response);
            if (response?.success) {
              alert(`Found ${response.data.elementCount} elements on the page`);
            }
          }
        );
      }
    });
  };

  return (
    <div className="w-80 p-4 space-y-4">
      <h1 className="text-xl font-bold text-primary">Advanced Extension</h1>
      
      {hello.data && (
        <div className="p-3 bg-muted rounded">
          <p>{hello.data.greeting}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <h2 className="text-sm font-medium">Local Storage Counter</h2>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{localCount}</span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={fetchCountFromStorage}>
              Fetch
            </Button>
            <Button size="sm" onClick={incrementCountInStorage}>
              Increment
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-sm font-medium">tRPC Counter</h2>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            {getCount.data?.count ?? '?'}
          </span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => getCount.refetch()}>
              Fetch
            </Button>
            <Button 
              size="sm" 
              onClick={() => incrementMutation.mutate({ amount: 1 })}
              disabled={incrementMutation.isPending}
            >
              Increment
            </Button>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        variant="secondary"
        onClick={analyzeCurrentPage}
      >
        Analyze Current Page
      </Button>
      
      <div className="pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
        >
          Open Options
        </Button>
      </div>
    </div>
  );
};

export default Popup;