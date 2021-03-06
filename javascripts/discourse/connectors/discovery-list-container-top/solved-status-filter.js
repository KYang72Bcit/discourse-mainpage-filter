import I18n from "I18n";
import { getOwner } from "discourse-common/lib/get-owner";
import { and } from "@ember/object/computed";
import discourseComputed, { observes } from "discourse-common/utils/decorators";



export default {
  shouldRender(args, component) {
    const router = getOwner(this).lookup("router:main");
    console.log("current router name",router.currentRouteName);
    if (
      !component.siteSettings.show_filter_by_solved_status 
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

  },

  actions: {
    changeStatus(newStatus) {
        const btn = document.querySelector(`#${newStatus}`);
        const siblings = btn.parentNode.childNodes;
        console.log(siblings);
        siblings.forEach(sibling =>{
          if(sibling.classList && sibling.classList.contains('currentIn')) {
            sibling.classList.remove('currentIn');
          }})
        btn.classList.add('currentIn'); 
        const router = getOwner(this).lookup("router:main");
        router.transitionTo({ queryParams: { solved: newStatus } });
      
      
    },
    
   
  },

  
};
