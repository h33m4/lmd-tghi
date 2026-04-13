"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

type SidebarContent = "comments" | "feedback" | "ai-agent" | null;

type PageContext = {
  pageName: string;
  title: string;
  url: string;
  content: string;
};

interface RightSidebarContextProps {
  isRightSidebarOpen: boolean;
  content: SidebarContent;
  openComments: () => void;
  openFeedback: () => void;
  openAiAgent: () => void;
  closeSidebar: () => void;
  capturePageContext: () => void;
  pageContext: PageContext | null;
}

const RightSidebarContext = createContext<RightSidebarContextProps | undefined>(
  undefined
);

export const useRightSidebar = (): RightSidebarContextProps => {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error(
      "useRightSidebar must be used within a RightSidebarProvider"
    );
  }
  return context;
};

interface RightSidebarProviderProps {
  children: ReactNode;
}

export const RightSidebarProvider: React.FC<RightSidebarProviderProps> = ({
  children,
}) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [content, setContent] = useState<SidebarContent>(null);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);

  // function to capture page contents
  const capturePageContext = useCallback(() => {
    try {
      // Get main content area (excluding the sidebar)
      const mainContent =
        document.querySelector("[data-main-content]") ||
        document.querySelector("main") ||
        document.body;

      let htmlContent = "";

      if (mainContent) {
        // Clone the element to avoid modifying the original
        const clonedContent = mainContent.cloneNode(true) as Element;

        // Remove sidebar elements
        clonedContent
          .querySelectorAll("aside, [data-sidebar]")
          .forEach((el) => el.remove());

        // Remove script, style, noscript elements
        clonedContent
          .querySelectorAll("script, style, noscript, meta")
          .forEach((el) => el.remove());

        // Remove all class attributes and other bloating attributes
        clonedContent.querySelectorAll("*").forEach((el) => {
          el.removeAttribute("class");
          el.removeAttribute("style");

          // Remove data attributes
          Array.from(el.attributes).forEach((attr) => {
            if (attr.name.startsWith("data-")) {
              el.removeAttribute(attr.name);
            }
          });
        });

        // Get the cleaned HTML
        htmlContent = clonedContent.innerHTML || "";

        // Clean up whitespace and limit size
        htmlContent = htmlContent
          .replace(/\s+/g, " ") // Normalize whitespace
          .replace(/>\s+</g, "><") // Remove spaces between tags
          .trim()
          .slice(0, 10000);
      }

      // Extract metadata from head
      const getMetaContent = (name: string) => {
        const meta = document.querySelector(
          `meta[name="${name}"], meta[property="${name}"]`
        );
        return meta?.getAttribute("content")?.trim() || "";
      };

      // Create context object
      const contextData = {
        pageName: document.title,
        title:
          document.querySelector("h1")?.textContent?.trim() || document.title,
        description: getMetaContent("description"),
        url: window.location.href,
        htmlContent: htmlContent,
      };

      const context = {
        pageName: contextData.pageName,
        title: contextData.title,
        url: contextData.url,
        content: JSON.stringify(contextData),
      };

      setPageContext(context);
      // console.log("HTML content captured:", {
      //   length: htmlContent.length,
      //   content: htmlContent,
      // });

      return context;
    } catch (error) {
      console.error("Error capturing page context:", error);
      return null;
    }
  }, []);

  const openComments = useCallback(() => {
    setContent("comments");
    setIsRightSidebarOpen(true);
  }, []);

  const openFeedback = useCallback(() => {
    setContent("feedback");
    setIsRightSidebarOpen(true);
  }, []);

  const openAiAgent = useCallback(() => {
    setContent("ai-agent");
    setIsRightSidebarOpen(true);

    // Capture page context when AI agent is opened
    setTimeout(() => {
      capturePageContext();
    }, 100);
  }, [capturePageContext]);

  const closeSidebar = useCallback(() => {
    setIsRightSidebarOpen(false);
    setContent(null);
  }, []);

  // Listen for route changes and capture context for AI agent
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = () => {
      // Only capture context if AI agent is open
      if (content === "ai-agent" && isRightSidebarOpen) {
        setTimeout(() => {
          capturePageContext();
        }, 200);
      }
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener("popstate", handleRouteChange);

    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleRouteChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [content, isRightSidebarOpen, capturePageContext]);

  return (
    <RightSidebarContext.Provider
      value={{
        isRightSidebarOpen,
        content,
        openComments,
        openFeedback,
        openAiAgent,
        closeSidebar,
        capturePageContext,
        pageContext,
      }}
    >
      {children}
    </RightSidebarContext.Provider>
  );
};
