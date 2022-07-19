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

    const queryStrings = window.location.search;
    if (queryStrings.match(/max_posts=1/)) {
      component.set("status", "unanswered");
    } 
  },

  actions: {
    changeStatus(newStatus) {
        let location = window.location;
        let queryStrings = location.search;
        let params = queryStrings.startsWith("?")
          ? queryStrings.substring(1).split("&")
          : [];
    
        params = params.filter((param) => {
          return !param.startsWith("max_posts=") && !param.startsWith("min_posts=");
        });
    
        if (newStatus && newStatus !== "all") {
          if (newStatus === "unanswered") {
            params.push(`max_posts=1`);
          } else if (newStatus === "answered") {
            params.push(`min_posts=2`);
          }
        }
    
        queryStrings = params.length > 0 ? `?${params.join("&")}` : "";
        DiscourseURL.routeTo(`${location.pathname}${queryStrings}${location.hash}`);
      },
    
  },
};
