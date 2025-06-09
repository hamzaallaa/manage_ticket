import model from '../components/ModalSearch.vue';
import Pagination from '../components/Pagination.vue';
import Paginate from '../components/Paginate.vue';
import BottomBar from '../components/bottomBar.vue';
import TopBar from '../components/topBar.vue';

 
export default {
  install(app) {
    app.component('model', model);
    app.component('Pagination', Pagination);
    app.component('Paginate', Paginate);
    app.component('BottomBar', BottomBar);
    app.component('TopBar', TopBar);
  }
}