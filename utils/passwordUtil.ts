import crypto from "crypto";

const encrypt = (password: string) => {
  let result = password;

  for (let i = 0; i < 10; i++) {
    result = crypto.createHash("sha256").update(result).digest("hex");
  }

  return result;
};

const Password = {
  encrypt,
};

export default Password;
