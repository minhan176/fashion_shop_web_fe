export const statusDescription = {
  Placed: 'New order',
  Approved: 'Order approved',
  Delivering: 'Orders are being delivered',
  Paid: 'Order has been paid',
  Completed: 'Completed order',
  Failed: 'Delivery failed',
  Cancelled: 'Order cancelled',
};

export const statusFilter = [
  { status: '', description: 'All orders' },
  { status: 'Placed', description: 'New orders' },
  { status: 'Approved', description: 'Orders approved' },
  { status: 'Delivering', description: 'Orders are being delivered' },
  { status: 'Paid', description: 'Orders have been paid' },
  { status: 'Completed', description: 'Completed orders' },
  { status: 'Failed', description: 'Delivery failed' },
  { status: 'Cancelled', description: 'Orders cancelled' },
];

export const statusAdminUpdate = {
  'Update status': 'null',
  Approved: 'Order approved',
  Delivering: 'Orders are being delivered',
  Failed: 'Delivery failed',
  Completed: 'Completed order',
};

export const dateFilter = [
  { status: 'newest', description: 'Newest' },
  { status: 'latest', description: 'Latest' },
];
