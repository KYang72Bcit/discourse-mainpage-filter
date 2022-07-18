import I18n from "I18n";
import { getOwner } from "discourse-common/lib/get-owner";

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
    const statuses = ["Recent", "Solved", "Unsolved"].map((status) => {
      return {
        name: I18n.t(`solved.topic_status_filter.${status}`),
        value: status,
      };
    });
    component.set("statuses", statuses);

    const queryStrings = window.location.search;
    if (queryStrings.match(/solved=yes/)) {
      component.set("status", "Solved");
    } else if (queryStrings.match(/solved=no/)) {
      component.set("status", "Unsolved");
    } else {
      component.set("status", "Recent");
    }
  },

  actions: {
    changeStatus(newStatus) {
      const router = getOwner(this).lookup("router:main");
      
      router.transitionTo({ queryParams: { solved: newStatus } });
    },

    getDisnitation (value) {
      //const router = getOwner(this).lookup("router:main");
      console.log (value);

    }
  },

  
};
