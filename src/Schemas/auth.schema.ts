import * as zod from "zod";

export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is required")
      .min(3, "min length is 3 chars")
      .max(10, "max length is 10 chars"),

    email: zod
      .email()
      .nonempty("email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "INVALID email"),
    dateOfBirth: zod
      .string()
      .nonempty("date is required")
      .refine((dateOfBirthValue) => {
        const userDate = new Date(dateOfBirthValue).getFullYear(); // user year
        const nowDate = new Date().getFullYear(); // now year

        return nowDate - userDate > 10;
      }, "Date should be less than ==> 2015"),
    gender: zod.enum(["male", "female"]),
    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "The password must be ≥ 8 characters and contain: an uppercase letter + a lowercase letter + a number + a special character from the list above.",
      ),
    rePassword: zod.string().nonempty("password is required"),
  })
  .refine(
    (obj) => {
      return obj.password == obj.rePassword;
    },
    {
      path: ["rePassword"],
      error: "password and repassword not match",
    },
  );
export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;
////////////////////////////

export const LoginSchema = zod.object({
  email: zod
    .email()
    .nonempty("email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "INVALID email"),

  password: zod
    .string()
    .nonempty("password is required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "The password must be ≥ 8 characters and contain: an uppercase letter + a lowercase letter + a number + a special character from the list above.",
    ),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;
////////////////////////
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const passwordMessage =
  "The password must be ≥ 8 characters and contain: an uppercase letter + a lowercase letter + a number + a special character.";

export const ChangePasswordSchema = zod
  .object({
    password: zod.string().nonempty("current password is required"),

    newPassword: zod
      .string()
      .nonempty("new password is required")
      .regex(passwordRegex, passwordMessage),

    rePassword: zod.string().nonempty("please confirm your password"),
  })
  .refine((obj) => obj.newPassword === obj.rePassword, {
    path: ["rePassword"],
    error: "password and repassword not match",
  })
  .refine((obj) => obj.password !== obj.newPassword, {
    path: ["newPassword"],
    error: "new password must be different from the current one",
  });

export type ChangePasswordSchemaType = zod.infer<typeof ChangePasswordSchema>;
