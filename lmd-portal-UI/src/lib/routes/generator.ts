import { glob } from "glob";
import { writeFileSync, readFileSync } from "fs";
import path from "path";

import {
  extractMetadata,
  getDefaultLabel,
  getDefaultName,
  mergeRoutes,
  Route,
} from "./utils";
import pageRoutes2 from "./pageRoutes";

const manualRoutes: Route[] = pageRoutes2.map((route: any) => ({
  ...route,
}));

export async function generateRoutes(): Promise<Route[]> {
  try {
    console.log("Starting route generation...");
    const pages = await glob("src/app/**/page.tsx", {
      ignore: ["src/app/api/**", "src/app/layout.tsx"],
    });
    console.log("Found pages:", pages);

    if (pages.length === 0) {
      console.log(
        "No pages found. Check glob pattern and directory structure."
      );
      return manualRoutes;
    }

    const routes: Route[] = pages.map((page) => {
      console.log("Processing page:", page);
      const routePath = page
        .replace("src/app", "")
        .replace("/page.tsx", "")
        .replace(/\/\(.*\)\//, "/");

      const content = readFileSync(page, "utf-8");
      const metadata = extractMetadata(content);

      return {
        label: metadata.label || getDefaultLabel(routePath),
        name: metadata.title || getDefaultName(routePath),
        href: routePath || "/",
        description: metadata.description,
        keywords: metadata.keywords || [],
        isSearchable: metadata.isSearchable !== false,
        metadata: metadata,
      };
    });

    console.log("Generated routes:", routes);
    const mergedRoutes = mergeRoutes(routes, manualRoutes);
    console.log("Final merged routes:", mergedRoutes);

    writeFileSync(
      path.join(process.cwd(), "src/lib/routes/generated-routes.json"),
      JSON.stringify(mergedRoutes, null, 2)
    );

    return mergedRoutes;
  } catch (error) {
    console.error("Error details:", error);
    return manualRoutes;
  }
}
