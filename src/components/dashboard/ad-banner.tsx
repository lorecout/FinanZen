
"use client";

import React, { useEffect, useState } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobError } from '@capacitor-community/admob';
import { isPlatform } from '@capacitor/core';
import { useAuth } from '@/hooks/use-auth';

const AdBanner: React.FC = () => {
    const { isPremium } = useAuth();
    const [isAdInitialized, setIsAdInitialized] = useState(false);

    const showBanner = async () => {
        const options: BannerAdOptions = {
             // Use a testing Ad Unit ID
            adId: isPlatform('android') ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-3940256099942544/2934735716',
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: true,
        };

        try {
            await AdMob.showBanner(options);
        } catch (e) {
            if (e instanceof AdMobError && e.message.includes('already been displayed')) {
                // Ad is already displayed, which is fine
            } else {
                 console.error("AdMob Error:", e);
            }
        }
    };
    
    const hideBanner = async () => {
        try {
            await AdMob.hideBanner();
            await AdMob.removeBanner();
        } catch (e) {
             // Ignore errors during hiding/removing, as it might already be gone
        }
    }

    useEffect(() => {
        const initializeAdMob = async () => {
            try {
                await AdMob.initialize({
                    requestTrackingAuthorization: true,
                    testingDevices: [],
                    initializeForTesting: true,
                });
                setIsAdInitialized(true);
            } catch (e) {
                console.error("AdMob Initialization Error:", e);
            }
        }
        
        // Only run on native platforms
        if (isPlatform('android') || isPlatform('ios')) {
           initializeAdMob();
        }
    }, []);

    useEffect(() => {
        if (!isAdInitialized || !isPlatform('android') && !isPlatform('ios')) {
            return;
        }

        if (!isPremium) {
            showBanner();
        } else {
            hideBanner();
        }
        
        return () => {
             // Clean up when the component unmounts or premium status changes
            hideBanner();
        }

    }, [isPremium, isAdInitialized]);

    // This component does not render anything itself, it just controls the native banner.
    // We add an empty div with padding to prevent the ad from overlaying content.
    if (!isPremium && (isPlatform('android') || isPlatform('ios'))) {
        return <div className="pb-12 md:pb-14"></div>;
    }

    return null;
};

export default AdBanner;
