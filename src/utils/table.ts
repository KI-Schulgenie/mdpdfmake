import { Tokens } from "Tokens";
import { pdfMakeText } from "./text";

export const pdfMakeTable = async (
  token: Tokens.Table | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  const numberOfColumns = token.header.length;
  const widths = Array(numberOfColumns).fill("*");

  const table = {
    table: {
      widths,
      body: [],
    },
  };

  const headers = [];
  for (const cell of token.header) {
    const tokens = [];
    for (const token of cell.tokens) {
      tokens.push(await pdfMakeText(token, [], false));
    }
    headers.push(tokens);
  }

  table.table.body.push(headers);

  for (const row of token.rows) {
    const contentRow = [];
    for (const cell of row) {
      const tokens = [];
      for (const token of cell.tokens) {
        tokens.push(await pdfMakeText(token, [], false));
      }
      contentRow.push(tokens);
    }

    table.table.body.push(contentRow);
  }

  if (push) {
    content.push(table);
  }

  return table;
};
