import { useCallback } from "react";
import { PropTypes } from "prop-types";

import { createCSVDownload, downloadCSV } from "./utils";

export const CsvDownloader = ({ columns, datas, extension, filename, separator, children }) => {
  const handleClick = useCallback(() => {
    createCSVDownload(
      columns,
      datas,
      { downloadOptions: { separator, filename: filename + extension } },
      downloadCSV
    );
  }, [columns, datas, extension, filename, separator]);

  return (
    <div onClick={handleClick} role="button" tabIndex={0}>
      {children}
    </div>
  );
};

CsvDownloader.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.array,
  datas: PropTypes.array,
  extension: PropTypes.string,
  filename: PropTypes.string,
  separator: PropTypes.string,
};
