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
        <Header />
        <Authenticator>
          {({ signOut, user }) => (
            <>
              <button onClick={signOut}>Sign out</button>
              <main>{children}</main>
            </>
          )}
        </Authenticator>
      </body>
    </html>
  );
}
