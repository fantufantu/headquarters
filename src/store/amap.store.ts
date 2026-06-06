import { using } from "@aiszlab/relax/react";
import { client } from "../api";
import { AMAP_CREDENTIAL } from "../api/amap.api";
import { AmapCredential } from "@/api/amap.types";

interface AmapStore {
  credential: AmapCredential | null;
  loadCredential: () => Promise<AmapCredential | null>;
}

const useAmapStore = using<AmapStore>((setState, getState) => {
  return {
    credential: null,

    loadCredential: async () => {
      let { credential } = getState();
      if (credential) {
        return credential;
      }

      credential =
        (await client.query({ query: AMAP_CREDENTIAL }).catch(() => null))?.data?.amapCredential ??
        null;

      setState((state) => ({
        ...state,
        credential,
      }));

      return credential;
    },
  };
});

export { useAmapStore };
