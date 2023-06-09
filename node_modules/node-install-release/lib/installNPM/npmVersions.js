module.exports = [
  { gte: '10.0.0', bundled: '6.14.4' },
  { gte: '8.0.0', lt: '10.0.0', bundled: '6.13.4' },
  { gte: '6.0.0', lt: '8.0.0', bundled: '3.10.10' },
  { gte: '4.0.0', lt: '6.0.0', bundled: '2.15.11', maximum: 5 },
  { gte: '0.12.0', lt: '4.0.0', bundled: '2.15.11', maximum: 3 },
  { lt: '0.12.0', bundled: '1.2.30', maximum: 3 },
];
