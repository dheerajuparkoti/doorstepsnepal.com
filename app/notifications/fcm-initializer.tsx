"use client";

import { useEffect } from "react";
import { generateToken,messaging } from "@/app/notifications/fcm-web";
import { onMessage } from "firebase/messaging";

export default function FCMInitializer() {
  useEffect(() => {
    generateToken();
    console.log("payload starst");
    onMessage(messaging,(payload)=>{
      console.log("im here XXXXXXXXXXXXXXXX");
      console.log(payload);
    })
      console.log("payload end");
  }, []);
  

  return null;
}
