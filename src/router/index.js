import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/ProjectIndex.vue'
import Test from '../views/Test.vue'
import AccountIndex from '../views/account/AccountIndex.vue'
import BillList from '../views/account/AccountDetailTable.vue'
import BillChart from '../views/account/AccountChart.vue'
import BillCategory from '../views/account/AccountBillCategory.vue'
import BillAccount from '../views/account/AccountBillAccount.vue'
import BillShop from '../views/account/AccountBillShop.vue'
import ImageCategory from '../views/image/ImageCategory.vue'
import ImagesForCategory from '../views/image/ImagesForCategory.vue'
import VideoCategory from '../views/video/VideoCategory.vue'
import VideosForCategory from '../views/video/VideosForCategory.vue'
import RecordIndex from '../views/record/RecordIndex.vue'
import PlanIndex from '../views/plan/PlanIndex.vue'
import AddPlan from '../views/plan/AddPlan.vue'
import PlanNotification from '../views/plan/PlanNotificationList.vue'
import UserCenter from '../views/user/UserCenter.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'pageIndex',
    component: Index
  },
  {
    path: '/Test',
    name: 'test',
    component: Test
  },
  {
    path: '/AccountIndex',
    name: 'accountIndex',
    component: AccountIndex
  },
  {
    path: '/BillList',
    name: 'billList',
    component: BillList
  },
  {
    path: '/BillChart',
    name: 'billChart',
    component: BillChart
  },
  {
    path: '/BillCategory',
    name: 'billCategory',
    component: BillCategory
  },
  {
    path: '/BillAccount',
    name: 'billAccount',
    component: BillAccount
  },
  {
    path: '/BillShop',
    name: 'billShop',
    component: BillShop
  },
  {
    path: '/ImageCategory',
    name: 'imageCategory',
    component: ImageCategory
  },
  {
    path: '/ImagesForCategory',
    name: 'imagesForCategory',
    component: ImagesForCategory
  },
  {
    path: '/VideoCategory',
    name: 'videoCategory',
    component: VideoCategory
  },
  {
    path: '/VideosForCategory',
    name: 'videosForCategory',
    component: VideosForCategory
  },
  {
    path: '/RecordIndex',
    name: 'record',
    component: RecordIndex
  },
  {
    path: '/PlanIndex',
    name: 'planIndex',
    component: PlanIndex
  },
  {
    path: '/AddPlan',
    name: 'addPlan',
    component: AddPlan
  },
  {
    path: '/PlanNotification',
    name: 'planNotification',
    component: PlanNotification
  },
  {
    path: '/UserCenter',
    name: 'userCenter',
    component: UserCenter
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
