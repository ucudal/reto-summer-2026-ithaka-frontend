"use client";

import { Provider } from "react-redux";
import { store } from ".";
import RoleProvider from "../components/role-context";
import SettingsProvider from "@/src/components/settings-context";
import { ThemeProvider } from "@/src/components/theme-provider";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <SettingsProvider>
          <RoleProvider>{children}</RoleProvider>
        </SettingsProvider>
      </ThemeProvider>
    </Provider>
  );
};
