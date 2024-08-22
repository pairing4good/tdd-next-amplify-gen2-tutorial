"use client";

import Header from "./header";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Authenticator>
          {({ signOut, user }) => (
            <>
              <Header />
              <main>{children}</main>
            </>
          )}
        </Authenticator>
      </body>
    </html>
  );
}
