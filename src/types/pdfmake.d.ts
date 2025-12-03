declare global {
  interface Window {
    pdfMake: any;
  }
}

declare module 'pdfmake/build/pdfmake' {
  const pdfMake: any;
  export = pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const pdfFonts: any;
  export = pdfFonts;
}

export {};