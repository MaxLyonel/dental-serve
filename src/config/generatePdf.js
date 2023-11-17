const pdfMake = require('pdfmake');
const path = require('path');
const numeroEnLetras = require('./convertNumbertoString');

const { format } = require('date-fns');
const esES = require('date-fns/locale/es')

const generateDocument = async (order) => {
  const fonts = {
    Roboto: {
      normal: path.join(__dirname, './../../assets/fonts/Roboto/Roboto-Regular.ttf'),
      bold: path.join(__dirname, './../../assets/fonts/Roboto/Roboto-Medium.ttf'),
      italics: path.join(__dirname, './../../assets/fonts/Roboto/Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, './../../assets/fonts/Roboto/Roboto-MediumItalic.ttf')
    }
  };

  const printer = new pdfMake(fonts);
  const docDefinition = {
    content: [
      {
        table: {
          widths: ['*', '13%', '19%', '*'],
          body: [
            [
              { text: 'DENTISTA', style: 'tableHeader' },
              '',
              { text: 'COMPROBANTE N°', style: 'tableComprobante', },
              '',
              // `${order.id}`
            ],
            [
              // { text: `Sucursal: ${order.warehouseId.name}`, style: 'tableHeader' },
              '',
              '',
              '',
              '',
            ],
          ],

        },
        layout: 'noBorders',
      },
      { text: '\n' },
      { text: `COMPROBANTE DE PAGO`, fontSize: 24, alignment: 'center' },
      { text: '\n' },
      {
        table: {
          widths: ['15%', '50%', '*', '*'],
          body: [
            [
              { text: 'Fecha:', style: 'tableTitle' },
              `${format(order.date, 'dd MMMM yyyy', { locale: esES })}`,
              '',
              '',
            ],
            [
              { text: 'Razon Social:', style: 'tableTitle' },
              `${order.customer.name}`,
              '',
              '',
            ],
            [
              { text: 'NIT/CI/Otro:', style: 'tableTitle' },
              `${order.customer.identityCard}`,
              '',
              '',
            ],
            [
              { text: 'Emitido por:', style: 'tableTitle' },
              `${order.user.name}`,
              '',
              '',
            ],
          ],

        },
        layout: 'noBorders',
      },
      { text: '\n' },
      // {
      //   table: {
      //     widths: ['12%', '*', '20%', '15%'],
      //     body: [
      //       [
      //         { text: 'CANTIDAD', style: 'tableHeader' },
      //         { text: 'DESCRIPCION', style: 'tableHeader' },
      //         { text: 'PRECIO UNIT.', style: 'tableHeader' },
      //         { text: 'SUBTOTAL', style: 'tableHeader' },
      //       ],
      //       ...order.outputIds.map(element => {
      //         return [
      //           `${element.quantity}`,
      //           `${element.productStatusId.productId.code} - ${element.productStatusId.productId.name} - ${element.productStatusId.name}`,
      //           `${element.price}`,
      //           `${element.quantity * element.price}`,
      //         ]
      //       })

      //     ],
      //   },
      // },
      {
        table: {
          widths: ['*', '36.8%'],
          body: [
            [
              // { text: `Son: ${numeroEnLetras(order.total)} 00/100 Bolivianos`, style: 'tableTitle' },
              // {
              //   table: {
              //     widths: ['57.7%', '*'],
              //     body: [
              //       [
              //         { text: 'TOTAL:', style: 'tableComprobante' },
              //         `${order.total}`
              //       ],
              //     ]
              //   }
              // }
            ]
          ]
        },
        layout: 'noBorders',
      }
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: 'center'
      },
      tableTitle: {
        bold: true,
        fontSize: 10,
        alignment: 'left'
      },
      tableComprobante: {
        bold: true,
        fontSize: 10,
        alignment: 'right'
      }
    }
  };

  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    pdfDoc.on('end', async () => {
      const pdfData = Buffer.concat(chunks);
      const pdfBase64 = pdfData.toString('base64');
      resolve({ pdfBase64 });
    });
    pdfDoc.end();
  });
};

module.exports = generateDocument;
