"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import KpiDashboardSidebar from "./SideBar";
import { ImperativePanelHandle } from "react-resizable-panels";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import RightSidebar from "@/components/portalFeebdack/rightSideBar/RightSideBar";

interface Props {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  defaultCollapsed: boolean;
}

const KPIDashboardLayout = ({
  children,
  defaultLayout = [15, 85],
  defaultCollapsed = false,
}: Props) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [minSize, setMinSize] = useState(14);

  useLayoutEffect(() => {
    const panelGroup: any = document.querySelector(
      '[data-panel-group-id="group"]'
    );
    const resizeHandles: any = document.querySelectorAll(
      "[data-panel-resize-handle-id]"
    );
    if (!panelGroup) return;
    const observer = new ResizeObserver(() => {
      let height = panelGroup.offsetHeight;

      resizeHandles.forEach((resizeHandle: { offsetHeight: number }) => {
        height -= resizeHandle.offsetHeight;
      });

      setMinSize((100 / height) * 100);
    });
    observer.observe(panelGroup);
    resizeHandles.forEach((resizeHandle: Element) => {
      observer.observe(resizeHandle);
    });

    return () => {
      observer.unobserve(panelGroup);
      resizeHandles.forEach((resizeHandle: Element) => {
        observer.unobserve(resizeHandle);
      });
      observer.disconnect();
    };
  }, []);

  // setIsCollapsed(true);
  const panelButtonHandler = () => {
    // console.log("clcic us");
    const panel = panelRef.current;
    if (!panel) return;
    if (panel?.isCollapsed()) {
      panel.expand();
      // console.info("panel expand", isCollapsed);
    } else {
      panel?.collapse();
      // console.info("panel collape", isCollapsed);
    }
  };

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
      sizes
    )}; path="/`;
  };
  return (
    <ResizablePanelGroup
      autoSaveId={"persistence"}
      direction={"horizontal"}
      className="w-full flex flex-1 overflow-hidden"
      onLayout={onLayout}
    >
      <ResizablePanel
        collapsible={true}
        ref={panelRef}
        minSize={minSize}
        // maxSize={13}
        defaultSize={defaultLayout[0]}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}; path='/'`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}; path='/'`;
        }}
        className={cn(
          isCollapsed &&
            "min-w-[55px] w-[55px] transition-all duration-300 ease-in-out",
          "max-w-[190px] w-[190px] 2xl:w-[200px] 2xl:max-w-[200px]"
        )}
      >
        {/* <div className="w-full bg-primarxy h-full"></div> */}
        <KpiDashboardSidebar isCollapsed={isCollapsed} />
      </ResizablePanel>

      {/* <ResizableHandle
        withHandle={false}
        withButtonHandler
        buttonClickHandler={panelButtonHandler}
        isCollapsed={isCollapsed}
      /> */}
      <div
        className={cn(
          "relative cursor-none border-none border-red-600 flex w-px items-center justify-center  after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90 border"
        )}
      >
        <button
          className="z-[999] border bg-border rounded-full absolute right-[-9px] cursor-pointer"
          onClick={panelButtonHandler}
        >
          {isCollapsed ? (
            <ArrowRightCircleIcon className="h-5 w-5" />
          ) : (
            <ArrowLeftCircleIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        className="w-full h-[calc(100vh-80px)] 2xl:h-[calc(100vh-90px)] flex flex-col overflow-auto  px-2 py-2"
      >
        {children}
      </ResizablePanel>

      {/* <RightSidebar /> */}
    </ResizablePanelGroup>
  );
};

export default KPIDashboardLayout;
