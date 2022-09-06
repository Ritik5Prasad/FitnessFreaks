import React from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { View } from "react-native";

const ProgressBarComponent = ({ containerWidth, progress, progressColor }) => {
  return (
    <View
      style={{
        width: containerWidth,
        height: RFValue(8, 816),
        borderRadius: RFValue(15, 816),
        backgroundColor: "#ddd",
      }}
    >
      <View
        style={{
          backgroundColor: progressColor,
          positon: "absolute",
          maxWidth: `${progress}%`,
          height: RFValue(8, 816),
          borderRadius: RFValue(15, 816),
        }}
      ></View>
    </View>
  );
};

export default ProgressBarComponent;

// {Platform.OS === "android" ? (
//   <ProgressBarAndroid
//     styleAttr="Horizontal"
//     indeterminate={false}
//     progress={carbs / 400}
//     style={{ width: 160, height:RFValue(20, 816), color: "#006d77" }}
//   />
// ) : (
//   <ProgressViewIOS progress={carbs / 400} />
// )}
