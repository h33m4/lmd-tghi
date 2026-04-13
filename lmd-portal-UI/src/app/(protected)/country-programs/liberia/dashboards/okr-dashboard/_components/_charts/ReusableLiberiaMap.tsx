import React, { useEffect, useRef, useCallback } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";
import { Card } from "@/components/ui/card";
import liberiaJson from "@public/assets/geoJson/liberia.json";

export interface GeoMapData {
  name: string;
  value: number;
}

export type DataMode = "continuous" | "binary";

export interface GeoMapConfig {
  title?: string;
  subtext?: string;
  seriesName?: string;
  dataMode?: DataMode;
  geoJsonData?: any;
  mapName: string;
  data: GeoMapData[];
  colors?: string[];
  height?: string;
  onRegionClick?: (regionName: string) => void;
}

const ReusableGeoMap: React.FC<GeoMapConfig> = ({
  title = "Geographic Distribution",
  subtext = "",
  seriesName = "Data",
  dataMode = "continuous",
  geoJsonData = liberiaJson,
  mapName,
  data,
  colors,
  height = "600px",
  onRegionClick,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);

  // Default color schemes
  const defaultColors = {
    continuous: [
      "#313695",
      "#4575b4",
      "#74add1",
      "#abd9e9",
      "#e0f3f8",
      "#ffffbf",
      "#fee090",
      "#fdae61",
      "#f46d43",
      "#d73027",
      "#a50026",
    ],
    binary: ["#d73027", "#1a9850"], // Red for 0, Green for 1
  };

  const getColorScheme = useCallback(
    () => colors || defaultColors[dataMode],
    [colors, dataMode]
  );

  const getVisualmapConfig = useCallback(() => {
    if (dataMode === "binary") {
      return {
        min: 0,
        max: 1,
        text: ["Secured", "Not Secured"],
        realtime: true,
        calculable: true,
        inRange: {
          color: getColorScheme(),
        },
      };
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    return {
      min: 0,
      max: maxValue,
      realtime: true,
      calculable: true,
      inRange: {
        color: getColorScheme(),
      },
    };
  }, [dataMode, data, getColorScheme]);

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;

      // Initialize chart
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.showLoading();

      try {
        // Register map
        echarts.registerMap(mapName, geoJsonData as any);
        chartInstance.current.hideLoading();

        // Set option
        const option: EChartsOption = {
          title: {
            text: title,
            subtext: subtext,
            left: "right",
          },
          tooltip: {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params: any) {
              if (params.componentSubType === "map") {
                const displayValue =
                  dataMode === "binary"
                    ? params.value === 1
                      ? "Secured"
                      : "Not Secured"
                    : params.value;
                return `${params.name}<br/>${seriesName}: ${displayValue}`;
              }
              return params.name;
            },
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
          visualMap: getVisualmapConfig(),
          series: [
            {
              name: seriesName,
              type: "map",
              roam: true,
              map: mapName,
              emphasis: {
                label: {
                  show: true,
                },
              },
              itemStyle: {
                borderColor: "#999",
              },
              data: data,
            },
          ],
        };

        chartInstance.current.setOption(option);

        // Handle region click
        if (onRegionClick) {
          chartInstance.current.on("click", (params: any) => {
            if (params.componentSubType === "map") {
              onRegionClick(params.name);
            }
          });
        }
      } catch (error) {
        console.error(`Error loading ${mapName} map:`, error);
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
  }, [
    title,
    subtext,
    seriesName,
    dataMode,
    geoJsonData,
    mapName,
    data,
    onRegionClick,
    getVisualmapConfig,
  ]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height }}
      className="border bg-white p-2"
    />
  );
};

export default ReusableGeoMap;
