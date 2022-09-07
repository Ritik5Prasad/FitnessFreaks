import { db } from "../utils/firebase";

export default async function sendPushNotification(
  userIds,
  notification,
  data,
  imageUrl = null
) {
  console.log("userIds--------->", userIds);
  if (!userIds || userIds.length === 0) {
    console.log("Request should have  one userId");
    return;
  }

  let tokens = [];
  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    const snapshot = await db.collection("tokens").doc(userId).get();
    if (snapshot.exists) {
      tokens = tokens.concat(
        snapshot.get("tokens").map((t) => t.notification_token)
      );
    }
  }
  tokens = tokens.filter((t) => t !== undefined);
  console.log("tokens->", tokens);
  if (tokens.length === 0) {
    console.log("No devices to send");
    return;
  }

  if (!notification && !data) {
    console.log("Request should have notification or data or both");
    return;
  }

  const message = {
    registration_ids: tokens,
  };

  if (notification) {
    Object.assign(message, { notification });
  }

  if (data) {
    Object.assign(message, { data });
  }

  if (imageUrl) {
    Object.assign(message, {
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
          },
        },
        fcm_options: {
          image: imageUrl,
        },
      },
      android: {
        notification: {
          image: imageUrl,
        },
      },
    });
  }
  console.log("message--------------->", message);

  fetch("https://fcm.googleapis.com/fcm/send", {
    body: JSON.stringify(message),
    headers: {
      Authorization:
        "key=AAAABpKEuI8:APA91bFL9RINEXA5dpjcVeXQ5R3ipFfbXI_k33e71UU4gsGCnIw2VxI2OeUkxUnTwhHbcHB0c4m1twvfGjCrf_kUdl_TOi-WX_VBmj_lWbILaAluBQ6dzDIDmcOd8zg04omJTfpHwZOi",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(">>>>>>>"+err));
}
