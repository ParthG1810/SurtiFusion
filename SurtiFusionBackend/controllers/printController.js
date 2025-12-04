// backend/controllers/printController.js
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

exports.printLabels = (req, res) => {
  const { customers } = req.body;
  if (!Array.isArray(customers) || customers.length === 0) {
    return res.status(400).json({ message: 'No customers to print' });
  }

  // Open your USB Zebra GX430d
  const device  = new escpos.USB();  
  device.open(err => {
    if (err) {
      console.error('Printer open error:', err);
      return res.status(500).json({ message: 'Could not open printer' });
    }

    // For each customer, send a ZPL block
    customers.forEach(name => {
      // ZPL for 4″×2″ label at 203 DPI:
      // - ^PW812 → print width 812 dots (4"×203 dpi)
      // - ^LL406 → label length 406 dots (2"×203 dpi)
      // - ^CF0,48 → default font A at 48-pt height
      // - ^FO20,20 → field origin with small margin
      const zpl = `
^XA
^PW812
^LL406
^CF0,48
^FO20,20^FB772,1,0,C,0^FD${name}^FS
^XZ
`;

      // Send raw ZPL
      device.write(Buffer.from(zpl, 'utf8'));
    });

    // Close (flush) after a small delay to ensure all data is sent
    setTimeout(() => {
      device.close();
      res.json({ message: 'Labels sent to printer' });
    }, 500);
  });
};
