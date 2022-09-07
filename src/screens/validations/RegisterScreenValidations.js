import * as yup from "yup";

let phoneRegExp = /^[0]?[6789]\d{9}$/;
let passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/;

export const RegisterValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required").nullable(),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email Address is required"),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .matches(
      passwordRegExp,
      "Password must contain at least one letter and one number"
    )
    .required("Password is required"),
  phone: yup.string().required("Phone number is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match!")
    .required("Required"),
  date: yup.string().required("Required"),
});
