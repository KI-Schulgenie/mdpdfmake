import { Tokens } from "Tokens";
import { pdfMakeText } from "./text";
import { pdfMakeHR } from "./hr";

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
      if (token.type === "br") {
        tokens.push({ text: "\n" });
      } else if (token.type === "hr") {
        tokens.push(await pdfMakeHR(token, [], false));
      } else {
        tokens.push(await pdfMakeText(token, [], false));
      }
    }
    headers.push(tokens);
  }

  table.table.body.push(headers);

  for (const row of token.rows) {
    const contentRow = [];
    for (const cell of row) {
      const tokens = [];
      for (const token of cell.tokens) {
        if (token.type === "br") {
          tokens.push({ text: "\n" });
        } else if (token.type === "hr") {
          tokens.push(await pdfMakeHR(token, [], false));
        } else {
          tokens.push(await pdfMakeText(token, [], false));
        }
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
