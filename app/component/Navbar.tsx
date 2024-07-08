'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { HomeIcon, DocumentIcon, UserIcon, PlusIcon, DocumentDuplicateIcon, ChevronDownIcon, LockClosedIcon } from '@heroicons/react/24/outline'

type NavbarProps = {
  session: any;
};

type NavItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

type DropdownItem = {
  href: string;
  label: string;
};

export const Navbar = ({ session }: NavbarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileNavbar session={session} /> : <DesktopNavbar session={session} />;
};

const DesktopNavbar = ({ session }: NavbarProps) => {
  const isAdminOrChecker = session?.pea?.role && ["admin", "checker"].includes(session.pea.role);
  const isAdmin = session?.pea?.role === "admin";

  return (
    <nav className="bg-gradient-to-r from-pea to-purple-500 w-full fixed top-0 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={100} height={50} className="cursor-pointer" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink href="/document" icon={<DocumentIcon className="w-5 h-5" />}>สถานะเอกสาร</NavLink>
              {isAdminOrChecker && (
                <DropdownMenu 
                  title="จัดการเอกสาร" 
                  items={[
                    { href: "/manage-docs", label: "จัดการเอกสารหลายฉบับ" },
                    { href: "/manage-doc", label: "จัดการเอกสาร" },
                  ]} 
                />
              )}
              {isAdmin && <NavLink href="/admin/users" icon={<UserIcon className="w-5 h-5" />}>จัดการผู้ใช้</NavLink>}
              <DropdownMenu 
                title={session?.user?.name || "ผู้ใช้"}
                icon={<UserIcon className="w-5 h-5" />}
                items={[
                  { href: "/user/profile", label: "โปรไฟล์" },
                  { href: session?"/user/out":"/user/profile", label: session?"Logout":"Login" },
                ]} 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const MobileNavbar = ({ session }: NavbarProps) => {
  const isAdmin = session?.pea?.role === "admin";
  const isAdminOrChecker = session?.pea?.role && ["admin", "checker"].includes(session.pea.role);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", icon: <HomeIcon className="w-6 h-6" />, label: "หน้าแรก" },
    { href: "/document", icon: <DocumentIcon className="w-6 h-6" />, label: "สถานะเอกสาร" },
    { href: "/user/profile", icon: <UserIcon className="w-6 h-6" />, label: "โปรไฟล์" },
  ];

  if (isAdminOrChecker) {
    navItems.push(
      { href: "/manage-docs", icon: <DocumentDuplicateIcon className="w-6 h-6" />, label: "จัดการเอกสารหลายฉบับ" },
      { href: "/manage-doc", icon: <DocumentIcon className="w-6 h-6" />, label: "จัดการเอกสาร" }
    );
  }

  if (isAdmin) {
    navItems.push({ href: "/admin/users", icon: <UserIcon className="w-6 h-6" />, label: "จัดการผู้ใช้" });
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-pea to-purple-500 p-4 shadow-lg z-10">
        <div className="flex justify-between items-center">
          <Image src="/logo.png" alt="Logo" width={100} height={25} />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <nav className="fixed z-50 top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-screen-xl mx-auto px-4">
            {navItems.map((item, index) => (
              <NavItem 
                key={index}
                href={item.href} 
                icon={item.icon} 
                label={item.label} 
                currentPath={pathname} 
              />
            ))}
            <NavItem 
              href="/api/auth/signout"
              icon={<LockClosedIcon className="w-6 h-6" />}
              label="Logout"
              currentPath={pathname}
            />
          </div>
        </nav>
      )}
    </>
  );
};

const NavItem = ({ href, icon, label, currentPath }: NavItem & { currentPath: string }) => {
  const isActive = currentPath === href;
  return (
    <Link href={href} className={`flex items-center py-2 ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
      {icon}
      <span className={`ml-2 ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </Link>
  );
};

const NavLink = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <Link href={href}>
    <span className="flex items-center text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
      {icon}
      <span className="ml-2">{children}</span>
    </span>
  </Link>
);

const DropdownMenu = ({ title, icon, items }: { title: string; icon?: React.ReactNode; items: DropdownItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {title}
        <ChevronDownIcon className="w-4 h-4 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};