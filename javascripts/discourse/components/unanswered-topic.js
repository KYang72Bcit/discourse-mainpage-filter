import { action } from "@ember/object";
import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import DiscourseURL from "discourse/lib/url";
import { inject as service } from "@ember/service";
import I18n from "I18n";
import { getOwner } from "discourse-common/lib/get-owner";

export default Component.extend({
  router: service(),

  statuses: ["all", "answered", "unanswered"].map((status) => {
    return {
      name: I18n.t(themePrefix(`topic_answered_filter.${status}`)),
      value: status,
    };
  }),

  @discourseComputed
  queryStatus() {
    let queryStrings = window.location.search;
    if (queryStrings.match(/min_posts=2/)) {
      return "answered";
    } else if (queryStrings.match(/max_posts=1/)) {
      return "unanswered";
    } else {
      return "all";
    }
  },

  @discourseComputed("router.currentRouteName", "router.currentURL")
  shouldRender(currentRouteName, currentURL) {
    let exclusions = settings.exclusions.split("|");
    if (currentRouteName !== "discovery.categories") {
      return !exclusions.includes(currentURL);
    }
  },

  @discourseComputed("currentUser")
  staffOnly(currentUser) {
    const notStaff =
      (!currentUser || (currentUser && !currentUser.staff)) &&
      settings.show_only_for_staff;
    return notStaff;
  },

  @action
  changeStatus(newStatus) {
    let location = window.location;
    let queryStrings = location.search;
    let params = queryStrings.startsWith("?")
      ? queryStrings.substring(1).split("&", 1)
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
    // const router = getOwner(this).lookup("router:main");
    // console.log(router.currentRouteName);
    queryStrings = params.length > 0 ? `?${params.join("&")}` : "";
    // DiscourseURL.routeTo(`${location.pathname}${queryStrings}${location.hash}`);
    if (history.pushState) {
      console.log("finish");
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?max_posts=1';
      window.history.pushState({path:newurl},'',newurl);
  }
  },
});

// export default {
//   shouldRender(args, component) {
//     const router = getOwner(this).lookup("router:main");

//     if (
//       !component.siteSettings.show_filter_by_solved_status ||
//       router.currentPath === "discovery.categories"
//     ) {
//       return false;
//     } else if (component.siteSettings.allow_solved_on_all_topics) {
//       return true;
//     } else {
//       const controller = getOwner(this).lookup(
//         "controller:navigation/category"
//       );
//       return controller && controller.get("category.enable_accepted_answers");
//     }
//   },

//   setupComponent(args, component) {

//     const queryStrings = window.location.search;
//     if (queryStrings.match(/max_posts=1/)) {
//       component.set("status", "unanswered");
//     } 
//   },

//   actions: {
//     changeStatus(newStatus) {
//         let location = window.location;
//         let queryStrings = location.search;
//         let params = queryStrings.startsWith("?")
//           ? queryStrings.substring(1).split("&")
//           : [];
    
//         params = params.filter((param) => {
//           return !param.startsWith("max_posts=") && !param.startsWith("min_posts=");
//         });
    
//         if (newStatus && newStatus !== "all") {
//           if (newStatus === "unanswered") {
//             params.push(`max_posts=1`);
//           } else if (newStatus === "answered") {
//             params.push(`min_posts=2`);
//           }
//         }
    
//         queryStrings = params.length > 0 ? `?${params.join("&")}` : "";
//         DiscourseURL.routeTo(`${location.pathname}${queryStrings}${location.hash}`);
//       },
    
//   },
// };
