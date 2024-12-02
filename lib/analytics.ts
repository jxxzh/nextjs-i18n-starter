'use client'

import type { Analytics } from 'firebase/analytics'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import { getApps, initializeApp } from 'firebase/app'

let analytics: Analytics | undefined

export async function createFirebaseApp() {
  // 开发环境不初始化
  if (process.env.NEXT_PUBLIC_APP_ENV === 'development')
    return
  const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  if (getApps().length <= 0) {
    const supported = await isSupported()
    if (supported) {
      const app = initializeApp(clientCredentials)
      analytics = getAnalytics(app)
    }
  }
}

export function reportEvent(eventName: string, eventParams?: { [key: string]: any }) {
  if (analytics) {
    logEvent(analytics, eventName, eventParams)
  }
}
