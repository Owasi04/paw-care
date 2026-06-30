"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Moon,
  Sun,
  TextAlignJustify,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";

const CollaborateButton = ({ className }) => (
  <Link href="/auth/login">
    <Button
      className={cn(
        "relative bg-[#fca13a] text-sm font-bold rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden hover:bg-[#ff8800]",
        className,
      )}
    >
      <span className="relative z-10 transition-all duration-500 hover:cursor-pointer">
        Sign In
      </span>
      <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </div>
    </Button>
  </Link>
);

const UserAvatarDropdown = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger className="rounded-full outline-none cursor-pointer">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={user?.image || user?.photoURL || undefined}
            alt={user?.name || "User"}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2">
        <div className="px-2 py-1.5 border-b border-border mb-1">
          <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>

        <DropdownMenuItem
          onClick={() => {
            setMenuOpen(false);
            router.push("/dashboard");
          }}
          className={cn(
            "flex items-center gap-2 w-full cursor-pointer",
            pathname === "/dashboard" && "bg-accent",
          )}
        >
          <LayoutDashboard size={16} />
          <span className="text-sm">Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setMenuOpen(false);
            router.push("/settings");
          }}
          className={cn(
            "flex items-center gap-2 w-full cursor-pointer",
            pathname === "/settings" && "bg-accent",
          )}
        >
          <Settings size={16} />
          <span className="text-sm">Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut size={16} className="mr-2" />
          <span className="text-sm">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Compute navigation items – session‑dependent
  const navigationData = useMemo(() => {
    const base = [
      { title: "Services", href: "/services" },
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
    ];
    if (session?.user) {
      base.push({ title: "Appointments", href: "/dashboard/my-appointments" });
    }
    return base;
  }, [session]);

  // Improved isActive: matches exact or sub‑route, but avoids false positives
  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (isDashboardRoute) return null;

  return (
    <div className="w-full">
      <div className="w-full mx-auto px-4 py-4 sm:px-6">
        <nav
          className={cn(
            "w-full flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500",
            sticky
              ? "p-2.5 bg-background/80 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
              : "bg-transparent border-transparent",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              alt="Logo"
              src="/Logo.jpg"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block flex-1">
            <NavigationMenu className="bg-muted p-0.5 rounded-full mx-auto w-fit">
              <NavigationMenuList className="flex gap-1.5">
                {navigationData.map((navItem) => (
                  <NavigationMenuItem key={navItem.title}>
                    <Link
                      href={navItem.href}
                      className={cn(
                        "px-4 py-2 font-medium rounded-full text-[14px] hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal",
                        isActive(navItem.href) &&
                          "bg-background text-foreground shadow-sm",
                      )}
                    >
                      {navItem.title}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full bg-background border border-border p-2.5 flex items-center justify-center cursor-pointer transition-colors hover:bg-muted"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )
              ) : (
                <div className="w-[18px] h-[18px]" /> // placeholder for hydration
              )}
            </button>

            {/* Auth section – only rendered after mount to avoid flash */}
            {mounted ? (
              session?.user ? (
                <UserAvatarDropdown />
              ) : (
                <CollaborateButton />
              )
            ) : (
              <div className="h-10 w-24 rounded-full bg-muted animate-pulse" />
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full bg-background border border-border p-2.5 flex items-center justify-center cursor-pointer transition-colors hover:bg-muted"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )
              ) : (
                <div className="w-[18px] h-[18px]" />
              )}
            </button>

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2.5 outline-none flex items-center justify-center cursor-pointer transition-colors hover:bg-muted">
                <TextAlignJustify size={20} />
                <span className="sr-only">Menu</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60 mt-2">
                {navigationData.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(item.href);
                    }}
                    className={cn(
                      "w-full cursor-pointer text-sm font-medium py-2",
                      isActive(item.href) && "bg-accent",
                    )}
                  >
                    {item.title}
                  </DropdownMenuItem>
                ))}

                {/* Mobile Auth Section */}
                {mounted && !session?.user && (
                  <div className="mt-2">
                    <CollaborateButton className="w-full justify-center" />
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
