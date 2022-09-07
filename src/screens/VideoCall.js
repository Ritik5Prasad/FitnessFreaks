import React, { useEffect } from 'react';
import {Modal} from "react-native"
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import {
  selectUserData,
  selectUser,
  selectTemperoryId,
  selectUserType,
  setTemperoryData
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";


function VideoCall({route,navigation}) {
  const userData = useSelector(selectUserData);


  useEffect(() => {
    setTimeout(() => {
      const url = route.params.url;
      const userInfo = {
        displayName: userData.data?.name,
        email: userData.data?.email,
        avatar: userData.data?.imageUrl,
      };
      JitsiMeet.call(url, userInfo);
      // Você também pode usar o JitsiMeet.audioCall (url) para chamadas apenas de áudio 
      // Você pode terminar programaticamente a chamada com JitsiMeet.endCall () 
    }, 1000);
  }, [])
  

  useEffect(() => {
    console.log(userData?.data)
    return () => {
      JitsiMeet.endCall();
    };
  });

  function onConferenceTerminated(nativeEvent) {
    navigation.goBack();
    //console.log(nativeEvent)
  }

  function onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    //console.log(nativeEvent)
  }

  function onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    //console.log(nativeEvent)
  }
  

      

  return (
    <Modal
      style={{flex:1}}
    >
    <JitsiMeetView
      onConferenceTerminated={e => onConferenceTerminated(e)}
      onConferenceJoined={e => onConferenceJoined(e)}
      onConferenceWillJoin={e => onConferenceWillJoin(e)}
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }}
    />
    </Modal>

  )
}
export default VideoCall;