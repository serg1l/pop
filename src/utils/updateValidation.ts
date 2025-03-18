import zod from "zod";
import registerVal from "./registerValidation.js";

const updateVal = registerVal.extend({ surname: zod.string() }).partial();

export default updateVal;
