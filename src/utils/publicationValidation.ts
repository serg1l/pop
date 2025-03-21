import zod from "zod";

const publiVal = zod.object({
  content: zod.string()
    .max(142, "limit of 142 characters")
    .min(1, "min of 1 character")
});

export default publiVal;
