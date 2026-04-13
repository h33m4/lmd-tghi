const MarkdownRenderer = ({ content }: { content: string }) => {
  // Split content into lines for processing
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let currentIndex = 0;

  while (currentIndex < lines.length) {
    const line = lines[currentIndex];

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={currentIndex}
          className="text-lg font-bold mt-4 mb-2 text-gray-800 dark:text-white"
        >
          {line.replace("### ", "")}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={currentIndex}
          className="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-white"
        >
          {line.replace("## ", "")}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={currentIndex}
          className="text-2xl font-bold mt-4 mb-3 text-gray-800 dark:text-white"
        >
          {line.replace("# ", "")}
        </h1>,
      );
    }
    // Table detection
    else if (line.includes("|") && lines[currentIndex + 1]?.includes("|")) {
      const tableLines: string[] = [];
      let tableIndex = currentIndex;

      // Collect all table lines
      while (tableIndex < lines.length && lines[tableIndex].includes("|")) {
        tableLines.push(lines[tableIndex]);
        tableIndex++;
      }

      if (tableLines.length > 1) {
        const headerRow = tableLines[0]
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell);
        const dataRows = tableLines.slice(2).map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell),
        );

        elements.push(
          <div key={currentIndex} className="my-3 overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-600 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {headerRow.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600"
                    >
                      {header.replace(/\*\*/g, "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {dataRows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-gray-100 dark:border-gray-700"
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {cell.replace(/\*\*/g, "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );

        currentIndex = tableIndex - 1;
      }
    }
    // Bold text
    else if (line.includes("**")) {
      const parts = line.split("**");
      const formattedLine = parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <strong key={idx} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      );
      elements.push(
        <p
          key={currentIndex}
          className="mb-2 text-sm text-gray-700 dark:text-gray-300"
        >
          {formattedLine}
        </p>,
      );
    }
    // List items
    else if (line.startsWith("- ")) {
      const listItems: string[] = [];
      let listIndex = currentIndex;

      while (listIndex < lines.length && lines[listIndex].startsWith("- ")) {
        listItems.push(lines[listIndex].replace("- ", ""));
        listIndex++;
      }

      elements.push(
        <ul key={currentIndex} className="list-disc list-inside mb-3 space-y-1">
          {listItems.map((item, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-700 dark:text-gray-300 ml-2"
            >
              {item.replace(/\*\*/g, "")}
            </li>
          ))}
        </ul>,
      );

      currentIndex = listIndex - 1;
    }
    // Regular paragraph
    else if (line.trim()) {
      elements.push(
        <p
          key={currentIndex}
          className="mb-2 text-sm text-gray-700 dark:text-gray-300"
        >
          {line.replace(/\*\*/g, "")}
        </p>,
      );
    }
    // Empty line
    else {
      elements.push(<br key={currentIndex} />);
    }

    currentIndex++;
  }

  return <div className="space-y-1">{elements}</div>;
};

export default MarkdownRenderer;
