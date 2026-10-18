const net = require('net');
const dns = require('dns');
const { Client } = require('pg');

const host = 'kbonlineshoppingplatform-db-instance-1.cl0wcim2kxoj.ap-southeast-2.rds.amazonaws.com';
const port = 5432;

console.log('Resolving DNS for:', host);
dns.lookup(host, { all: true }, (err, addresses) => {
  if (err) {
    console.error('DNS Lookup error:', err);
    return;
  }
  console.log('DNS Addresses:', addresses);

  addresses.forEach(({ address, family }) => {
    console.log(`Testing TCP socket to ${address} (IPv${family})...`);
    const socket = new net.Socket();
    socket.setTimeout(4000);
    socket.connect(port, address, () => {
      console.log(`✓ TCP Handshake successful to ${address}`);
      socket.destroy();
    });
    socket.on('error', (e) => {
      console.log(`✗ TCP Error to ${address}:`, e.message);
    });
    socket.on('timeout', () => {
      console.log(`✗ TCP Timeout to ${address}`);
      socket.destroy();
    });
  });
});
