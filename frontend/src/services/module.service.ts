import { Module } from "../types/module.types";
import axiosInstance from "../utils/axiosInstance";

export const getModuleByName = async (name: string): Promise<Module> => {
  const response = await axiosInstance.get(`/module/${name}`);
  return response.data.data;
};
