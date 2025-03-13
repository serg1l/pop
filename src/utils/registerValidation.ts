import zod from "zod";

const registerVal = zod.object({
  name: zod
    .string()
    .min(3, "min 3 characters length")
    .max(30, "max 30 characters length"),
  email: zod
    .string()
    .email("invalid email address")
    .max(256, "at most 256 charactes"),
  password: zod
    .string()
    .min(8, "min 8 characters length")
    .max(128, "max 128 characters length")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export default registerVal;
