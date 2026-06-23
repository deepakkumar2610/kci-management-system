"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm mb-4 border p-5 rounded ">
      <ol className="flex items-center flex-wrap">
        {/* Home */}
        <li>
          <div
            // href="/dashboard"
            className="text-gray-500"
          >
            Dashboard
          </div>
        </li>

        {pathParts.slice(1).map((part, index) => {
          return (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>

              {index === pathParts.length - 2 ? (
                <span className="text-gray-900 font-medium capitalize">
                  {part.replace("-", " ")}
                </span>
              ) : (
                <div className="text-gray-500 capitalize">
                  {part.replace("-", " ")}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
