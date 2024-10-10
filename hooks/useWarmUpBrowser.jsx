// import React from "react";
// import * as WebBrowser from "expo-web-browser";

// export const useWarmUpBrowser = () => {
//     React.useEffect(() => {
    
//       void WebBrowser.warmUpAsync();
//       return () => {
//         void WebBrowser.coolDownAsync();
//       };
//     }, []);
//   };
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        try {
          await WebBrowser.coolDownAsync();
        } catch (err) {
          console.error('Failed to cool down browser', err);
        }
      })();
    }
  }, []);
}
