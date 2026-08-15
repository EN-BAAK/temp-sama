"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles, X, Settings2, LogOut } from "lucide-react";
import { cn } from "@/utils/tools";
import { navItems } from "@/constants/global";
import Button from "@/libraries/forms/components/Button";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import Avatar from "@/components/Avatar";
import { useLogout } from "@/features/useAuth";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAppContext();
  const { mutateAsync, isPending } = useLogout()

  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const closeMobileSidebar = () => setIsOpenMobile(false);
  const openMobileSidebar = () => setIsOpenMobile(true);
  const doCollapse = () => setIsCollapsed(true)
  const undoCollapse = () => setIsCollapsed(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const logout = async () => await mutateAsync()

  return (
    <React.Fragment>
      {isOpenMobile && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-[1000] bg-muted/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
        />
      )}

      <aside
        className={cn(
          `fixed right-0 top-0 h-screen z-[1001] flex flex-col shrink-0 bg-second border-l border-border 
           transition-all duration-300 ease-in-out w-64`,
          isOpenMobile ? "translate-x-0" : "translate-x-full",

          `lg:static lg:-translate-x-0 lg:transition-[width] lg:duration-300`,
          isCollapsed ? "lg:w-[68px]" : "lg:w-64"
        )}
      >
        {!isOpenMobile && (
          <Button
            icon={Settings2}
            onClick={openMobileSidebar}
            variant="primary"
            className="lg:hidden absolute -left-6 w-fit top-35 z-20 p-1 rounded-xs"
            iconClassName="w-4 h-4"
          />
        )}

        <div
          className={cn(
            "flex items-center border-b border-accent/10 px-4 transition-all duration-300",
            isCollapsed ? "lg:justify-center flex-wrap h-20" : "justify-between h-16"
          )}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-4 h-4 text-reversed" />
            </div>

            <div className={cn("leading-tight block", isCollapsed && "lg:hidden")}>
              <div className="font-heading font-bold text-reversed text-sm">سما بلودان</div>
              <div className="text-accent text-xs">العقارية</div>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              icon={X}
              onClick={closeMobileSidebar}
              variant="transparent"
              className="lg:hidden text-reversed/65 hover:text-reversed w-fit"
            />

            <Button
              icon={isCollapsed ? ChevronLeft : ChevronRight}
              variant="transparent"
              className="hidden lg:flex text-reversed/65 hover:text-reversed"
              onClick={isCollapsed ? undoCollapse : doCollapse}
            />
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <div className={cn("space-y-0.5", isCollapsed ? "lg:px-2 px-3" : "px-3")}>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  title={isCollapsed ? item.title : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative text-right",
                    active
                      ? "bg-primary text-reversed shadow-md"
                      : "text-reversed/65 hover:text-reversed hover:bg-background/10",
                    isCollapsed ? "lg:justify-center" : "justify-start"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />

                  <span className={cn("flex-1 font-medium truncate block", isCollapsed && "lg:hidden")}>
                    {item.title}
                  </span>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full font-semibold bg-accent text-reversed block",
                        active && "bg-reversed/20 text-reversed",
                        isCollapsed && "lg:hidden"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && item.badge && (
                    <span className="hidden lg:block absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warning border border-reversed" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={cn("p-4 border-t border-accent/10 space-y-2", isCollapsed && "lg:p-2")}>
          <div
            className={cn(
              "flex items-center gap-3 px-1 py-1 rounded-xl transition-colors",
              isCollapsed ? "lg:justify-center" : "justify-between"
            )}
          >
            <Avatar name={user.fullName[0]} />

            <div className={cn("flex-1 min-w-0 text-right block", isCollapsed && "lg:hidden")}>
              <div className="text-reversed text-sm font-medium truncate leading-tight">
                {user?.fullName}
              </div>
            </div>

            <Button
              icon={LogOut}
              onClick={logout}
              disabled={isPending}
              variant="transparent"
              className={cn(
                "text-reversed/65 hover:text-reversed w-fit",
                isCollapsed && "lg:hidden"
              )}
            />
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
};

export default Sidebar;