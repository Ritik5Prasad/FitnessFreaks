import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import Notification from "../components/Notification";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const WorkoutDetails = ({ navigation, route }) => {
  const [modal, setModal] = useState(false);
  return (
    <View
      style={{
        // flex: 1,
        // backgroundColor: "#f3f3f3",
        // alignItems: "center",
        // marginBottom: 0,
        paddingTop: RFValue(20, 816),
        // height: ScreenHeight,
      }}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: RFValue(20, 816),
              }}
              onPress={() => {
                navigation.navigate("LongTermWorkout", {
                  item: route?.params?.item,
                });
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
                textAlign: "center",
                fontWeight: "bold",
                marginLeft: RFValue(20, 816),
              }}
            >
              S&C Circuit
            </Text>
          </View>

          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            justifyContent: "center",
            marginVertical: RFValue(10, 816),
            marginTop: ScreenHeight * 0.08,
            backgroundColor: "#d3d3d3",
            borderBottomLeftRadius: RFValue(20, 816),
            borderBottomRightRadius: RFValue(20, 816),
          }}
        >
          <Image
            style={{
              width: ScreenWidth,
              height: RFValue(200, 816),
              marginBottom: RFValue(20, 816),
              resizeMode: "cover",
            }}
            source={require("../../assets/illustration.jpeg")}
          />
        </View>
        <View
          style={{
            width: ScreenWidth,
            paddingVertical: RFValue(25, 816),
            paddingHorizontal: RFValue(10, 816),
            backgroundColor: "#f3f3f3",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: RFValue(15, 816),
                fontWeight: "700",
                marginBottom: RFValue(10, 816),
              }}
            >
              Workout Details
            </Text>
            <View
              style={{
                padding: RFValue(10, 816),
                backgroundColor: "#ffff",
                borderRadius: RFValue(15, 816),
              }}
            >
              <Text>Name</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#DBE2EA",
                  backgroundColor: "#fff",
                  width: ScreenWidth - RFValue(80, 816),
                  borderRadius: 4,
                  textAlignVertical: "top",
                  padding: RFValue(7, 816),
                  marginBottom: RFValue(5, 816),
                  paddingVertical:
                    Platform.OS === "ios" ? RFValue(15, 816) : RFValue(7, 816),
                  color: "black",
                }}
                value={route?.params?.data?.preWorkout?.workoutName}
              />
              <Text>Description</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#DBE2EA",
                  backgroundColor: "#fff",
                  width: ScreenWidth - RFValue(80, 816),
                  borderRadius: 4,
                  textAlignVertical: "top",
                  padding: RFValue(7, 816),
                  marginBottom: RFValue(5, 816),
                  paddingVertical:
                    Platform.OS === "ios" ? RFValue(15, 816) : RFValue(7, 816),
                  color: "black",
                }}
                value={route?.params?.data?.preWorkout?.workoutDescription}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: RFValue(5, 816),
                }}
              >
                <Text
                  style={{
                    color: "#003049",
                    fontSize: RFValue(12, 816),
                    fontWeight: "bold",
                    marginRight: RFValue(5, 816),
                  }}
                >
                  Equipment needed :
                </Text>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "#707070",
                    borderRadius: 4,
                    paddingHorizontal: RFValue(5, 816),
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {route?.params?.data?.preWorkout?.equipmentsNeeded?.map(
                    (equipment, i) => (
                      <Text
                        key={i}
                        style={{
                          fontSize: RFValue(12, 816),
                        }}
                      >
                        {equipment.name}
                        {i <
                        route?.params?.data?.preWorkout?.equipmentsNeeded
                          ?.length -
                          1
                          ? ", "
                          : null}
                      </Text>
                    )
                  )}
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#003049",
                    fontSize: RFValue(12, 816),
                    fontWeight: "bold",
                    marginRight: RFValue(5, 816),
                  }}
                >
                  Target Muscles :
                </Text>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "#707070",
                    borderRadius: 4,
                    paddingHorizontal: RFValue(5, 816),
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {route?.params?.data?.preWorkout?.targetedMuscleGroup?.map(
                    (muscle, i) => (
                      <Text
                        key={i}
                        style={{
                          fontSize: RFValue(12, 816),
                        }}
                      >
                        {muscle.name}
                        {i <
                        route?.params?.data?.preWorkout?.targetedMuscleGroup
                          ?.length -
                          1
                          ? ", "
                          : null}
                      </Text>
                    )
                  )}
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: RFValue(8, 816),
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRightWidth: 0.5,
                    borderColor: "#707070",
                  }}
                >
                  <Image
                    style={{ width: 13, height: 13, marginRight: 5 }}
                    source={require("../../assets/Icon_material_access_time.png")}
                  />
                  <Text
                    style={{
                      borderWidth: 0.5,
                      borderColor: "#707070",
                      borderRadius: 4,
                      paddingHorizontal: RFValue(5, 816),
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(5, 816),
                    }}
                  >
                    {route?.params?.data?.preWorkout?.workoutDuration}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: RFValue(10, 816),
                    borderRightWidth: 0.5,
                    borderColor: "#707070",
                  }}
                >
                  <Image
                    style={{
                      width: RFValue(10, 816),
                      height: 13,
                      marginRight: 5,
                    }}
                    source={require("../../assets/Icon_awesome_burn.png")}
                  />
                  <Text
                    style={{
                      borderWidth: 0.5,
                      borderColor: "#707070",
                      borderRadius: 4,
                      paddingHorizontal: RFValue(5, 816),
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(5, 816),
                    }}
                  >
                    {route?.params?.data?.preWorkout?.caloriesBurnEstimate}kCal
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: RFValue(5, 816),
                  }}
                >
                  <Image
                    style={{
                      width: 16,
                      height: RFValue(8, 816),
                      marginRight: 5,
                    }}
                    source={require("../../assets/Icon_feather_trending_up.png")}
                  />
                  <Text
                    style={{
                      borderWidth: 0.5,
                      borderColor: "#707070",
                      borderRadius: 4,
                      paddingHorizontal: RFValue(5, 816),
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(8, 816),
                    }}
                  >
                    {route?.params?.data?.preWorkout?.workoutDifficulty}{" "}
                    Difficulty
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontSize: RFValue(15, 816),
                fontWeight: "700",
                marginTop: RFValue(20, 816),
                marginBottom: RFValue(10, 816),
              }}
            >
              Exercises
            </Text>
            <View
              style={{
                padding: RFValue(10, 816),
                backgroundColor: "#ffff",
                borderRadius: RFValue(15, 816),
              }}
            >
              <View>
                {route?.params?.data?.preWorkout?.selectedExercises?.map(
                  (exercise) => (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        margin: 20,
                      }}
                    >
                      <View>
                        <Image
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 5,
                          }}
                          source={{
                            uri: exercise.thumbnail_url,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <View>
                          <Text style={{ marginLeft: 8 }}>
                            {exercise.workoutName}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              alignItems: "center",
                              alignItems: "flex-start",
                              marginLeft: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                              }}
                            >
                              {exercise.sets[0].reps && "reps"}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                              }}
                            >
                              {exercise.sets[0].weights && "weights(kgs)"}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                              }}
                            >
                              {exercise.sets[0].rest && "rest(secs)"}
                            </Text>
                          </View>
                          <View>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              {exercise.sets.map((set) => (
                                <View>
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        marginLeft: 8,
                                      }}
                                    >
                                      {set.reps}
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              {exercise.sets.map((set) => (
                                <View>
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        marginLeft: 8,
                                      }}
                                    >
                                      {set.weights}
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              {exercise.sets.map((set) => (
                                <View>
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        marginLeft: 8,
                                      }}
                                    >
                                      {set.rest}
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default WorkoutDetails;
