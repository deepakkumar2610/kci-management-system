"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);
  console.log("pathParts: ", pathParts);

  return (
    <nav className="text-sm mb-4 border p-5 rounded">
      <ol className="flex items-center flex-wrap">
        {/* Home */}
        <li>
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-[#f7931e]"
          >
            Dashboard
          </Link>
        </li>

        {pathParts.slice(1).map((part, index) => {
          const href = "/" + pathParts.slice(0, index + 2).join("/");

          return (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>

              {index === pathParts.length - 2 ? (
                <span className="text-gray-900 font-medium capitalize">
                  {part.replace("-", " ")}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-gray-500 hover:text-[#f7931e] capitalize"
                >
                  {part.replace("-", " ")}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
