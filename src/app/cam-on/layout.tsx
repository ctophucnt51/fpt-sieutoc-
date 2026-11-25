import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Ký Thành Công",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CamOnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
