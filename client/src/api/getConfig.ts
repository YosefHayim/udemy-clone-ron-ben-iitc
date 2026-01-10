import { axiosClient } from "./configuration";

interface Config {
  googleClientId: string;
}

export const getConfig = async (): Promise<Config> => {
  const response = await axiosClient.get("/api/config");
  return response.data;
};
