import "./globals.css";
import {AuthProvider} from "./providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
export const metadata = {
  title: {
    default: "MSGLet",
    template: "%s | Your App Name",  // pages can set their own prefix
  },
};