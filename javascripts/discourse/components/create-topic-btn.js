import Component from "@ember/component";
import FilterModeMixin from "discourse/mixins/filter-mode";
import NavItem from "discourse/models/nav-item";
import bootbox from "bootbox";
import discourseComputed from "discourse-common/utils/decorators";
import { NotificationLevels } from "discourse/lib/notification-levels";
import { inject as service } from "@ember/service";

export default Component.extend(FilterModeMixin, {
    router: service(),
    tagName: "",

    actions: {
        clickCreateTopicButton() {
            if (this.categoryReadOnlyBanner && !this.hasDraft) {
              bootbox.alert(this.categoryReadOnlyBanner);
            } else {
              this.createTopic();
            }
          },

    }
})