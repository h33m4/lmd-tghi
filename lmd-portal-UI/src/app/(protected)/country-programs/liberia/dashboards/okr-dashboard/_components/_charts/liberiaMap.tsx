import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";
import liberiaJson from "@public/assets/geoJson/liberia.json";
import { Card } from "@/components/ui/card";

const LiberiaMap: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;

      // Initialize chart
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.showLoading();

      try {
        // Register map
        chartInstance.current.hideLoading();
        echarts.registerMap("Liberia", liberiaJson as any);

        // Set option
        const option: EChartsOption = {
          title: {
            text: "Liberia Population Estimates",
            subtext: "Data by District",
            left: "right",
          },
          tooltip: {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
          },
          toolbox: {
            show: true,
            left: "left",
            top: "top",
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          series: [
            {
              name: "Liberia Population",
              type: "map",
              roam: true,
              map: "Liberia",
              emphasis: {
                label: {
                  show: true,
                },
              },
              data: [
                { name: "Bomi", value: 84931 },
                { name: "Bong", value: 333481 },
                { name: "Gbarpolu", value: 71464 },
                { name: "Grand Bassa", value: 221693 },
                { name: "Grand Cape Mount", value: 127203 },
                { name: "Grand Gedeh", value: 126678 },
                { name: "Grand Kru", value: 57913 },
                { name: "Lofa", value: 276863 },
                { name: "Margibi", value: 209370 },
                { name: "Maryland", value: 136404 },
                { name: "Montserrado", value: 1144806 },
                { name: "Nimba", value: 462026 },
                { name: "River Gee", value: 66016 },
                { name: "River Cess", value: 65862 },
                { name: "Sinoe", value: 104932 },
              ],
            },
          ],
        };

        chartInstance.current.setOption(option);
      } catch (error) {
        console.error("Error loading Liberia map:", error);
        chartInstance.current?.hideLoading();
      }
    };

    initChart();

    // Handle window resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "600px" }}
      className="border bg-white p-2"
    />
  );
};

export default LiberiaMap;
