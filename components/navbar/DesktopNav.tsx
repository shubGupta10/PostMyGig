import Link from "next/link"
import { publicNavItems, authenticatedNavItems, adminNavItems } from "@/lib/config/navigation"
import { Session } from "next-auth"

interface DesktopNavProps {
  session: Session | null
}

export function DesktopNav({ session }: DesktopNavProps) {
  const isAdmin = session?.user?.role === "admin"

  return (
    <div className="hidden lg:flex items-center justify-center flex-1 px-8">
      <ul className="flex items-center space-x-2">
        {publicNavItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          </li>
        ))}

        {session &&
          authenticatedNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}

        {session &&
          isAdmin &&
          adminNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}
