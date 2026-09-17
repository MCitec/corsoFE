'use strict';

import { initDashboard } from './ui/dashboard.ui';

document.addEventListener('DOMContentLoaded', () => {
  initDashboard().catch(console.error);
});
