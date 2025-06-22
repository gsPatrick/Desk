import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      {/* 
        CORREÇÃO: Remova o `className` daqui.
        Isso permite que o CSS em `globals.css` assuma o controle total 
        da estilização do body, incluindo a troca de tema.
      */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}