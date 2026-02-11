"use client";

import { Provider } from "react-redux";
import { store } from ".";
import RoleProvider from "../components/role-context";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <RoleProvider>{children}</RoleProvider>
    </Provider>
  );
};
