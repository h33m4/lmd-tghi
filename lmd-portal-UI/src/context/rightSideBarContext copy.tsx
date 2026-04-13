"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type SidebarContent = "comments" | "feedback" | "ai-agent" | null;

interface RightSidebarContextProps {
  isRightSidebarOpen: boolean;
  content: SidebarContent;
  openComments: () => void;
  openFeedback: () => void;
  openAiAgent: () => void;
  closeSidebar: () => void;
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
  }, []);

  const closeSidebar = useCallback(() => {
    setIsRightSidebarOpen(false);
    setContent(null);
  }, []);

  return (
    <RightSidebarContext.Provider
      value={{
        isRightSidebarOpen,
        content,
        openComments,
        openFeedback,
        openAiAgent,
        closeSidebar,
      }}
    >
      {children}
    </RightSidebarContext.Provider>
  );
};
