import zod from "zod";

const loginVal = zod.object({
  email: zod
    .string()
    .email("invalid email address"),
  name: zod.string(),
  password: zod.string()
}).partial({
  name: true,
  email: true
});

export default loginVal;
