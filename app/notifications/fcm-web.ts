// Import the functions you need from the SDKs you need
import { api } from "@/config/api-client";
import { useUserStore } from "@/stores/user-store";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVJ4N323w-BHjhRAHiR579U601JUDjVPQ",
  authDomain: "techreva-doorstepsnepal-2082.firebaseapp.com",
  projectId: "techreva-doorstepsnepal-2082",
  storageBucket: "techreva-doorstepsnepal-2082.firebasestorage.app",
  messagingSenderId: "257279015429",
  appId: "1:257279015429:web:c2040312e779e199f0ba6c",
  measurementId: "G-2C59HV48MZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const messaging = getMessaging(app);

// onMessage(messaging, (payload) => {
//   console.log("Push received:", payload);
// });


// export const generateToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     console.log("Permission:", permission);

//     if (permission === "granted") {
//       const token = await getToken(messaging, {
//         vapidKey: "BNRKqrI1g__nDo-X6g_Gj0W60mj7QnSczW8E1jLH5WjD9HP3WMxyJRrCXS-5YJTPcb4xLUudTidQxAM6IMlXGI4",
//       });
//       console.log("FCM Token:", token);
//     }
//   } catch (err) {
//     console.error("FCM error:", err);
//   }
// };



let messaging: any = null;

if (typeof window !== 'undefined') {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export { messaging };

const getBrowserInfo = (): string => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const ua = navigator.userAgent;
  if (ua.indexOf("Chrome") > -1) return "Chrome";
  if (ua.indexOf("Firefox") > -1) return "Firefox";
  if (ua.indexOf("Safari") > -1) return "Safari";
  if (ua.indexOf("Edge") > -1) return "Edge";
  return "Unknown";
};

const storeToken = (token: string) => {
  localStorage.setItem('fcmToken', token);
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('fcmToken');
};

const removeStoredToken = () => {
  localStorage.removeItem('fcmToken');
  localStorage.removeItem('pendingFcmToken');
};

export const generateToken = async (force: boolean = false) => {
  try {
    if (!messaging) {
  
      return null;
    }

    // Check if already token and don't want to force refresh
    const existingToken = getStoredToken();
    if (existingToken && !force) {
      console.log("📦 Using existing FCM token:", existingToken);
      return existingToken;
    }

    const permission = await Notification.requestPermission();
  

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      console.log(" FCM Token generated:", token);
      storeToken(token);
      
      // Get current user from store
      const currentUser = useUserStore.getState().user;
      
      if (currentUser?.id) {
    
        await registerTokenWithServer(token, currentUser.id);
      } else {
      
        localStorage.setItem('pendingFcmToken', token);
      }
      
      return token;
    }
  } catch (err) {

  }
};

export const registerTokenWithServer = async (token: string, userId: number) => {
  try {
    const response = await api.post('/device_tokens', {
      fcm_token: token,
      platform: 'web',
      browser: getBrowserInfo()
    });
    
    localStorage.removeItem('pendingFcmToken');
    return response;
  } catch (error) {

    throw error;
  }
};

export const unregisterToken = async () => {
  try {
    const token = getStoredToken();
    if (!token) return;
    
    await api.delete('/device_tokens', {
      // data: { fcm_token: token }
    });
    
    removeStoredToken();

  } catch (error) {
   
    // Still remove local token even if server fails
    removeStoredToken();
  }
};

export const refreshTokenRegistration = async () => {
  const currentUser = useUserStore.getState().user;
  const pendingToken = localStorage.getItem('pendingFcmToken');
  const existingToken = getStoredToken();
  
  if (!currentUser?.id) return;
  
  // Case 1: We have a pending token (generated before login)
  if (pendingToken) {
    console.log("📦 Registering pending token for user:", currentUser.id);
    await registerTokenWithServer(pendingToken, currentUser.id);
  }
  // Case 2: We have an existing token but not registered with this user
  else if (existingToken) {

    await registerTokenWithServer(existingToken, currentUser.id);
  }
  // Case 3: No token exists, generate new one
  else {

    await generateToken(true);
  }
};



