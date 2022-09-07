import axios from "axios";

// export default axios.create({
//   baseURL: "https://rongoeirnet.herokuapp.com/vimeo",
//   headers: {
//     "content-type": "application/x-www-form-urlencoded;charset=utf-8",
//   },
// });

export default axios.create({
  baseURL: "http://localhost:3000",
 
});