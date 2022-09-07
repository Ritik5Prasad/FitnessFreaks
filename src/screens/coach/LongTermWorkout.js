import "react-native-get-random-values";
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
  Share,
  Dimensions,
  Platform,
} from "react-native";
import { auth, db } from "../../utils/firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Notification from "../components/Notification";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { Icon } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutCard2 from "./WorkoutCard2";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const LongTermWorkout = ({ route, navigation }) => {
  const userType = useSelector(selectUserType);
  const { item } = route.params;
  console.log("HI", item);
  const userData = useSelector(selectUserData);
  const [LongTermWorkouts, setLongTermWorkouts] = useState([]);
  const [Monday, SetMonday] = useState([]);
  const [mon, setMon] = useState([]);

  // useEffect(() => {
  //   let data1Mon = [];

  //   data1Mon.data = item?.data?.weeks[0]?.days?.monday;
  //   SetMonday(data1Mon);
  // }, [item?.data?.weeks[0]?.days?.monday]);
  return (
    <View>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
                paddingHorizontal: RFValue(20, 816),
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
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Start Date : {item.data.selectedDates[0]}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            End Date :{" "}
            {item.data.selectedDates[item.data.selectedDates.length - 1]}
          </Text>
        </View>
        <View>
          <Text
            style={{
              //   fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 20,
            }}
          >
            Selected Athletes :
          </Text>
        </View>
        <View>
          {/* <Text>{item.data.selectedAthletes.map((ath) => ath.name)}</Text> */}
          {item.data.selectedAthletes.map((ath) => (
            <View
              style={{
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                  source={{
                    uri: ath.imageUrl,
                  }}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontWeight: "200",
                    color: "black",
                  }}
                >
                  {ath.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 20, marginLeft: 10 }}>
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
            }}
          >
            Workout Name
          </Text>
          <TextInput
            style={{
              marginTop: 10,
              width: 300,
              height: 40,
              backgroundColor: "white",
              borderRadius: 10,
              borderColor: "grey",
              borderWidth: 0.5,
            }}
            value={item.data.workoutName}
            editable={false}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            width: ScreenWidth,
            margin: 2,
          }}
        >
          <ScrollView horizontal>
            {item.data.weeks.map((Data, idx) => (
              <View
                style={{
                  width: ScreenWidth,
                  height: 1250,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  marginLeft: 1,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    Week {idx + 1}
                  </Text>
                  <Icon
                    name="arrow-right"
                    type="font-awesome-5"
                    style={{
                      alignSelf: "flex-end",
                      marginRight: 20,
                    }}
                  />
                  <View
                    style={{
                      width: 250,
                      height: 150,
                      alignSelf: "center",
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Monday
                    </Text>
                    <View style={{}}>
                      {console.log("Hi Monday", Data.days.monday)}
                      {Data.days.monday ? (
                        <View
                          style={{
                            alignSelf: "center",
                            marginTop: 10,
                          }}
                        >
                          <WorkoutCard2
                            //   key={0}
                            // workouts={item.data.weeks[0]?.days}
                            // item={Monday}
                            data={Data.days.monday}
                            // // idx={0}
                            item={item}
                            navigation={navigation}
                            // type="non-editable"
                          />
                        </View>
                      ) : (
                        <Text
                          style={{
                            textAlign: "center",
                            marginTop: 55,
                            color: "grey",
                          }}
                        >
                          No Workouts
                        </Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      width: 250,
                      height: 150,
                      alignSelf: "center",
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Tuesday
                    </Text>
                    {Data.days.tuesday ? (
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <WorkoutCard2
                          //   key={0}
                          // workouts={item.data.weeks[0]?.days}
                          // item={Monday}
                          // idx={0}
                          navigation={navigation}
                          item={item}
                          // type="non-editable"
                          data={Data.days.tuesday}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 55,
                          color: "grey",
                        }}
                      >
                        No Workouts
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      width: 250,
                      height: 150,

                      alignSelf: "center",
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Wednesday
                    </Text>
                    {Data.days.wednesday ? (
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <WorkoutCard2
                          //   key={0}
                          // workouts={item.data.weeks[0]?.days}
                          // item={Monday}
                          // idx={0}
                          navigation={navigation}
                          item={item}
                          // type="non-editable"
                          data={Data.days.wednesday}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 55,
                          color: "grey",
                        }}
                      >
                        No Workouts
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      width: 250,
                      height: 150,

                      alignSelf: "center",
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Thursday
                    </Text>
                    {Data.days.thursday ? (
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <WorkoutCard2
                          //   key={0}
                          // workouts={item.data.weeks[0]?.days}
                          // item={Monday}
                          // idx={0}
                          navigation={navigation}
                          item={item}
                          // type="non-editable"
                          data={Data.days.thursday}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 55,
                          color: "grey",
                        }}
                      >
                        No Workouts
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      width: 250,
                      height: 150,

                      alignSelf: "center",
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Friday
                    </Text>
                    {Data.days.friday ? (
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <WorkoutCard2
                          //   key={0}
                          // workouts={item.data.weeks[0]?.days}
                          // item={Monday}
                          // idx={0}
                          navigation={navigation}
                          item={item}
                          // type="non-editable"
                          data={Data.days.friday}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 55,
                          color: "grey",
                        }}
                      >
                        No Workouts
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      width: 250,
                      height: 150,

                      alignSelf: "center",
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Saturday
                    </Text>
                    {Data.days.saturday ? (
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <WorkoutCard2
                          //   key={0}
                          // workouts={item.data.weeks[0]?.days}
                          // item={Monday}
                          // idx={0}
                          navigation={navigation}
                          item={item}
                          // type="non-editable"
                          data={Data.days.saturday}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 55,
                          color: "grey",
                        }}
                      >
                        No Workouts
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      width: 250,
                      height: 150,

                      alignSelf: "center",
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        textAlign: "center",
                        marginTop: 5,
                      }}
                    >
                      Sunday
                    </Text>
                    {Data.days.sunday ? (
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <WorkoutCard2
                          //   key={0}
                          // workouts={item.data.weeks[0]?.days}
                          // item={Monday}
                          // idx={0}
                          navigation={navigation}
                          item={item}
                          // type="non-editable"
                          data={Data.days.sunday}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 55,
                          color: "grey",
                        }}
                      >
                        No Workouts
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LongTermWorkout;
