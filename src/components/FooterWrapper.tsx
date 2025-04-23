"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FooterWrapper = () => {
    const pathname = usePathname();
    const hideFooter = pathname?.startsWith("/exam");

    if (hideFooter) return null;

    return <Footer />;
};

export default FooterWrapper;
