import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { db } from "../../utils/firebase";
let ScreenWidth = Dimensions.get("window").width;
import ProgressBarComponent from "./ProgressComponent";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { Icon } from "react-native-elements";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

function WaterCard({ date, water, setWater, temperoryData }) {
  const userData = useSelector(selectUserData);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: RFValue(8, 816),
        marginBottom: RFValue(10, 816),
        padding: RFValue(15, 816),
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: RFValue(16, 816), color: "black" }}>
          Water
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              marginRight: RFValue(15, 816),
              backgroundColor: "#C19F1E",
              borderRadius: 6,
              width: RFValue(40, 816),
              height: RFValue(40, 816),
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              if (water > 0) {
                let temp =
                  temperoryData == null
                    ? { ...userData?.data?.metrics }
                    : temperoryData;

                if (temp[date]) {
                  let t = { ...temp[date] };
                  t.water = water - 1;
                  temp[date] = t;
                } else {
                  temp[date] = {
                    water: water - 1,
                  };
                }

                db.collection("athletes").doc(userData?.id).update({
                  metrics: temp,
                });

                db.collection("athletes")
                  .doc(userData?.id)
                  .collection("metrics")
                  .doc(date)
                  .update({
                    water: water - 1,
                  });
                setWater(water - 1);
              }
            }}
          >
            <Text
              style={{
                fontSize: RFValue(24, 816),
                fontWeight: "bold",
                color: "white",
                marginBottom: 2,
              }}
            >
              -
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginRight: RFValue(15, 816),
              backgroundColor: "#C19F1E",
              borderRadius: 6,
              width: RFValue(40, 816),
              height: RFValue(40, 816),
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              let temp =
                temperoryData == null
                  ? { ...userData?.data?.metrics }
                  : temperoryData;

              if (temp[date]) {
                let t = { ...temp[date] };
                t.water = water + 1;
                temp[date] = t;
              } else {
                temp[date] = {
                  water: water + 1,
                };
              }

              db.collection("athletes").doc(userData?.id).update({
                metrics: temp,
              });

              db.collection("athletes")
                .doc(userData?.id)
                .collection("metrics")
                .doc(date)
                .update({
                  water: water + 1,
                });
              setWater(water + 1);
            }}
          >
            <Text
              style={{
                fontSize: RFValue(24, 816),
                fontWeight: "bold",
                color: "white",
                marginBottom: 2,
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: RFValue(15, 816) }}>
        <ProgressBarComponent
          containerWidth={"90%"}
          progress={(water / 10) * 100}
          progressColor="#FFE66D"
        />
      </View>
      <Text style={{ marginTop: RFValue(10, 816), fontSize: RFValue(12, 816) }}>
        {water} glasses (250ml)
      </Text>
    </View>
  );
}

export default WaterCard;
