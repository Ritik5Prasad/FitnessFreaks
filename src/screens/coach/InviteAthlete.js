import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  BackHandler,
  Button,
  Dimensions,
  Linking,
} from "react-native";
import { auth, db } from "../../utils/firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useDispatch, useSelector } from "react-redux";
import {
  setDbID,
  selectDbId,
  selectUser,
  setUserDetails,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
} from "../../features/userSlice";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import Textarea from "react-native-textarea";
import Share from "react-native-share";
import SendMail from "../components/SendMail";
import Notification from "../components/Notification";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  athlete_card: {
    width: ScreenWidth / 1.05,
    height: RFValue(180, 816),
    backgroundColor: "#2E2E2E",
    // borderWidth: 1,
    // borderColor: "white",
    borderRadius: RFValue(12, 816),
    marginVertical: RFValue(15, 816),
    padding: RFValue(15, 816),
  },
  athlete_cardHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: RFValue(10, 816),
    marginVertical: RFValue(10, 816),
  },
  athlete_image: {
    marginHorizontal: RFValue(10, 816),
    width: ScreenWidth * 0.35,
    height: ScreenWidth * 0.35,
    borderRadius: 100,
    backgroundColor: "white",
    marginRight: RFValue(20, 816),
    marginTop: 0,
  },
  athlete_name: {
    fontSize: RFValue(18, 816),
    color: "black",
    margin: RFValue(15, 816),
    marginBottom: RFValue(5, 816),
  },
  athlete__cardBody: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: RFValue(20, 816),
  },
  share: {
    position: "absolute",
    top: RFValue(20, 816),
    right: RFValue(70, 816),
  },
});

function InvitesAthlete({ navigation }) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [phone, setphone] = useState(null);
  const [name, setname] = useState(null);
  const [email, setemail] = useState(null);
  const [message, setMessage] = useState(
    "Hi Fitness Freak! Join Fitness App today and get started on your fitness journey! Download the app here Android:  and iOS:, and connect with your coach"
  );

  useEffect(() => {
    if (name && name != "") {
      var msg =
        "Hi " +
        name +
        "! Join Fitness App  today and get started on your fitness journey! Download the app here, and link with your coach by typing in the Coach ID as " +
        userData.data.pin;
      setMessage(msg);
    } else {
      var msg =
        "Hi Athlete! Join Fitness App today and get started on your fitness journey! Download the app here Android: availableSoon and iOS : available Soon, and connect with your coach!"
      setMessage(msg);
    }
  }, [name]);

  const SendInvite = async () => {
    var options = { message: message };
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
    setemail(null);
    setname(null);
  };

  const SendEmail = async () => {
    if (email && name) {
      var options = {
        sendTo: email,
        subject: "Athlete Invite",
        body: message,
      };
      SendMail(options);
      alert("Email sent.");
      setemail(null);
      setname(null);
    } else {
      alert("Please enter email Id and name!");
    }
  };

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                paddingRight: RFValue(20, 816),
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-left" type="font-awesome-5" />
            </TouchableOpacity>
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => navigation.toggleDrawer()}
            />
            <Text
              style={{
                fontSize: RFValue(30, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 20,
              }}
            >
              Invites Athlete
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        {/*
        <View style={{paddingTop:RFValue(20,816)}}>
        <Text style={{fontSize:RFValue(18,816),marginBottom:10}}>Athlete Name</Text>
        <TextInput
          style={{backgroundColor:"white",borderRadius:RFValue(8, 816),paddingLeft:RFValue(20,816),borderColor:"rgba(0,0,0,0.5)",padding:RFValue(10, 816),fontSize:RFValue(18,816)}}
          value={name}
          onChangeText={text => {setname(text)}}
          placeholder="Enter Athlete Name"
        />
        </View>

        <Text style={{color:"black",fontSize:RFValue(25,816),marginTop:15}}>Send Invite</Text>

        <View style={{paddingBottom:0,marginTop:15}}>
        <Text style={{fontSize:RFValue(18,816),marginBottom:10}}>Athlete Email ID</Text>
        <TextInput
          style={{backgroundColor:"white",borderRadius:RFValue(8, 816),paddingLeft:RFValue(20, 816),borderColor:"rgba(0,0,0,0.5)",padding:RFValue(10, 816),fontSize:RFValue(18,816)}}
          value={email}
          onChangeText={text => {setemail(text)}}
          placeholder="Enter Athlete Email ID"
        />
        </View>

        <TouchableOpacity onPress={()=>SendEmail()} style={{backgroundColor:"#C19F1E",padding:RFValue(15, 816),alignItems:"center",marginTop:RFValue(20,816),borderRadius:RFValue(25,816)}}>
            <Text style={{color:"black",fontSize:RFValue(20,816)}}>Send Automated Email</Text>
        </TouchableOpacity>

        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:RFValue(20,816)}}>
          <View style={{borderWidth:0.5,width:"30%",height:0.5}}></View>
          <Text style={{fontSize:RFValue(18,816),textAlign:"center",marginHorizontal:RFValue(20,816)}}>OR</Text>
          <View style={{borderWidth:0.5,width:"30%",height:0.5}}></View>


          </View>*/}

        <Textarea
          containerStyle={{
            backgroundColor: "white",
            borderColor: "#DBE2EA",
            borderRadius: RFValue(10, 816),
            padding: RFValue(10, 816),
            marginTop: 20,
            height: 150,
          }}
          onChangeText={(text) => setMessage(text)}
          defaultValue={message}
          maxLength={200}
          editable={false}
        />

        <TouchableOpacity
          onPress={() => SendInvite()}
          style={{
            backgroundColor: "#C19F1E",
            padding: RFValue(15, 816),
            alignItems: "center",
            marginTop: RFValue(20, 816),
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "black", fontSize: 20, color: "white" }}>
            Share Invite
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default InvitesAthlete;
