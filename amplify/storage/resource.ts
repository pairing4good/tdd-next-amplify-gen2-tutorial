import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "note-image",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});