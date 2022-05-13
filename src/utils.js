function escapeDangerousCSVCharacters(data) {
  if (typeof data === "string") {
    // Places single quote before the appearance of dangerous characters if they
    // are the first in the data string.
    return data.replace(/^\+|^\-|^\=|^\@/g, "'$&");
  }

  return data;
}

function buildCSV(columns, data, options) {
  const replaceDoubleQuoteInString = (columnData) =>
    typeof columnData === "string" ? columnData.replace(/\"/g, '""') : columnData;

  const buildHead = (columns) => {
    return (
      columns
        .reduce(
          (soFar, column) =>
            soFar +
            '"' +
            escapeDangerousCSVCharacters(replaceDoubleQuoteInString(column.id)) +
            '"' +
            options.downloadOptions.separator,
          ""
        )
        .slice(0, -1) + "\r\n"
    );
  };
  const CSVHead = buildHead(columns);

  const buildBody = (data) => {
    if (!data.length) return "";
    const rawCols = columns.map((col) => col.id);
    //const filteredCols = filterCols(data, rawCols);
    return data
      .reduce(
        (soFar, row) =>
          soFar +
          '"' +
          rawCols
            .map((colName) =>
              escapeDangerousCSVCharacters(replaceDoubleQuoteInString(row[colName]))
            )
            .join('"' + options.downloadOptions.separator + '"') +
          '"\r\n',
        ""
      )
      .trim();
  };
  const CSVBody = buildBody(data);

  return options.onDownload
    ? options.onDownload(buildHead, buildBody, columns, data)
    : `${CSVHead}${CSVBody}`.trim();
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv" });

  /* taken from react-csv */
  if (navigator && navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const dataURI = `data:text/csv;charset=utf-8,${csv}`;

    const URL = window.URL || window.webkitURL;
    const downloadURI =
      typeof URL.createObjectURL === "undefined" ? dataURI : URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.setAttribute("href", downloadURI);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function createCSVDownload(columns, data, options, downloadCSV) {
  const csv = buildCSV(columns, data, options);

  if (options.onDownload && csv === false) {
    return;
  }

  downloadCSV(csv, options.downloadOptions.filename);
}

export { createCSVDownload, buildCSV, downloadCSV, escapeDangerousCSVCharacters };
