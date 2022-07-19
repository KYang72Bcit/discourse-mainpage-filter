import I18n from "I18n";
import { getOwner } from "discourse-common/lib/get-owner";
import { withPluginApi } from "discourse/lib/plugin-api";



export default {
  shouldRender(args, component) {
    const router = getOwner(this).lookup("router:main");

    if (
      !component.siteSettings.show_filter_by_solved_status ||
      router.currentPath === "discovery.categories"
    ) {
      return false;
    } else if (component.siteSettings.allow_solved_on_all_topics) {
      return true;
    } else {
      const controller = getOwner(this).lookup(
        "controller:navigation/category"
      );
      return controller && controller.get("category.enable_accepted_answers");
    }
  },

  setupComponent(args, component) {
    const statuses = ["Recent", "Solved", "Unsolved", "Unanswered"].map((status) => {
      return {
        name: I18n.t(`solved.topic_status_filter.${status}`),
        value: status,
      };
    });
    component.set("statuses", statuses);

    const queryStrings = window.location.search;
    console.log(queryStrings);
    if (queryStrings.match(/solved=yes/)) {
      component.set("status", "Solved");
    } else if (queryStrings.match(/solved=no/)) {
      component.set("status", "Unsolved");
    } else if (queryStrings.match(/solved=Recent/)){
      component.set("status", "Recent");
    } else {
      component.set("status", "Unanswered");
    }
    withPluginApi("0.11", (api) =>{
      api.onPageChange(() => {

        const buttonList = document.querySelector(".customized-filter").children;
        //console.log(buttonList);
        buttonList.forEach(element => {
          element.addEventListener('click', function(){
            element.parentNode.querySelector(".get-active").classList.remove("get-active");
            element.classList.add("get-active");
          })
        })
        



      })
    })

  },

  actions: {
    changeStatus(newStatus) {
      
      
        const router = getOwner(this).lookup("router:main");
        router.transitionTo({ queryParams: { solved: newStatus } });
      
      
    },
  },

  
};
