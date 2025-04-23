"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
    const pathname = usePathname();
    const hideNavbar = pathname?.startsWith("/exam");

    if (hideNavbar) return null;

    return <Navbar />;
};

export default NavbarWrapper;
