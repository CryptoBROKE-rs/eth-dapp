import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import personAddFill from '@iconify/icons-ant-design/carry-out-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import SwapVertIcon from '@material-ui/icons/SwapVert';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Create campaign',
    path: '/dashboard/newCampaign',
    icon: getIcon(personAddFill)
  },
  {title: 'Layer 2 swapper',
  path: '/dashboard/Layer2',
  icon: <SwapVertIcon />
}
];

export default sidebarConfig;
